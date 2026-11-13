import { describe, expect, test } from "vitest";
import { CPUS, GPUS, type Cpu, type Gpu } from "@/data/parts";
import {
  GPU_SHARE,
  PURPOSES,
  RESOLUTIONS,
  type PurposeId,
  type ResolutionId,
} from "@/data/options";
import { C_REF, G_REF } from "@/lib/calibration";
import { clampShare, estimate, gpuShare } from "@/lib/model";

const cpu = (id: string): Cpu => {
  const p = CPUS.find((c) => c.id === id);
  if (!p) throw new Error(`missing cpu ${id}`);
  return p;
};
const gpu = (id: string): Gpu => {
  const p = GPUS.find((g) => g.id === id);
  if (!p) throw new Error(`missing gpu ${id}`);
  return p;
};

const I3 = cpu("intel-core-i3-13100");
const I5 = cpu("intel-core-i5-13400f");
const I9 = cpu("intel-core-i9-13900");
const G3050 = gpu("nvidia-geforce-rtx-3050");
const G3070 = gpu("nvidia-geforce-rtx-3070");
const G3090 = gpu("nvidia-geforce-rtx-3090");

describe("gpuShare", () => {
  test("gaming at FHD with no refresh is 0.55", () => {
    expect(gpuShare("gaming", "fhd")).toBeCloseTo(0.55, 10);
  });
  test("gaming at 4K and 240 Hz is 0.65", () => {
    expect(gpuShare("gaming", "4k", 240)).toBeCloseTo(0.65, 10);
  });
  test("esports at HD and 240 Hz is 0.20", () => {
    expect(gpuShare("esports", "hd", 240)).toBeCloseTo(0.2, 10);
  });
  test("120 and 144 Hz both reduce the share by 0.05", () => {
    expect(gpuShare("streaming", "qhd", 120)).toBeCloseTo(0.45, 10);
    expect(gpuShare("streaming", "qhd", 144)).toBeCloseTo(0.45, 10);
  });
  test("refresh rate is ignored for general, video and render", () => {
    expect(gpuShare("render", "hd", 240)).toBeCloseTo(0.8, 10);
    expect(gpuShare("video", "fhd", 240)).toBeCloseTo(0.5, 10);
    expect(gpuShare("general", "4k", 144)).toBeCloseTo(0.25, 10);
  });
  test("null refresh behaves like 60 Hz", () => {
    expect(gpuShare("gaming", "qhd", null)).toBe(gpuShare("gaming", "qhd", 60));
  });
  test("every purpose x resolution pair has a share between 0.10 and 0.90", () => {
    for (const p of PURPOSES) {
      for (const r of RESOLUTIONS) {
        const s = GPU_SHARE[p.id][r.id];
        expect(s, `${p.id}/${r.id}`).toBeGreaterThanOrEqual(0.1);
        expect(s, `${p.id}/${r.id}`).toBeLessThanOrEqual(0.9);
      }
    }
  });
  test("refresh never raises the GPU share", () => {
    for (const p of PURPOSES) {
      for (const r of RESOLUTIONS) {
        const base = gpuShare(p.id, r.id, null);
        for (const hz of [120, 144, 240] as const) {
          expect(gpuShare(p.id, r.id, hz)).toBeLessThanOrEqual(base);
        }
      }
    }
  });
});

describe("clampShare", () => {
  test("clamps to [0.10, 0.90]", () => {
    expect(clampShare(0.02)).toBe(0.1);
    expect(clampShare(0.97)).toBe(0.9);
    expect(clampShare(0.5)).toBe(0.5);
  });
});

describe("calibration", () => {
  test("C_REF is the i5-13400F score and G_REF is RTX 3070 x 0.45/0.55", () => {
    expect(C_REF).toBe(I5.score);
    expect(G_REF).toBeCloseTo((G3070.score * 0.45) / 0.55, 10);
  });
});

