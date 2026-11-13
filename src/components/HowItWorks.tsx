import { CPUS, GPUS } from "@/data/parts";
import { estimate } from "@/lib/model";
import { SectionHead } from "./SectionHead";

function requirePart<T extends { id: string }>(list: T[], id: string): T {
  const p = list.find((x) => x.id === id);
  if (!p) throw new Error(`missing part ${id}`);
  return p;
}

const STEPS = [
  {
    title: "Every part has a score",
    body: "Each CPU and GPU carries the median score from Blender Open Data, so faster parts have bigger numbers.",
  },
  {
    title: "Your use sets the split",
    body: "Gaming at a higher resolution puts more of the work on the GPU. Esports and high refresh rates lean on the CPU. The split is a rule of thumb, not a measurement.",
  },
  {
    title: "The weaker side sets the pace",
    body: "Each part's score is divided by its share of the work. Whichever comes out lower limits the build, and the gap is the bottleneck percentage.",
  },
];

export function HowItWorks() {
  const cpu = requirePart(CPUS, "intel-core-i3-13100");
  const gpu = requirePart(GPUS, "nvidia-geforce-rtx-3090");
  const e = estimate({ cpu, gpu, resolution: "fhd", purpose: "gaming" });

  const rows: [string, string][] = [
    ["GPU share of the work", `${(e.gpuShare * 100).toFixed(0)}%`],
    ["CPU power", e.cpuPower.toFixed(2)],
    ["GPU power", e.gpuPower.toFixed(2)],
    ["Bottleneck", `${e.bottleneck.toFixed(1)}%`],
  ];

  return (
    <section id="how-it-works" className="mt-28 scroll-mt-6" aria-labelledby="how-title">
      <SectionHead letter="E" title="Method of measurement" id="how-title" />

      <ol className="mt-2">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            className="grid gap-x-8 gap-y-1 border-b border-line py-5 md:grid-cols-[4rem_16rem_1fr]"
          >
            <span className="typed text-3xl font-bold text-accent" aria-hidden="true">
              {i + 1}.
            </span>
            <h3 className="text-2xl font-bold">{s.title}</h3>
            <p className="max-w-[62ch] text-xl text-muted">{s.body}</p>
          </li>
        ))}
      </ol>

      <div className="sheet mt-10 p-5 sm:p-6">
        <h3 className="text-2xl font-bold">Sample reading</h3>
        <p className="mt-1 text-xl text-muted">
          {cpu.name} with {gpu.name}, gaming at 1080p
        </p>
        <dl className="entry typed mt-4 text-base sm:grid sm:grid-cols-2">
          {rows.map(([k, v], i) => (
            <div
              key={k}
              className={`flex justify-between gap-4 border-line px-3 py-2 ${i < 2 ? "border-b" : ""} ${i % 2 === 0 ? "sm:border-r" : ""} max-sm:border-b max-sm:last:border-b-0`}
            >
              <dt className="text-muted">{k}</dt>
              <dd className="font-bold">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xl text-muted">
          The {e.limiting === "CPU" ? "CPU" : "GPU"} has the lower power, so it
          limits the pair and the verdict is &ldquo;{e.note}&rdquo;.
        </p>
      </div>
    </section>
  );
}
