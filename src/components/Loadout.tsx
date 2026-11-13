"use client";

import { useState } from "react";
import {
  PURPOSES,
  RAM_SIZES,
  REFRESH_RATES,
  RESOLUTIONS,
  type PurposeId,
  type RamGb,
  type RefreshHz,
  type ResolutionId,
} from "@/data/options";
import { CPUS, GPUS } from "@/data/parts";
import {
  EMPTY_SELECTION,
  isComplete,
  type CompleteSelection,
  type Selection,
} from "@/lib/selection";
import { PartPicker } from "./PartPicker";
import { Segmented } from "./Segmented";

interface LoadoutProps {
  onAnalyze: (selection: CompleteSelection) => void;
  /** Called whenever any selection changes (lets the parent clear a stale result). */
  onSelectionChange?: () => void;
  disabled?: boolean;
}

const NOT_SET = "none";

export function Loadout({ onAnalyze, onSelectionChange, disabled }: LoadoutProps) {
  const [sel, setSel] = useState<Selection>(EMPTY_SELECTION);

  function update(patch: Partial<Selection>) {
    setSel((prev) => ({ ...prev, ...patch }));
    onSelectionChange?.();
  }

  const missing = [
    sel.cpuId === null && "CPU",
    sel.gpuId === null && "GPU",
    sel.resolutionId === null && "resolution",
    sel.purposeId === null && "purpose",
  ].filter(Boolean) as string[];
  const complete = isComplete(sel);

  return (
    <form
      className="hud-panel p-5 sm:p-7"
      onSubmit={(e) => {
        e.preventDefault();
        if (isComplete(sel)) onAnalyze(sel);
      }}
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <PartPicker
          legend="01 / Processor"
          parts={CPUS}
          value={sel.cpuId}
          onChange={(id) => update({ cpuId: id })}
        />
        <PartPicker
          legend="02 / Graphics card"
          parts={GPUS}
          value={sel.gpuId}
          onChange={(id) => update({ gpuId: id })}
        />
      </div>

      <div className="mt-8 grid gap-8 border-t border-line pt-8 lg:grid-cols-[1fr_1.6fr]">
        <Segmented
          legend="03 / Resolution"
          options={RESOLUTIONS.map((r) => ({ id: r.id, label: r.label }))}
          value={sel.resolutionId}
          onChange={(id) => update({ resolutionId: id as ResolutionId })}
        />
        <Segmented
          legend="04 / Purpose"
          layout="grid"
          options={PURPOSES.map((p) => ({ id: p.id, label: p.label }))}
          value={sel.purposeId}
          onChange={(id) => update({ purposeId: id as PurposeId })}
        />
      </div>

      <details className="group mt-8 border-t border-line pt-6">
        <summary className="eyebrow cursor-pointer select-none hover:text-text">
          Advanced options (optional)
        </summary>
        <div className="mt-5 grid gap-8 lg:grid-cols-2">
          <Segmented
            legend="Target refresh rate"
            hint="Higher frame-rate targets load the CPU more. Affects gaming, esports and streaming only."
            options={[
              { id: NOT_SET, label: "Not set" },
              ...REFRESH_RATES.map((hz) => ({ id: String(hz), label: `${hz} Hz` })),
            ]}
            value={sel.refreshHz === null ? NOT_SET : String(sel.refreshHz)}
            onChange={(id) =>
              update({ refreshHz: id === NOT_SET ? null : (Number(id) as RefreshHz) })
            }
          />
          <Segmented
            legend="RAM"
            hint="Adds advice only. It never changes the bottleneck percentage."
            options={[
              { id: NOT_SET, label: "Not set" },
              ...RAM_SIZES.map((gb) => ({ id: String(gb), label: `${gb} GB` })),
            ]}
            value={sel.ramGb === null ? NOT_SET : String(sel.ramGb)}
            onChange={(id) =>
              update({ ramGb: id === NOT_SET ? null : (Number(id) as RamGb) })
            }
          />
        </div>
      </details>

      <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p id="analyze-help" className="text-sm text-muted" aria-live="polite">
          {complete
            ? "Ready. Run the analysis."
            : `Still needed: ${missing.join(", ")}.`}
        </p>
        <button
          type="submit"
          disabled={!complete || disabled}
          aria-describedby="analyze-help"
          className="bg-accent px-8 py-3 text-base font-bold uppercase tracking-[0.16em] text-accent-ink transition-opacity enabled:hover:opacity-90 disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
        >
          Analyze
        </button>
      </div>
    </form>
  );
}
