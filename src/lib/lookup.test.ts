import { describe, expect, test } from "vitest";
import { lookup } from "@/lib/lookup";

const valid = {
  cpuId: "intel-core-i3-13100",
  gpuId: "nvidia-geforce-rtx-3090",
  resolutionId: "fhd",
  purposeId: "gaming",
};

describe("lookup", () => {
  test("resolves a valid request with estimate and parts", () => {
    const r = lookup(valid);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.cpu.id).toBe("intel-core-i3-13100");
    expect(r.gpu.id).toBe("nvidia-geforce-rtx-3090");
    expect(r.estimate.limiting).toBe("CPU");
    expect(r.advisories).toEqual([]);
  });

  test("optional refreshHz and ramGb may be absent or null", () => {
    expect(lookup({ ...valid, refreshHz: null, ramGb: null }).ok).toBe(true);
    expect(lookup({ ...valid, refreshHz: undefined }).ok).toBe(true);
  });

  test("valid refreshHz changes the estimate and ramGb yields advisories", () => {
    const base = lookup({ ...valid, purposeId: "esports", resolutionId: "hd" });
    const fast = lookup({
      ...valid,
      purposeId: "esports",
      resolutionId: "hd",
      refreshHz: 240,
      ramGb: 8,
    });
    expect(base.ok && fast.ok).toBe(true);
    if (!base.ok || !fast.ok) return;
    expect(fast.estimate.gpuShare).toBeLessThan(base.estimate.gpuShare);
    expect(fast.advisories.map((a) => a.id)).toEqual(["ram-gaming-16"]);
  });

  test("refreshHz 75 and ramGb 12 are invalid input", () => {
    expect(lookup({ ...valid, refreshHz: 75 })).toEqual({ ok: false, error: "invalid_input" });
    expect(lookup({ ...valid, ramGb: 12 })).toEqual({ ok: false, error: "invalid_input" });
  });

  test("unknown resolution or purpose is invalid input", () => {
    expect(lookup({ ...valid, resolutionId: "8k" })).toEqual({ ok: false, error: "invalid_input" });
    expect(lookup({ ...valid, purposeId: "mining" })).toEqual({ ok: false, error: "invalid_input" });
  });

  test("missing, empty or non-string part ids are invalid input", () => {
    expect(lookup({ ...valid, cpuId: "" })).toEqual({ ok: false, error: "invalid_input" });
    expect(lookup({ ...valid, gpuId: 3 })).toEqual({ ok: false, error: "invalid_input" });
    const { cpuId: _omitted, ...withoutCpu } = valid;
    void _omitted;
    expect(lookup(withoutCpu)).toEqual({ ok: false, error: "invalid_input" });
  });

  test("non-object input is invalid input", () => {
    for (const bad of [null, undefined, "x", 5, [], true]) {
      expect(lookup(bad)).toEqual({ ok: false, error: "invalid_input" });
    }
  });

  test("unknown part ids are not found", () => {
    expect(lookup({ ...valid, cpuId: "intel-core-i99-0000" })).toEqual({ ok: false, error: "not_found" });
    expect(lookup({ ...valid, gpuId: "nvidia-geforce-rtx-9999" })).toEqual({ ok: false, error: "not_found" });
  });

  test("a GPU id passed as cpuId is not found", () => {
    expect(lookup({ ...valid, cpuId: "nvidia-geforce-rtx-3090" })).toEqual({ ok: false, error: "not_found" });
  });
});
