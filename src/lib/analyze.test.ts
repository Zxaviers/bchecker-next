import { afterEach, describe, expect, test, vi } from "vitest";
import { AnalyzeError, analyze } from "@/lib/analyze";
import type { CompleteSelection } from "@/lib/selection";

const sel: CompleteSelection = {
  cpuId: "intel-core-i3-13100",
  gpuId: "nvidia-geforce-rtx-3090",
  resolutionId: "fhd",
  purposeId: "gaming",
  refreshHz: 144,
  ramGb: 8,
};

const okBody = {
  cpuName: "Intel Core i3-13100",
  gpuName: "NVIDIA GeForce RTX 3090",
  cpuScore: 114,
  gpuScore: 5077.6,
  bottleneck: 66.1,
  limiting: "CPU",
  note: "Upgrade CPU",
  gpuShare: 0.5,
  cpuPower: 1.2,
  gpuPower: 3.5,
  advisories: [],
};

function mockFetch(impl: (input: string, init?: RequestInit) => Promise<Response>) {
  const fn = vi.fn(impl);
  vi.stubGlobal("fetch", fn);
  return fn;
}

afterEach(() => vi.unstubAllGlobals());

describe("analyze", () => {
  test("returns the parsed body on 200", async () => {
    mockFetch(async () => Response.json(okBody));
    await expect(analyze(sel)).resolves.toEqual(okBody);
  });

  test("POSTs the selection as JSON to /api/bottleneck and passes the signal", async () => {
    const fn = mockFetch(async () => Response.json(okBody));
    const controller = new AbortController();
    await analyze(sel, controller.signal);
    const [url, init] = fn.mock.calls[0];
    expect(url).toBe("/api/bottleneck");
    expect(init?.method).toBe("POST");
    expect(new Headers(init?.headers).get("content-type")).toBe("application/json");
    expect(JSON.parse(String(init?.body))).toEqual(sel);
    expect(init?.signal).toBe(controller.signal);
  });

  test("400 becomes AnalyzeError invalid_input", async () => {
    mockFetch(async () => Response.json({ error: "invalid_input" }, { status: 400 }));
    await expect(analyze(sel)).rejects.toMatchObject({ kind: "invalid_input" });
  });

  test("404 becomes AnalyzeError not_found", async () => {
    mockFetch(async () => Response.json({ error: "not_found" }, { status: 404 }));
    await expect(analyze(sel)).rejects.toMatchObject({ kind: "not_found" });
  });

  test("a 500 becomes AnalyzeError network", async () => {
    mockFetch(async () => new Response("boom", { status: 500 }));
    const err = await analyze(sel).catch((e) => e);
    expect(err).toBeInstanceOf(AnalyzeError);
    expect(err.kind).toBe("network");
  });

  test("a rejected fetch becomes AnalyzeError network", async () => {
    mockFetch(async () => {
      throw new TypeError("Failed to fetch");
    });
    await expect(analyze(sel)).rejects.toMatchObject({ kind: "network" });
  });

  test("a 200 with a non-JSON body becomes AnalyzeError network", async () => {
    mockFetch(async () => new Response("<html>", { status: 200 }));
    await expect(analyze(sel)).rejects.toMatchObject({ kind: "network" });
  });

  test("an aborted request rethrows the AbortError unchanged", async () => {
    mockFetch(async () => {
      throw new DOMException("Aborted", "AbortError");
    });
    const err = await analyze(sel).catch((e) => e);
    expect(err).not.toBeInstanceOf(AnalyzeError);
    expect(err.name).toBe("AbortError");
  });
});
