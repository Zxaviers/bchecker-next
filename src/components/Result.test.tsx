// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { Result } from "@/components/Result";
import type { AnalyzeResponse } from "@/lib/analyze";

afterEach(cleanup);

const balanced: AnalyzeResponse = {
  cpuName: "Intel Core i5-13400F",
  gpuName: "NVIDIA GeForce RTX 3070",
  cpuScore: 196.5,
  gpuScore: 2978.1,
  bottleneck: 0,
  limiting: "none",
  note: "Balanced",
  gpuShare: 0.55,
  cpuPower: 2.22,
  gpuPower: 2.22,
  advisories: [],
};

describe("Result", () => {
  test("a 0% result shows BALANCED, an empty gauge and no limiting part", () => {
    render(<Result state={{ status: "success", data: balanced }} onRetry={() => {}} />);
    expect(screen.getByText("Balanced")).toBeTruthy();
    expect(screen.getByText("Neither part is holding the other back.")).toBeTruthy();
    expect(screen.getByRole("meter").getAttribute("aria-valuenow")).toBe("0");
  });

  test("the estimate caveat is visible without opening the details panel", () => {
    render(<Result state={{ status: "success", data: balanced }} onRetry={() => {}} />);
    const caveat = screen.getByText(/estimate from rendering benchmarks, not game frame rates/i);
    expect(caveat.closest("details")).toBeNull();
  });

  test("an AMD or Intel GPU result carries a visible cross-vendor note; NVIDIA does not", () => {
    const amd = { ...balanced, gpuName: "AMD Radeon RX 7800 XT" };
    const { unmount } = render(
      <Result state={{ status: "success", data: amd }} onRetry={() => {}} />,
    );
    const note = screen.getByText(/calibrated on an NVIDIA card/i);
    expect(note.closest("details")).toBeNull();
    unmount();

    render(<Result state={{ status: "success", data: balanced }} onRetry={() => {}} />);
    expect(screen.queryByText(/calibrated on an NVIDIA card/i)).toBeNull();
  });

  test("an error shows an alert and Retry calls onRetry", () => {
    const onRetry = vi.fn();
    render(<Result state={{ status: "error", kind: "network" }} onRetry={onRetry} />);
    expect(screen.getByRole("alert").textContent).toMatch(/couldn't reach the analyzer/i);
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  test("the idle state prompts the user to analyze", () => {
    render(<Result state={{ status: "idle" }} onRetry={() => {}} />);
    expect(screen.getByText(/your result appears here/i)).toBeTruthy();
  });
});