describe("estimate", () => {
  const base = { resolution: "fhd" as ResolutionId, purpose: "gaming" as PurposeId };

  test("i5-13400F + RTX 3070 at gaming/FHD is balanced (~0%)", () => {
    const e = estimate({ cpu: I5, gpu: G3070, ...base });
    expect(e.bottleneck).toBeLessThan(0.5);
    expect(e.note).toBe("Balanced");
    expect(e.limiting).toBe("none");
  });

  test("i3-13100 + RTX 3090 at gaming/FHD is CPU-limited above 30%", () => {
    const e = estimate({ cpu: I3, gpu: G3090, ...base });
    expect(e.limiting).toBe("CPU");
    expect(e.note).toBe("Upgrade CPU");
    expect(e.bottleneck).toBeGreaterThan(30);
  });

  test("i9-13900 + RTX 3050 at gaming/FHD is GPU-limited", () => {
    const e = estimate({ cpu: I9, gpu: G3050, ...base });
    expect(e.limiting).toBe("GPU");
    expect(e.note).toBe("Upgrade GPU");
    expect(e.bottleneck).toBeGreaterThan(10);
  });

  test("result is rounded to 2 decimals and exposes the working", () => {
    const e = estimate({ cpu: I3, gpu: G3090, ...base });
    expect(Math.round(e.bottleneck * 100) / 100).toBe(e.bottleneck);
    expect(e.gpuShare).toBeCloseTo(0.55, 10);
    expect(e.cpuPower).toBeGreaterThan(0);
    expect(e.gpuPower).toBeGreaterThan(0);
  });

  test("for a GPU-limited pair, higher resolution never lowers the bottleneck", () => {
    const order: ResolutionId[] = ["hd", "fhd", "qhd", "4k"];
    let prev = -1;
    for (const resolution of order) {
      const e = estimate({ cpu: I9, gpu: G3050, resolution, purpose: "gaming" });
      expect(e.limiting).toBe("GPU");
      expect(e.bottleneck).toBeGreaterThanOrEqual(prev);
      prev = e.bottleneck;
    }
  });

  test("for a CPU-limited esports pair, 240 Hz never lowers the bottleneck vs 60 Hz", () => {
    const at60 = estimate({ cpu: I3, gpu: G3090, resolution: "hd", purpose: "esports", refreshHz: 60 });
    const at240 = estimate({ cpu: I3, gpu: G3090, resolution: "hd", purpose: "esports", refreshHz: 240 });
    expect(at60.limiting).toBe("CPU");
    expect(at240.bottleneck).toBeGreaterThanOrEqual(at60.bottleneck);
  });

  test("weakest CPU + strongest GPU is CPU-limited and below 100%", () => {
    const weakest = [...CPUS].sort((a, b) => a.score - b.score)[0];
    const strongest = [...GPUS].sort((a, b) => b.score - a.score)[0];
    for (const p of PURPOSES) {
      for (const r of RESOLUTIONS) {
        const e = estimate({ cpu: weakest, gpu: strongest, resolution: r.id, purpose: p.id });
        expect(e.bottleneck, `${p.id}/${r.id}`).toBeGreaterThanOrEqual(0);
        expect(e.bottleneck, `${p.id}/${r.id}`).toBeLessThan(100);
      }
    }
    expect(estimate({ cpu: weakest, gpu: strongest, ...base }).limiting).toBe("CPU");
  });

  test("strongest CPU + weakest GPU is GPU-limited and below 100%", () => {
    const strongest = [...CPUS].sort((a, b) => b.score - a.score)[0];
    const weakest = [...GPUS].sort((a, b) => a.score - b.score)[0];
    const e = estimate({ cpu: strongest, gpu: weakest, ...base });
    expect(e.limiting).toBe("GPU");
    expect(e.bottleneck).toBeGreaterThanOrEqual(0);
    expect(e.bottleneck).toBeLessThan(100);
  });
});
