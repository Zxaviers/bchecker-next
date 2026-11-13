"use client";

import { useEffect, useRef, useState } from "react";
import { analyze, AnalyzeError } from "@/lib/analyze";
import type { CompleteSelection } from "@/lib/selection";
import { Loadout } from "./Loadout";
import { Result, type ResultState } from "./Result";

export function Analyzer() {
  const [state, setState] = useState<ResultState>({ status: "idle" });
  const controllerRef = useRef<AbortController | null>(null);
  const lastSelectionRef = useRef<CompleteSelection | null>(null);

  // Abort anything still in flight when the page unmounts.
  useEffect(() => () => controllerRef.current?.abort(), []);

  function run(selection: CompleteSelection) {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    lastSelectionRef.current = selection;
    setState({ status: "loading" });

    analyze(selection, controller.signal)
      .then((data) => {
        if (controllerRef.current === controller) setState({ status: "success", data });
      })
      .catch((err: unknown) => {
        if ((err as { name?: string } | null)?.name === "AbortError") return;
        if (controllerRef.current !== controller) return;
        setState({
          status: "error",
          kind: err instanceof AnalyzeError ? err.kind : "network",
        });
      });
  }

  function reset() {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setState((prev) => (prev.status === "idle" ? prev : { status: "idle" }));
  }

  // One short announcement for screen readers, instead of the whole result panel.
  const announcement =
    state.status === "success"
      ? `${state.data.bottleneck.toFixed(1)} percent bottleneck. ${state.data.note}.`
      : "";

  return (
    <div className="space-y-8">
      <Loadout onAnalyze={run} onSelectionChange={reset} />
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
      <Result
        state={state}
        onRetry={() => {
          if (lastSelectionRef.current) run(lastSelectionRef.current);
        }}
      />
    </div>
  );
}
