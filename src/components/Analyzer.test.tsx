// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { Analyzer } from "@/components/Analyzer";
import type { AnalyzeResponse } from "@/lib/analyze";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const body = (bottleneck: number): AnalyzeResponse => ({
  cpuName: "Intel Core i3-13100",
  gpuName: "NVIDIA GeForce RTX 3090",
  cpuScore: 114,
  gpuScore: 5077.6,
  bottleneck,
  limiting: "CPU",
  note: "Upgrade CPU",
  gpuShare: 0.55,
  cpuPower: 1,
  gpuPower: 3,
  advisories: [],
});

interface Deferred {
  resolve: (r: Response) => void;
  signal?: AbortSignal | null;
}

/** fetch mock whose responses are resolved by the test, in any order. */
function deferredFetch() {
  const calls: Deferred[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn((_url: string, init?: RequestInit) => {
      return new Promise<Response>((resolve) => {
        calls.push({ resolve, signal: init?.signal });
      });
    }),
  );
  return calls;
}

function choose(container: HTMLElement) {
  for (const v of [
    "intel-core-i3-13100",
    "nvidia-geforce-rtx-3090",
    "fhd",
    "gaming",
  ]) {
    const input = container.querySelector(`input[type=radio][value="${v}"]`);
    if (!input) throw new Error(`no radio ${v}`);
    fireEvent.click(input);
  }
}

const analyzeButton = () => screen.getByRole("button", { name: "Analyze" });
const meterValue = () => screen.queryByRole("meter")?.getAttribute("aria-valuenow") ?? null;

describe("Analyzer", () => {
  test("a stale response never overwrites the latest request", async () => {
    const calls = deferredFetch();
    const { container } = render(<Analyzer />);
    choose(container);

    fireEvent.click(analyzeButton()); // request A
    fireEvent.click(analyzeButton()); // request B (double click)
    expect(calls).toHaveLength(2);
    expect(calls[0].signal?.aborted).toBe(true);

    // B resolves first, then the stale A arrives late.
    await act(async () => calls[1].resolve(Response.json(body(40))));
    await act(async () => calls[0].resolve(Response.json(body(99))));

    expect(meterValue()).toBe("40");
  });

  test("changing any selection after a result clears it", async () => {
    const calls = deferredFetch();
    const { container } = render(<Analyzer />);
    choose(container);
    fireEvent.click(analyzeButton());
    await act(async () => calls[0].resolve(Response.json(body(55))));
    expect(meterValue()).toBe("55");

    const qhd = container.querySelector('input[type=radio][value="qhd"]');
    fireEvent.click(qhd as Element);
    expect(meterValue()).toBeNull();
    expect(screen.getByText(/your result appears here/i)).toBeTruthy();
  });

  test("changing a selection mid-request discards the late response", async () => {
    const calls = deferredFetch();
    const { container } = render(<Analyzer />);
    choose(container);
    fireEvent.click(analyzeButton());
    fireEvent.click(container.querySelector('input[type=radio][value="qhd"]') as Element);

    await act(async () => calls[0].resolve(Response.json(body(77))));
    expect(meterValue()).toBeNull();
  });

  test("a network failure shows an error and Retry recovers", async () => {
    const calls = deferredFetch();
    const { container } = render(<Analyzer />);
    choose(container);
    fireEvent.click(analyzeButton());
    await act(async () => calls[0].resolve(new Response("boom", { status: 500 })));
    expect(screen.getByRole("alert")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(calls).toHaveLength(2);
    await act(async () => calls[1].resolve(Response.json(body(12))));
    expect(meterValue()).toBe("12");
    expect(screen.queryByRole("alert")).toBeNull();
  });
});
