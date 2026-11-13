"use client";

import { useId } from "react";

interface SegmentedProps {
  legend: string;
  options: { id: string; label: string }[];
  value: string | null;
  onChange: (id: string) => void;
  /** "row" = compact tick boxes, "grid" = large tick tiles. */
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
  const hintId = `${uid}-hint`;
  const container =
    layout === "grid"
      ? "grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 lg:grid-cols-3"
      : "flex flex-wrap gap-2";
  const tile =
    layout === "grid"
      ? "flex min-h-16 items-center px-4 py-3 text-xl font-semibold leading-tight"
      : "flex items-center px-4 py-2.5 text-lg font-semibold";

  return (
    <fieldset className="min-w-0" aria-describedby={hint ? hintId : undefined}>
      <legend className="label mb-2">{legend}</legend>
      <div className={container}>
        {options.map((o) => (
          <label key={o.id} className="relative cursor-pointer">
            <input
              type="radio"
              name={`${uid}-seg`}
              value={o.id}
              checked={value === o.id}
              onChange={() => onChange(o.id)}
              className="peer sr-only"
            />
            <span
              className={`${tile} entry gap-3 transition-colors hover:bg-accent/10 peer-checked:bg-line-strong peer-checked:text-accent-ink peer-checked:hover:bg-line-strong peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent`}
            >
              <span
                aria-hidden="true"
                className="grid h-5 w-5 shrink-0 place-items-center border-[1.5px] border-current text-xs leading-none"
              >
                {value === o.id ? (
                  <svg viewBox="0 0 12 12" className="h-3.5 w-3.5" fill="none">
                    <path d="M2 6.5 5 9.5 10 3" stroke="currentColor" strokeWidth="2" />
                  </svg>
                ) : null}
              </span>
              {o.label}
            </span>
          </label>
        ))}
      </div>
      {hint ? (
        <p id={hintId} className="mt-2 text-base text-muted">
          {hint}
        </p>
      ) : null}
    </fieldset>
  );
}
