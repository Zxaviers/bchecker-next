"use client";

import { useState } from "react";
import type { CompleteSelection } from "@/lib/selection";
import { Loadout } from "./Loadout";

export function Analyzer() {
  // Temporary readout; Task 7 replaces this with the real analyze flow.
  const [last, setLast] = useState<CompleteSelection | null>(null);

  return (
    <div className="space-y-6">
      <Loadout onAnalyze={setLast} onSelectionChange={() => setLast(null)} />
      {last ? (
        <pre className="hud-panel overflow-x-auto p-4 font-mono text-xs">
          {JSON.stringify(last, null, 2)}
        </pre>
      ) : null}
    </div>
  );
}
