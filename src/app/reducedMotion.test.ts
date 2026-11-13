import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

describe("reduced motion", () => {
  const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");
  const start = css.indexOf("@media (prefers-reduced-motion: reduce)");
  const block = css.slice(start);

  test("the stylesheet has a reduced-motion block", () => {
    expect(start).toBeGreaterThan(-1);
  });

  test("it removes animation delays so staggered animations don't play", () => {
    expect(block).toMatch(/animation-delay:\s*0s\s*!important/);
  });

  test("it also collapses animation and transition durations", () => {
    expect(block).toMatch(/animation-duration:\s*0\.001ms\s*!important/);
    expect(block).toMatch(/transition-duration:\s*0\.001ms\s*!important/);
  });
});
