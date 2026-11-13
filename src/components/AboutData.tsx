import { GPU_SHARE, PURPOSES, RESOLUTIONS } from "@/data/options";
import { CPUS, GPUS, type Part } from "@/data/parts";
import { SectionHead } from "./SectionHead";

const GROUPS: { label: string; parts: Part[] }[] = [
  { label: "CPUs (CPU)", parts: CPUS },
  { label: "NVIDIA GPUs (OptiX)", parts: GPUS.filter((g) => g.vendor === "NVIDIA") },
  { label: "AMD GPUs (HIP)", parts: GPUS.filter((g) => g.vendor === "AMD") },
  { label: "Intel GPUs (oneAPI)", parts: GPUS.filter((g) => g.vendor === "Intel") },
];

const ALL_PARTS: Part[] = [...CPUS, ...GPUS];

const TH = "py-2 pr-4 text-left text-base font-semibold";

export function AboutData() {
  return (
    <section id="about-data" className="mt-28 scroll-mt-6" aria-labelledby="data-title">
      <SectionHead letter="F" title="Traceability and limits" id="data-title" />
      <p className="mt-5 max-w-[62ch] text-xl text-muted">
        Scores are median results from{" "}
        <a
          className="font-medium text-text underline underline-offset-4"
          href="https://opendata.blender.org"
          rel="noopener noreferrer"
        >
          Blender Open Data
        </a>
        , a public benchmark that states its data is license-free. The score is
        how many Cycles path-tracing samples a part renders per minute. That is
        a good measure of raw compute, but it is{" "}
        <strong className="text-text">not game frame rates</strong>, so BChecker
        gives an estimate, not a verdict.
      </p>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-left">
          <caption className="sr-only">Where each score comes from</caption>
          <thead>
            <tr className="border-b-2 border-line-strong">
              <th scope="col" className={TH}>Group</th>
              <th scope="col" className={TH}>Parts</th>
              <th scope="col" className={TH}>Read on</th>
              <th scope="col" className={TH}>Source</th>
            </tr>
          </thead>
          <tbody>
            {GROUPS.map((g) => (
              <tr key={g.label} className="border-b border-line">
                <th scope="row" className="py-2.5 pr-4 text-left text-xl font-semibold">{g.label}</th>
                <td className="typed py-2.5 pr-4 text-base">{g.parts.length}</td>
                <td className="typed py-2.5 pr-4 text-base">{g.parts[0].capturedOn}</td>
                <td className="py-2.5 text-lg">
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

      <div className="mt-14 grid gap-12 lg:grid-cols-2">
        <div>
          <h3 className="border-b-2 border-line-strong pb-2 text-3xl font-bold">Known limits</h3>
          <ul className="mt-4 list-disc space-y-3 pl-6 text-xl text-muted">
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
            <li>Desktop parts only. No laptop or mobile chips.</li>
          </ul>
        </div>

        <div>
          <h3 className="border-b-2 border-line-strong pb-2 text-3xl font-bold">
            Workload shares (my estimates)
          </h3>
          <p className="mt-4 text-xl text-muted">
            Share of the work placed on the GPU. These are rule-of-thumb values
            chosen for this project, not measured data. Refresh rates of 120/144
            Hz and 240 Hz lower the share by 0.05 and 0.10 for gaming, esports
            and streaming.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[22rem] border-collapse text-left">
              <caption className="sr-only">GPU share of the workload by purpose and resolution</caption>
              <thead>
                <tr className="border-b-2 border-line-strong">
                  <th scope="col" className={TH}>Purpose</th>
                  {RESOLUTIONS.map((r) => (
                    <th key={r.id} scope="col" className={TH}>
                      {r.label.split(" ")[0]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PURPOSES.map((p) => (
                  <tr key={p.id} className="border-b border-line">
                    <th scope="row" className="py-2 pr-4 text-left text-lg font-semibold">
                      {p.label}
                    </th>
                    {RESOLUTIONS.map((r) => (
                      <td key={r.id} className="typed py-2 pr-4 text-base">
                        {GPU_SHARE[p.id][r.id].toFixed(2)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xl text-muted">
            RAM advice (never part of the percentage): under 16 GB for
            gaming-type use, under 32 GB for video editing, 3D rendering or 4K.
          </p>
        </div>
      </div>

      <details className="sheet mt-12">
        <summary className="cursor-pointer select-none px-5 py-4 text-2xl font-bold hover:text-accent">
          All {ALL_PARTS.length} scores
        </summary>
        <div className="max-h-[28rem] overflow-auto border-t-2 border-line-strong">
          <table className="w-full min-w-[28rem] border-collapse text-left">
            <caption className="sr-only">Every part with its score and sample count</caption>
            <thead className="sticky top-0 bg-panel">
              <tr className="border-b-2 border-line-strong">
                <th scope="col" className={`${TH} px-5`}>Part</th>
                <th scope="col" className={TH}>Score</th>
                <th scope="col" className={TH}>Submissions</th>
              </tr>
            </thead>
            <tbody>
              {ALL_PARTS.map((p) => (
                <tr key={p.id} className="border-b border-line">
                  <th scope="row" className="px-5 py-2 text-left text-lg font-semibold">{p.name}</th>
                  <td className="typed py-2 pr-4 text-base">{p.score.toLocaleString("en-US")}</td>
                  <td className="typed py-2 pr-4 text-base">{p.samples}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}
