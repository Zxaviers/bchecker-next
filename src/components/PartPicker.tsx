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
      <legend className="eyebrow mb-3">{legend}</legend>

      <p
        className="mb-3 flex min-h-[2.5rem] items-center justify-between gap-3 border border-line-strong bg-panel-raised px-3 py-2 text-sm"
        aria-live="polite"
      >
        {selected ? (
          <>
            <span className="font-semibold text-accent">{selected.name}</span>
            <span className="font-mono text-xs text-muted">
              {selected.score.toLocaleString("en-US")}
            </span>
          </>
        ) : (
          <span className="text-muted">Nothing selected</span>
        )}
      </p>

      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="sr-only" htmlFor={`${uid}-q`}>
          Filter {legend}
        </label>
        <input
          id={`${uid}-q`}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by name"
          autoComplete="off"
          className="min-w-0 flex-1 border border-line bg-bg px-3 py-2 font-mono text-sm text-text placeholder:text-muted"
        />
        <div className="flex flex-wrap gap-1.5" role="group" aria-label={`${legend} vendor`}>
          {[null, ...vendors].map((v) => (
            <button
              key={v ?? "all"}
              type="button"
              aria-pressed={vendor === v}
              onClick={() => setVendor(v)}
              className="border border-line px-2.5 py-1.5 font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:border-line-strong hover:text-text aria-pressed:border-accent aria-pressed:text-accent"
            >
              {v ?? "All"}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p role="status" className="border border-dashed border-line px-3 py-6 text-center text-sm text-muted">
          No parts match &ldquo;{query.trim()}&rdquo;.
        </p>
      ) : (
        <div className="max-h-[22rem] space-y-1.5 overflow-y-auto pr-1">
          {visible.map((p) => (
            <label key={p.id} className="block cursor-pointer">
              <input
                type="radio"
                name={`${uid}-part`}
                value={p.id}
                checked={value === p.id}
                onChange={() => onChange(p.id)}
                className="peer sr-only"
              />
              <span className="block border border-line bg-panel-raised px-3 py-2 transition-colors hover:border-line-strong peer-checked:border-accent peer-checked:bg-accent/10 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="min-w-0 truncate text-sm font-medium">{p.name}</span>
                  <span className="shrink-0 font-mono text-xs text-muted">
                    {p.score.toLocaleString("en-US")}
                  </span>
                </span>
                <span className="mt-1.5 flex items-center gap-2">
                  <span className="h-1 flex-1 bg-line" aria-hidden="true">
                    <span
                      className="block h-full bg-accent"
                      style={{ width: `${Math.max(3, (p.score / maxScore) * 100)}%` }}
                    />
                  </span>
                  {p.samples < 5 ? (
                    <span className="font-mono text-[0.65rem] uppercase tracking-wider text-warn">
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
