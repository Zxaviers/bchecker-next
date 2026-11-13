"use client";

import { useId } from "react";

interface SegmentedProps {
  legend: string;
  options: { id: string; label: string }[];
  value: string | null;
  onChange: (id: string) => void;
  /** "row" = compact segmented bar, "grid" = large toggle tiles. */
  layout?: "row" | "grid";
  hint?: string;
}

export function Segmented({
  legend,
  options,
  value,
  onChange,
  layout = "row",
  hint,
}: SegmentedProps) {
  const uid = useId();
  const container =
    layout === "grid"
      ? "grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 lg:grid-cols-3"
      : "flex flex-wrap gap-2";
  const tile =
    layout === "grid"
      ? "block px-4 py-3.5 text-base font-semibold"
      : "block px-4 py-2.5 text-sm font-medium";

  return (
    <fieldset className="min-w-0">
      <legend className="eyebrow mb-3">{legend}</legend>
      <div className={container}>
        {options.map((o) => (
          <label key={o.id} className="cursor-pointer">
            <input
              type="radio"
              name={`${uid}-seg`}
              value={o.id}
              checked={value === o.id}
              onChange={() => onChange(o.id)}
              className="peer sr-only"
            />
            <span
              className={`${tile} border border-line bg-panel-raised text-muted transition-colors hover:border-line-strong hover:text-text peer-checked:border-accent peer-checked:bg-accent/10 peer-checked:text-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent`}
            >
              {o.label}
            </span>
          </label>
        ))}
      </div>
      {hint ? <p className="mt-2 text-xs text-muted">{hint}</p> : null}
    </fieldset>
  );
}
