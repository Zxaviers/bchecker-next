import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

/**
 * Regression: an unlayered .entry rule overrode Tailwind's layered
 * peer-checked:bg-line-strong, so selected tiles stayed pale with light text.
 * Every custom component class that sets a background, border or shadow must be
 * inside @layer components so utilities can override it.
 */
describe("component classes are layered", () => {
  const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

  /** Brace-depth-aware extraction of the body of `@layer components { ... }`. */
  function layerBody(source: string): string {
    const start = source.indexOf("@layer components");
    if (start === -1) return "";
    let i = source.indexOf("{", start);
    const begin = i + 1;
    let depth = 0;
    for (; i < source.length; i++) {
      if (source[i] === "{") depth++;
      if (source[i] === "}") {
        depth--;
        if (depth === 0) return source.slice(begin, i);
      }
    }
    return "";
  }

  const layered = layerBody(css);
  const unlayered = css.replace(layered, "");

  test("there is a components layer", () => {
    expect(layered.length).toBeGreaterThan(0);
  });

  test.each([".entry", ".sheet", ".paper", ".btn-primary", ".stamp", ".tab"])(
    "%s is defined inside the components layer, not outside it",
    (selector) => {
      expect(layered).toContain(`${selector} {`);
      expect(unlayered).not.toContain(`${selector} {`);
    },
  );
});
