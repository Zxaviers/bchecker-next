"use client";

import { useId, useMemo, useState } from "react";
import type { Part } from "@/data/parts";
import { filterParts } from "@/lib/filterParts";

interface PartPickerProps {
  legend: string;
  parts: Part[];
  value: string | null;
  onChange: (id: string) => void;
}

export function PartPicker({ legend, parts, value, onChange }: PartPickerProps) {
  const uid = useId();
  const [query, setQuery] = useState("");
  const [vendor, setVendor] = useState<string | null>(null);

  const vendors = useMemo(
    () => Array.from(new Set(parts.map((p) => p.vendor))),
    [parts],
  );
  const maxScore = useMemo(
    () => Math.max(...parts.map((p) => p.score)),
    [parts],
  );
  const visible = useMemo(
    () => filterParts(parts, query, vendor),
    [parts, query, vendor],
  );
  const selected = parts.find((p) => p.id === value) ?? null;

  return (
    <fieldset className="min-w-0">
      <legend className="label mb-2">{legend}</legend>

      <p
        className="entry typed mb-3 flex min-h-12 items-center justify-between gap-3 px-3 py-2 text-base"
        aria-live="polite"
      >
        {selected ? (
          <>
            <span className="font-bold">{selected.name}</span>
            <span className="text-muted">{selected.score.toLocaleString("en-US")}</span>
          </>
        ) : (
          <span className="text-muted">&mdash; none selected &mdash;</span>
        )}
      </p>

      <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-stretch">
        <label className="sr-only" htmlFor={`${uid}-q`}>
          Filter {legend}
        </label>
        <input
          id={`${uid}-q`}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name"
          autoComplete="off"
          className="entry typed min-w-0 flex-1 px-3 py-2 text-base placeholder:text-muted"
        />
        <div className="flex flex-wrap gap-1.5" role="group" aria-label={`${legend} vendor`}>
          {[null, ...vendors].map((v) => (
            <button
              key={v ?? "all"}
              type="button"
              aria-pressed={vendor === v}
              onClick={() => setVendor(v)}
              className="border-[1.5px] border-line-strong bg-panel-raised px-3 py-2 text-sm font-semibold uppercase tracking-wider transition-colors hover:bg-accent/10 aria-pressed:bg-line-strong aria-pressed:text-accent-ink"
            >
              {v ?? "All"}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p role="status" className="entry px-3 py-8 text-center text-base text-muted">
          No parts match &ldquo;{query.trim()}&rdquo;.
        </p>
      ) : (
        <div className="entry max-h-[15rem] divide-y divide-line overflow-y-auto">
          {visible.map((p) => (
            <label key={p.id} className="relative block cursor-pointer">
              <input
                type="radio"
                name={`${uid}-part`}
                value={p.id}
                checked={value === p.id}
                onChange={() => onChange(p.id)}
                className="peer sr-only"
              />
              <span className="block px-3 py-2 transition-colors hover:bg-accent/10 peer-checked:bg-line-strong peer-checked:text-accent-ink peer-checked:hover:bg-line-strong peer-checked:[&_.bar-fill]:bg-accent-ink peer-checked:[&_.chip]:bg-accent-ink peer-checked:[&_.chip]:text-line-strong peer-focus-visible:outline-3 peer-focus-visible:-outline-offset-3 peer-focus-visible:outline-accent peer-checked:peer-focus-visible:outline-accent-ink">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="min-w-0 truncate text-lg font-semibold">{p.name}</span>
                  <span className="typed shrink-0 text-sm opacity-75">
                    {p.score.toLocaleString("en-US")}
                  </span>
                </span>
                <span className="mt-1 flex items-center gap-2">
                  <span className="h-1.5 flex-1 bg-line" aria-hidden="true">
                    <span
                      className="bar-fill block h-full bg-accent"
                      style={{ width: `${Math.max(2, (p.score / maxScore) * 100)}%` }}
                    />
                  </span>
                  {p.samples < 5 ? (
                    <span className="chip bg-warn px-1.5 py-px text-xs font-bold uppercase tracking-wider text-accent-ink">
                      Low sample
                    </span>
                  ) : null}
                </span>
              </span>
            </label>
          ))}
        </div>
      )}
    </fieldset>
  );
}
