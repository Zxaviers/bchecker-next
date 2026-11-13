import { describe, expect, test } from "vitest";
import { severity } from "@/lib/severity";

describe("severity", () => {
  test("0 and 15 are low", () => {
    expect(severity(0)).toBe("low");
    expect(severity(15)).toBe("low");
  });
  test("just above 15 up to 30 is mid", () => {
    expect(severity(15.01)).toBe("mid");
    expect(severity(30)).toBe("mid");
  });
  test("above 30 is high", () => {
    expect(severity(30.01)).toBe("high");
    expect(severity(49.21)).toBe("high");
  });
});
