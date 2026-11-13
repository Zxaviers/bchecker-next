import { describe, expect, test } from "vitest";
import { EMPTY_SELECTION, isComplete, type Selection } from "@/lib/selection";

const full: Selection = {
  cpuId: "intel-core-i5-13400f",
  gpuId: "nvidia-geforce-rtx-3070",
  resolutionId: "fhd",
  purposeId: "gaming",
  refreshHz: null,
  ramGb: null,
};

describe("isComplete", () => {
  test("the empty selection is not complete", () => {
    expect(isComplete(EMPTY_SELECTION)).toBe(false);
  });

  test("each missing required field makes it incomplete", () => {
    for (const key of ["cpuId", "gpuId", "resolutionId", "purposeId"] as const) {
      expect(isComplete({ ...full, [key]: null })).toBe(false);
    }
  });

  test("four required fields with optionals unset is complete", () => {
    expect(isComplete(full)).toBe(true);
  });

  test("optional fields do not affect completeness", () => {
    expect(isComplete({ ...full, refreshHz: 144, ramGb: 16 })).toBe(true);
  });

  test("EMPTY_SELECTION has every field null", () => {
    expect(Object.values(EMPTY_SELECTION).every((v) => v === null)).toBe(true);
  });
});
