import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

const read = (p: string) => readFileSync(join(process.cwd(), p), "utf8");

describe("sticky Analyze bar", () => {
  const page = read("src/app/page.tsx");

  test("the paper sheet clips without becoming a scroll container", () => {
    // overflow-hidden on an ancestor makes it the sticky container and the bar never sticks
    expect(page).not.toMatch(/paper[^"]*overflow-hidden/);
    expect(page).toMatch(/paper[^"]*overflow-clip/);
  });

  test("keyboard focus is not hidden behind the sticky bar", () => {
    expect(read("src/app/globals.css")).toMatch(/scroll-padding-bottom:\s*\d/);
  });
});

describe("horizontal overflow from the turned under-sheet", () => {
  test("the page wrapper clips horizontal overflow", () => {
    expect(read("src/app/page.tsx")).toMatch(/overflow-x-clip/);
  });
});

describe("printed boxes are flat ink, not embossed", () => {
  const css = read("src/app/globals.css");

  test("no inset shadows or bevel highlights on form boxes, sheets or buttons", () => {
    expect(css).not.toMatch(/box-shadow:\s*inset/);
    expect(css).not.toMatch(/rgb\(255 255 255 \/ 0\.[0-9]+\) inset/);
  });

  test("the sticky bar has a rule but no upward shadow smudge", () => {
    expect(read("src/components/Loadout.tsx")).not.toMatch(/shadow-\[0_-/);
  });
});

describe("no invented claims", () => {
  test("the footer does not claim a revision number", () => {
    expect(read("src/components/Footer.tsx")).not.toMatch(/revision/i);
  });
});
