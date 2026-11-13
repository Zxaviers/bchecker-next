import { GPU_SHARE, PURPOSES, RESOLUTIONS } from "@/data/options";
import { CPUS, GPUS, type Part } from "@/data/parts";

const GROUPS: { label: string; parts: Part[] }[] = [
  { label: "CPUs (CPU)", parts: CPUS },
  { label: "NVIDIA GPUs (OptiX)", parts: GPUS.filter((g) => g.vendor === "NVIDIA") },
  { label: "AMD GPUs (HIP)", parts: GPUS.filter((g) => g.vendor === "AMD") },
  { label: "Intel GPUs (oneAPI)", parts: GPUS.filter((g) => g.vendor === "Intel") },
];

const ALL_PARTS: Part[] = [...CPUS, ...GPUS];

export function AboutData() {
  return (
    <section id="about-data" className="mt-24 scroll-mt-6" aria-labelledby="data-title">
      <p className="eyebrow">Sources and limits</p>
      <h2 id="data-title" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        About the data
      </h2>
      <p className="mt-4 max-w-3xl text-muted">
        Scores are median results from{" "}
        <a
          className="text-text underline decoration-line-strong underline-offset-4 hover:decoration-accent"
          href="https://opendata.blender.org"
          rel="noopener noreferrer"
        >
          Blender Open Data
        </a>
        , a public benchmark that states its data is license-free. The score is
        how many Cycles path-tracing samples a part renders per minute. That is
        a good measure of raw compute, but it is <strong className="text-text">not game frame rates</strong>,
        so BChecker gives an estimate, not a verdict.
      </p>

      <div className="mt-8 overflow-x-auto border border-line">
        <table className="w-full min-w-[34rem] text-left text-sm">
          <caption className="sr-only">Where each score comes from</caption>
          <thead className="bg-panel text-muted">
            <tr className="font-mono text-xs uppercase tracking-wider">
              <th scope="col" className="px-4 py-3 font-normal">Group</th>
              <th scope="col" className="px-4 py-3 font-normal">Parts</th>
              <th scope="col" className="px-4 py-3 font-normal">Read on</th>
              <th scope="col" className="px-4 py-3 font-normal">Source</th>
            </tr>
          </thead>
          <tbody>
            {GROUPS.map((g) => (
              <tr key={g.label} className="border-t border-line">
                <th scope="row" className="px-4 py-3 font-medium">{g.label}</th>
                <td className="px-4 py-3 font-mono">{g.parts.length}</td>
                <td className="px-4 py-3 font-mono">{g.parts[0].capturedOn}</td>
                <td className="px-4 py-3">
                  <a
                    className="underline underline-offset-4 hover:text-accent"
                    href={g.parts[0].sourceUrl}
                    rel="noopener noreferrer"
                  >
                    {g.parts[0].source}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="text-lg font-semibold">Known limits</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
            <li>
              NVIDIA GPUs use OptiX, AMD uses HIP and Intel uses oneAPI (each
              vendor&apos;s default in Blender). OptiX uses ray-tracing hardware,
              so NVIDIA looks relatively stronger here than it does in games.
              Comparisons within one vendor are the most reliable.
            </li>
            <li>
              Intel Core i3-13100 has only 2 submissions behind its score, and is
              marked &ldquo;Low sample&rdquo; in the picker. Every other part has
              at least 5.
            </li>
            <li>
              All scores come from one Blender version (4.5.0 LTS) so old and new
              parts are comparable. Older hardware is included back to 2011 CPUs
              and 2014 GPUs. AMD GPUs before the RX 5000 series have no usable
              Blender data and are not listed.
            </li>
            <li>
              The model compares one CPU number with one GPU number. It ignores
              RAM speed, cache, drivers, cooling and the game itself. RAM only
              adds advice.
            </li>
            <li>
              Desktop parts only. No laptop or mobile chips.
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Workload shares (my estimates)</h3>
          <p className="mt-3 text-sm text-muted">
            Share of the work placed on the GPU. These are rule-of-thumb values
            chosen for this project, not measured data. Refresh rates of 120/144
            Hz and 240 Hz lower the share by 0.05 and 0.10 for gaming, esports
            and streaming.
          </p>
          <div className="mt-3 overflow-x-auto border border-line">
            <table className="w-full min-w-[22rem] text-left font-mono text-xs">
              <caption className="sr-only">GPU share of the workload by purpose and resolution</caption>
              <thead className="bg-panel text-muted">
                <tr>
                  <th scope="col" className="px-3 py-2 font-normal font-sans text-sm">Purpose</th>
                  {RESOLUTIONS.map((r) => (
                    <th key={r.id} scope="col" className="px-3 py-2 font-normal">
                      {r.label.split(" ")[0]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PURPOSES.map((p) => (
                  <tr key={p.id} className="border-t border-line">
                    <th scope="row" className="px-3 py-2 text-left font-sans text-sm font-medium">
                      {p.label}
                    </th>
                    {RESOLUTIONS.map((r) => (
                      <td key={r.id} className="px-3 py-2">
                        {GPU_SHARE[p.id][r.id].toFixed(2)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted">
            RAM advice (never part of the percentage): under 16 GB for
            gaming-type use, under 32 GB for video editing, 3D rendering or 4K.
          </p>
        </div>
      </div>

      <details className="mt-10 border border-line">
        <summary className="eyebrow cursor-pointer select-none px-4 py-3 hover:text-text">
          All {ALL_PARTS.length} scores
        </summary>
        <div className="max-h-[28rem] overflow-auto border-t border-line">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <caption className="sr-only">Every part with its score and sample count</caption>
            <thead className="sticky top-0 bg-panel text-muted">
              <tr className="font-mono text-xs uppercase tracking-wider">
                <th scope="col" className="px-4 py-2 font-normal">Part</th>
                <th scope="col" className="px-4 py-2 font-normal">Score</th>
                <th scope="col" className="px-4 py-2 font-normal">Submissions</th>
              </tr>
            </thead>
            <tbody>
              {ALL_PARTS.map((p) => (
                <tr key={p.id} className="border-t border-line">
                  <th scope="row" className="px-4 py-2 text-left font-medium">{p.name}</th>
                  <td className="px-4 py-2 font-mono">{p.score.toLocaleString("en-US")}</td>
                  <td className="px-4 py-2 font-mono">{p.samples}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}
