import { CPUS, GPUS } from "@/data/parts";
import type { AnalyzeErrorKind, AnalyzeResponse } from "@/lib/analyze";
import { severity, type Severity } from "@/lib/severity";
import { Gauge } from "./Gauge";

export type ResultState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: AnalyzeResponse }
  | { status: "error"; kind: AnalyzeErrorKind };

interface ResultProps {
  state: ResultState;
  onRetry: () => void;
}

const TAG: Record<Severity, string> = {
  low: "border-accent text-accent",
  mid: "border-warn text-warn",
  high: "border-danger text-danger",
};

const ERROR_TEXT: Record<AnalyzeErrorKind, string> = {
  network: "Couldn't reach the analyzer. Check your connection and try again.",
  invalid_input: "Those options weren't accepted. Reload the page and try again.",
  not_found: "That part isn't in the catalogue. Reload the page and try again.",
};

export function Result({ state, onRetry }: ResultProps) {
  if (state.status === "idle") {
    return (
      <div className="border border-dashed border-line px-5 py-8 text-center text-sm text-muted">
        Your result appears here. Choose parts above and press Analyze.
      </div>
    );
  }

  if (state.status === "loading") {
    return (
      <div className="hud-panel p-6" role="status">
        <p className="eyebrow">Analyzing</p>
        <div className="mt-4 h-6 overflow-hidden bg-line" aria-hidden="true">
          <div
            className="h-full w-1/4 bg-accent/60"
            style={{ animation: "scan 1.1s ease-in-out infinite" }}
          />
        </div>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="hud-panel border-danger p-6" role="alert">
        <p className="eyebrow text-danger">Error</p>
        <p className="mt-2">{ERROR_TEXT[state.kind]}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 border border-danger px-5 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-danger transition-colors hover:bg-danger hover:text-accent-ink"
        >
          Retry
        </button>
      </div>
    );
  }

  const d = state.data;
  const sev = severity(d.bottleneck);
  const cpu = CPUS.find((c) => c.name === d.cpuName);
  const gpu = GPUS.find((g) => g.name === d.gpuName);
  const verdict =
    d.limiting === "none"
      ? "Neither part is holding the other back."
      : `${d.limiting === "CPU" ? d.cpuName : d.gpuName} is the limiting ${d.limiting}.`;

  return (
    <div className="hud-panel p-5 sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <div>
          <p className="eyebrow">05 / Bottleneck</p>
          <p
            className="mt-1 font-mono text-6xl font-bold leading-none tracking-tight sm:text-7xl"
            aria-label={`${d.bottleneck.toFixed(2)} percent bottleneck`}
          >
            {d.bottleneck.toFixed(1)}
            <span className="text-3xl text-muted">%</span>
          </p>
        </div>
        <p
          className={`border px-4 py-2 text-sm font-bold uppercase tracking-[0.16em] ${TAG[sev]}`}
        >
          {d.note}
        </p>
      </div>

      <div className="mt-6">
        <Gauge percent={d.bottleneck} severity={sev} />
      </div>
      <p className="mt-4 text-lg">{verdict}</p>
      <p className="mt-2 text-sm text-muted">
        Estimate from rendering benchmarks, not game frame rates.
        {gpu && gpu.vendor !== "NVIDIA"
          ? ` ${gpu.vendor} GPU scores use a different Blender backend and the model is calibrated on an NVIDIA card, so GPU-limited results may look worse than they would in games.`
          : ""}
      </p>

      {d.advisories.length > 0 ? (
        <div className="mt-6 border border-warn/60 bg-warn/5 p-4">
          <p className="eyebrow text-warn">RAM notes</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {d.advisories.map((a) => (
              <li key={a.id}>{a.message}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <details className="mt-6 border-t border-line pt-4">
        <summary className="eyebrow cursor-pointer select-none hover:text-text">
          How this was calculated
        </summary>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[22rem] text-left font-mono text-xs">
            <thead className="text-muted">
              <tr>
                <th className="py-1.5 pr-4 font-normal">Part</th>
                <th className="py-1.5 pr-4 font-normal">Score</th>
                <th className="py-1.5 pr-4 font-normal">Share of work</th>
                <th className="py-1.5 font-normal">Power</th>
              </tr>
            </thead>
            <tbody className="align-top">
              <tr className="border-t border-line">
                <td className="py-2 pr-4 font-sans text-sm">{d.cpuName}</td>
                <td className="py-2 pr-4">{d.cpuScore.toLocaleString("en-US")}</td>
                <td className="py-2 pr-4">{((1 - d.gpuShare) * 100).toFixed(0)}%</td>
                <td className="py-2">{d.cpuPower.toFixed(2)}</td>
              </tr>
              <tr className="border-t border-line">
                <td className="py-2 pr-4 font-sans text-sm">{d.gpuName}</td>
                <td className="py-2 pr-4">{d.gpuScore.toLocaleString("en-US")}</td>
                <td className="py-2 pr-4">{(d.gpuShare * 100).toFixed(0)}%</td>
                <td className="py-2">{d.gpuPower.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-muted">
          Power = (score / reference score) / share of work. The weaker side limits
          performance: bottleneck = (1 &minus; weaker / stronger) &times; 100.
        </p>
        <p className="mt-2 text-sm text-muted">
          Scores are median Blender Open Data results
          {cpu && gpu ? (
            <>
              {" "}
              (
              <a
                className="underline underline-offset-4 hover:text-text"
                href={cpu.sourceUrl}
                rel="noopener noreferrer"
              >
                CPU source
              </a>
              ,{" "}
              <a
                className="underline underline-offset-4 hover:text-text"
                href={gpu.sourceUrl}
                rel="noopener noreferrer"
              >
                GPU source
              </a>
              ; read {cpu.capturedOn}
              {cpu.samples < 5 || gpu.samples < 5
                ? "; one of these parts has very few submissions"
                : ""}
              )
            </>
          ) : null}
          . They measure rendering speed, not game frame rates, so treat the
          percentage as an estimate.
        </p>
      </details>
    </div>
  );
}
