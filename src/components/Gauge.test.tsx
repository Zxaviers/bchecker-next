// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";
import { Gauge } from "@/components/Gauge";

afterEach(cleanup);

const filledCount = () =>
  Array.from(screen.getByRole("meter").children).filter((c) =>
    /bg-(accent|warn|danger)/.test(c.className),
  ).length;

describe("Gauge", () => {
  test("0% renders an empty bar with a value of 0", () => {
    render(<Gauge percent={0} severity="low" />);
    expect(screen.getByRole("meter").getAttribute("aria-valuenow")).toBe("0");
    expect(filledCount()).toBe(0);
  });

  test("13.89% fills 3 of 20 segments in the accent colour", () => {
    render(<Gauge percent={13.89} severity="low" />);
    expect(filledCount()).toBe(3);
    const first = screen.getByRole("meter").children[0];
    expect(first.className).toContain("bg-accent");
  });

  test("high severity uses the danger colour", () => {
    render(<Gauge percent={65.97} severity="high" />);
    expect(screen.getByRole("meter").children[0].className).toContain("bg-danger");
  });
});
