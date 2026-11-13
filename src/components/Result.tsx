import { CPUS, GPUS } from "@/data/parts";
import type { AnalyzeErrorKind, AnalyzeResponse } from "@/lib/analyze";
import { severity } from "@/lib/severity";
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

const ERROR_TEXT: Record<AnalyzeErrorKind, string> = {
  network: "Couldn't reach the analyzer. Check your connection and try again.",
  invalid_input: "Those options weren't accepted. Reload the page and try again.",
  not_found: "That part isn't in the catalogue. Reload the page and try again.",
};

/** Deterministic report number derived from the inputs, so a pair always gets the same one. */
function reportNumber(d: AnalyzeResponse): string {
  let h = 5381;
  for (const c of `${d.cpuName}|${d.gpuName}|${d.bottleneck}|${d.gpuShare}`) {
    h = (h * 33 + c.charCodeAt(0)) >>> 0;
  }
  return `BC-${h.toString(36).toUpperCase().padStart(6, "0").slice(0, 6)}`;
}

function ResultHead({ right }: { right?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 bg-line-strong px-5 py-3 text-accent-ink sm:px-8">
      <h2 className="flex items-center gap-3 text-2xl font-bold tracking-wide">
        <span
          aria-hidden="true"
          className="grid h-8 min-w-8 place-items-center bg-accent-ink px-1 text-lg text-line-strong"
        >
          D
        </span>
        Results of measurement
      </h2>
      {right ? <p className="typed text-sm">{right}</p> : null}
    </div>
  );
}

export function Result({ state, onRetry }: ResultProps) {
  if (state.status === "idle") {
    return (
      <div className="sheet">
        <ResultHead />
        <p className="px-5 py-10 text-center text-xl text-muted sm:px-8">
          Your result appears here. Choose parts above and press Analyze.
        </p>
      </div>
    );
  }

  if (state.status === "loading") {
    return (
      <div className="sheet" role="status">
        <ResultHead />
        <div className="px-5 py-10 sm:px-8">
          <p className="text-xl">Test in progress&hellip;</p>
          <div className="entry mt-4 h-8 overflow-hidden" aria-hidden="true">
            <div
              className="h-full w-1/4 bg-accent/70"
              style={{ animation: "scan 1.1s ease-in-out infinite" }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="sheet" role="alert">
        <ResultHead />
        <div className="px-5 py-8 sm:px-8">
          <p className="text-xl font-semibold text-danger">Test not completed</p>
          <p className="mt-1 text-xl">{ERROR_TEXT[state.kind]}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-5 border-2 border-danger px-8 py-2 text-xl font-bold uppercase tracking-[0.14em] text-danger transition-colors hover:bg-danger hover:text-accent-ink"
          >
            Retry
          </button>
        </div>
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
    <div className="sheet">
      <ResultHead right={reportNumber(d)} />

      <div className="grid gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <p className="font-bold leading-[0.85] tracking-tight text-[clamp(4.5rem,12vw,6rem)]">
            <span aria-hidden="true">
              {d.bottleneck.toFixed(1)}
              <span className="text-[0.45em]">%</span>
            </span>
            <span className="sr-only">{d.bottleneck.toFixed(2)} percent bottleneck</span>
          </p>
          <p className="mt-2 text-2xl font-semibold text-muted">estimated bottleneck</p>
          <div className="mt-6">
            <Gauge percent={d.bottleneck} severity={sev} />
          </div>
        </div>

        <div className="flex flex-col items-start gap-6 lg:pl-4">
          <p className={`stamp ${d.limiting === "none" ? "stamp-ok" : "stamp-bad"}`}>
            {d.note}
          </p>
          <p className="text-2xl font-semibold leading-snug">{verdict}</p>
          <p className="text-lg text-muted">
            Estimate from rendering benchmarks, not game frame rates.
            {gpu && gpu.vendor !== "NVIDIA"
              ? ` ${gpu.vendor} GPU scores use a different Blender backend and the model is calibrated on an NVIDIA card, so GPU-limited results may look worse than they would in games.`
              : ""}
          </p>
        </div>
      </div>

      <div className="border-t-2 border-line-strong px-5 py-6 sm:px-8">
        <h3 className="text-2xl font-bold">Readings</h3>
        <div
          className="mt-3 overflow-x-auto"
          role="region"
          aria-label="Readings table"
          tabIndex={0}
        >
          <table className="w-full min-w-[30rem] border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-line-strong text-base">
                <th scope="col" className="py-2 pr-4 font-semibold">Part</th>
                <th scope="col" className="py-2 pr-4 font-semibold">Score</th>
                <th scope="col" className="py-2 pr-4 font-semibold">Share of work</th>
                <th scope="col" className="py-2 font-semibold">Power</th>
              </tr>
            </thead>
            <tbody className="typed text-base">
              <tr className="border-b border-line">
                <th scope="row" className="py-2 pr-4 text-left font-sans text-xl font-semibold">{d.cpuName}</th>
                <td className="py-2 pr-4">{d.cpuScore.toLocaleString("en-US")}</td>
                <td className="py-2 pr-4">{((1 - d.gpuShare) * 100).toFixed(0)}%</td>
                <td className="py-2">{d.cpuPower.toFixed(2)}</td>
              </tr>
              <tr>
                <th scope="row" className="py-2 pr-4 text-left font-sans text-xl font-semibold">{d.gpuName}</th>
                <td className="py-2 pr-4">{d.gpuScore.toLocaleString("en-US")}</td>
                <td className="py-2 pr-4">{(d.gpuShare * 100).toFixed(0)}%</td>
                <td className="py-2">{d.gpuPower.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-lg text-muted">
          Power = (score &divide; reference score) &divide; share of work. The weaker side
          limits performance: bottleneck = (1 &minus; weaker &divide; stronger) &times; 100.
        </p>
      </div>

      {d.advisories.length > 0 ? (
        <div className="border-t-2 border-line-strong px-5 py-6 sm:px-8">
          <h3 className="text-2xl font-bold">Remarks</h3>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-xl">
            {d.advisories.map((a) => (
              <li key={a.id}>{a.message}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="border-t-2 border-line-strong px-5 py-6 text-lg text-muted sm:px-8">
        <h3 className="text-2xl font-bold text-text">Traceability</h3>
        <p className="mt-2">
          Scores are median Blender Open Data results
          {cpu && gpu ? (
            <>
              {" "}
              (
              <a className="font-medium text-text underline underline-offset-4" href={cpu.sourceUrl} rel="noopener noreferrer">
                CPU source
              </a>
              ,{" "}
              <a className="font-medium text-text underline underline-offset-4" href={gpu.sourceUrl} rel="noopener noreferrer">
                GPU source
              </a>
              ; read {cpu.capturedOn}
              {cpu.samples < 5 || gpu.samples < 5
                ? "; one of these parts has very few submissions"
                : ""}
              )
            </>
          ) : null}
          . Report number is derived from the inputs: the same pair always gets the same one.
        </p>
      </div>
    </div>
  );
}
