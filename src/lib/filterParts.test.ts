import { describe, expect, test } from "vitest";
import { CPUS, GPUS } from "@/data/parts";
import { filterParts } from "@/lib/filterParts";

describe("filterParts", () => {
  test("empty query and no vendor returns everything", () => {
    expect(filterParts(GPUS, "", null)).toEqual(GPUS);
    expect(filterParts(GPUS, "   ", null)).toEqual(GPUS);
  });

  test("matches every word, case-insensitively", () => {
    const ids = filterParts(GPUS, "RTX 3070", null).map((g) => g.id);
    expect(ids).toContain("nvidia-geforce-rtx-3070");
    expect(ids).toContain("nvidia-geforce-rtx-3070-ti");
    expect(ids).not.toContain("nvidia-geforce-rtx-3060");
  });

  test("word order does not matter", () => {
    const ids = filterParts(GPUS, "3070 rtx", null).map((g) => g.id);
    expect(ids).toContain("nvidia-geforce-rtx-3070");
  });

  test("ignores surrounding whitespace", () => {
    expect(filterParts(CPUS, "  i5-13400f  ", null).map((c) => c.id)).toEqual([
      "intel-core-i5-13400f",
    ]);
  });

  test("a query without the separating space finds nothing", () => {
    expect(filterParts(GPUS, "rtx3070", null)).toEqual([]);
  });

  test("vendor filter narrows the result", () => {
    const amd = filterParts(GPUS, "", "AMD");
    expect(amd.length).toBeGreaterThan(0);
    expect(amd.every((g) => g.vendor === "AMD")).toBe(true);
  });

  test("vendor and query combine", () => {
    const ids = filterParts(GPUS, "7800", "AMD").map((g) => g.id);
    expect(ids).toEqual(["amd-radeon-rx-7800-xt"]);
    expect(filterParts(GPUS, "7800", "NVIDIA")).toEqual([]);
  });

  test("no match returns an empty array", () => {
    expect(filterParts(CPUS, "zzzz", null)).toEqual([]);
  });
});
