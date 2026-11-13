import { describe, expect, test } from "vitest";
import { ramAdvisories } from "@/lib/advisories";

const ids = (...args: Parameters<typeof ramAdvisories>) =>
  ramAdvisories(...args).map((a) => a.id);

describe("ramAdvisories", () => {
  test("gaming with 8 GB warns about 16 GB", () => {
    expect(ids("gaming", "fhd", 8)).toEqual(["ram-gaming-16"]);
  });
  test("gaming with exactly 16 GB has no advisory", () => {
    expect(ids("gaming", "fhd", 16)).toEqual([]);
  });
  test("esports and streaming follow the gaming rule", () => {
    expect(ids("esports", "hd", 8)).toEqual(["ram-gaming-16"]);
    expect(ids("streaming", "qhd", 8)).toEqual(["ram-gaming-16"]);
  });
  test("rendering and video editing with 16 GB warn about 32 GB", () => {
    expect(ids("render", "fhd", 16)).toEqual(["ram-pro-32"]);
    expect(ids("video", "fhd", 16)).toEqual(["ram-pro-32"]);
    expect(ids("render", "fhd", 32)).toEqual([]);
  });
  test("4K with 16 GB warns about 32 GB", () => {
    expect(ids("gaming", "4k", 16)).toEqual(["ram-4k-32"]);
    expect(ids("gaming", "4k", 32)).toEqual([]);
  });
  test("gaming at 4K with 8 GB gets both advisories", () => {
    expect(ids("gaming", "4k", 8)).toEqual(["ram-gaming-16", "ram-4k-32"]);
  });
  test("general use with 8 GB has no advisory", () => {
    expect(ids("general", "fhd", 8)).toEqual([]);
  });
  test("unset RAM gives no advisories", () => {
    expect(ids("gaming", "4k")).toEqual([]);
    expect(ids("gaming", "4k", null)).toEqual([]);
  });
  test("every advisory has a plain-language message", () => {
    for (const a of ramAdvisories("render", "4k", 8)) {
      expect(a.message.length).toBeGreaterThan(10);
    }
  });
});
