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
import { SectionHead } from "./SectionHead";
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
      className="sheet p-5 sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        if (isComplete(sel)) onAnalyze(sel);
      }}
    >
      <SectionHead letter="A" title="Items under test" />
      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <PartPicker
          legend="A1. Processor"
          parts={CPUS}
          value={sel.cpuId}
          onChange={(id) => update({ cpuId: id })}
        />
        <PartPicker
          legend="A2. Graphics card"
          parts={GPUS}
          value={sel.gpuId}
          onChange={(id) => update({ gpuId: id })}
        />
      </div>

      <div className="mt-12">
        <SectionHead letter="B" title="Conditions of use" />
      </div>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1.7fr]">
        <Segmented
          legend="B1. Resolution"
          options={RESOLUTIONS.map((r) => ({ id: r.id, label: r.label }))}
          value={sel.resolutionId}
          onChange={(id) => update({ resolutionId: id as ResolutionId })}
        />
        <Segmented
          legend="B2. Purpose"
          layout="grid"
          options={PURPOSES.map((p) => ({ id: p.id, label: p.label }))}
          value={sel.purposeId}
          onChange={(id) => update({ purposeId: id as PurposeId })}
        />
      </div>

      <details className="mt-10">
        <summary className="cursor-pointer select-none border-b-2 border-line-strong pb-2 text-2xl font-bold tracking-wide hover:text-accent">
          <span className="tab mr-3" aria-hidden="true">
            C
          </span>
          Optional particulars
        </summary>
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <Segmented
            legend="C1. Target refresh rate"
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
            legend="C2. RAM"
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

      {/* Stays in view while the long lists scroll past, so Analyze is never off-screen. */}
      <div className="sticky bottom-0 z-10 -mx-5 mt-8 -mb-5 flex flex-col gap-3 border-t-2 border-line-strong bg-panel px-5 py-4 shadow-[0_-14px_20px_-16px_rgba(18,49,46,0.45)] sm:-mx-8 sm:-mb-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p id="analyze-help" className="text-lg text-muted" aria-live="polite">
          {complete
            ? "All required entries made. Ready to test."
            : `Required entries missing: ${missing.join(", ")}.`}
        </p>
        <button
          type="submit"
          disabled={!complete || disabled}
          aria-describedby="analyze-help"
          className="btn-primary px-12 py-3 text-2xl font-bold uppercase tracking-[0.18em] disabled:cursor-not-allowed"
        >
          Analyze
        </button>
      </div>
    </form>
  );
}
