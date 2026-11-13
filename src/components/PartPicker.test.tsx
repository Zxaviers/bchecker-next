// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { PartPicker } from "@/components/PartPicker";
import { GPUS } from "@/data/parts";

afterEach(cleanup);

function setup(value: string | null = null) {
  const onChange = vi.fn();
  const utils = render(
    <PartPicker legend="Graphics card" parts={GPUS} value={value} onChange={onChange} />,
  );
  return { onChange, ...utils };
}

describe("PartPicker", () => {
  test("filtering with no match shows an empty state", () => {
    setup();
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "zzzz" } });
    expect(screen.getByRole("status").textContent).toMatch(/no parts match/i);
    expect(screen.queryAllByRole("radio")).toHaveLength(0);
  });

  test("a selected part stays pinned when filtered out of the list", () => {
    setup("nvidia-geforce-rtx-3070");
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "radeon" } });
    expect(screen.queryByRole("radio", { name: /RTX 3070/ })).toBeNull();
    // pinned summary still names it
    expect(screen.getAllByText("NVIDIA GeForce RTX 3070").length).toBeGreaterThan(0);
  });

  test("choosing a card calls onChange with its id", () => {
    const { onChange } = setup();
    const radio = screen.getAllByRole("radio")[0] as HTMLInputElement;
    fireEvent.click(radio);
    expect(onChange).toHaveBeenCalledWith(radio.value);
  });

  test("each hidden radio is anchored to its own row, not the page", () => {
    const { container } = setup();
    const labels = container.querySelectorAll("label:has(input[type=radio])");
    expect(labels.length).toBeGreaterThan(0);
    for (const l of labels) expect(l.className).toMatch(/\brelative\b/);
  });
});
