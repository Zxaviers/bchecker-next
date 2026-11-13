// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";
import { Gauge } from "@/components/Gauge";

afterEach(cleanup);

const fill = () => screen.getByRole("meter").querySelector("[data-fill]") as HTMLElement;
const pointer = () => screen.getByRole("meter").querySelector("[data-pointer]") as HTMLElement;

describe("Gauge", () => {
  test("exposes the value through the meter role", () => {
    render(<Gauge percent={57.16} severity="high" />);
    const m = screen.getByRole("meter");
    expect(m.getAttribute("aria-valuenow")).toBe("57.16");
    expect(m.getAttribute("aria-valuemin")).toBe("0");
    expect(m.getAttribute("aria-valuemax")).toBe("100");
    expect(m.getAttribute("aria-valuetext")).toBe("57.16 percent");
  });

  test("0% renders an empty scale: zero-width fill and the pointer at the start", () => {
    render(<Gauge percent={0} severity="low" />);
    expect(screen.getByRole("meter").getAttribute("aria-valuenow")).toBe("0");
    expect(fill().style.width).toBe("0%");
    expect(pointer().style.left).toBe("0%");
  });

  test("the fill and pointer sit at the true percentage", () => {
    render(<Gauge percent={13.89} severity="low" />);
    expect(fill().style.width).toBe("13.89%");
    expect(pointer().style.left).toBe("13.89%");
  });

  test("values are clamped to the 0-100 scale", () => {
    render(<Gauge percent={140} severity="high" />);
    expect(fill().style.width).toBe("100%");
    cleanup();
    render(<Gauge percent={-5} severity="low" />);
    expect(fill().style.width).toBe("0%");
  });

  test("the fill colour follows severity", () => {
    render(<Gauge percent={65.97} severity="high" />);
    expect(fill().className).toContain("bg-danger");
    cleanup();
    render(<Gauge percent={20} severity="mid" />);
    expect(fill().className).toContain("bg-warn");
    cleanup();
    render(<Gauge percent={5} severity="low" />);
    expect(fill().className).toContain("bg-accent");
  });

  test("the scale is graduated: numerals at 0, 25, 50, 75 and 100", () => {
    render(<Gauge percent={30} severity="mid" />);
    const numerals = Array.from(screen.getByRole("meter").querySelectorAll("[data-numeral]")).map(
      (n) => n.textContent,
    );
    expect(numerals).toEqual(["0", "25", "50", "75", "100"]);
  });

  test("nothing animates in a staggered sequence", () => {
    const { container } = render(<Gauge percent={80} severity="high" />);
    const staggered = Array.from(container.querySelectorAll("*")).filter((e) =>
      ((e as HTMLElement).style.animation ?? "").includes("seg-in"),
    );
    expect(staggered).toHaveLength(0);
  });
});
