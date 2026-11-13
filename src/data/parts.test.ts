import { describe, expect, test } from "vitest";
import { CPUS, GPUS, type Part } from "@/data/parts";

const LOW_SAMPLE_ALLOWED = ["intel-core-i3-13100"];

function checkParts(label: string, parts: Part[]) {
  describe(label, () => {
    test("every part has complete, well-formed source fields", () => {
      for (const p of parts) {
        expect(p.id, p.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
        expect(p.name.length, p.id).toBeGreaterThan(0);
        expect(p.deviceName.length, p.id).toBeGreaterThan(0);
        expect(p.source.length, p.id).toBeGreaterThan(0);
        expect(p.sourceUrl, p.id).toMatch(/^https:\/\//);
        expect(p.capturedOn, p.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(Number.isFinite(p.score) && p.score > 0, p.id).toBe(true);
        expect(Number.isInteger(p.samples) && p.samples >= 1, p.id).toBe(true);
      }
    });

    test("ids are unique", () => {
      const ids = parts.map((p) => p.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    test("only explicitly allowed parts have fewer than 5 samples", () => {
      const low = parts.filter((p) => p.samples < 5).map((p) => p.id);
      for (const id of low) expect(LOW_SAMPLE_ALLOWED).toContain(id);
    });
  });
}

checkParts("CPUS", CPUS);
checkParts("GPUS", GPUS);

describe("catalogue coverage", () => {
  test("has at least 60 CPUs and 60 GPUs", () => {
    expect(CPUS.length).toBeGreaterThanOrEqual(60);
    expect(GPUS.length).toBeGreaterThanOrEqual(60);
  });

  test("keeps the original parts, and the calibration references", () => {
    const cpuIds = CPUS.map((c) => c.id);
    const gpuIds = GPUS.map((g) => g.id);
    for (const id of [
      "intel-core-i3-13100",
      "intel-core-i5-13400",
      "intel-core-i7-13700",
      "intel-core-i9-13900",
      "intel-core-i5-13400f",
    ]) {
      expect(cpuIds).toContain(id);
    }
    for (const id of [
      "nvidia-geforce-rtx-3050",
      "nvidia-geforce-rtx-3070",
      "nvidia-geforce-rtx-3090",
    ]) {
      expect(gpuIds).toContain(id);
    }
  });

  test("includes older hardware (2011-2018 CPUs, 2014-2018 GPUs)", () => {
    const cpuIds = CPUS.map((c) => c.id);
    const gpuIds = GPUS.map((g) => g.id);
    for (const id of [
      "intel-core-i7-2600k",
      "intel-core-i7-4790k",
      "intel-core-i7-6700k",
      "amd-ryzen-5-1600",
    ]) {
      expect(cpuIds).toContain(id);
    }
    for (const id of [
      "nvidia-geforce-gtx-970",
      "nvidia-geforce-gtx-1060-6gb",
      "nvidia-geforce-gtx-1080-ti",
    ]) {
      expect(gpuIds).toContain(id);
    }
  });

  test("every part is read from the same Blender version", () => {
    for (const p of [...CPUS, ...GPUS]) {
      expect(p.source, p.id).toContain("Blender 4.5.0");
      expect(p.sourceUrl, p.id).toContain("blender_version=4.5.0");
    }
  });

  test("covers at least two CPU vendors and three GPU vendors", () => {
    expect(new Set(CPUS.map((c) => c.vendor)).size).toBeGreaterThanOrEqual(2);
    expect(new Set(GPUS.map((g) => g.vendor)).size).toBeGreaterThanOrEqual(3);
  });
});
