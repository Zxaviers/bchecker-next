import { CPUS, GPUS } from "@/data/parts";
import { estimate } from "@/lib/model";

function requirePart<T extends { id: string }>(list: T[], id: string): T {
  const p = list.find((x) => x.id === id);
  if (!p) throw new Error(`missing part ${id}`);
  return p;
}

export function HowItWorks() {
  const cpu = requirePart(CPUS, "intel-core-i3-13100");
  const gpu = requirePart(GPUS, "nvidia-geforce-rtx-3090");
  const e = estimate({ cpu, gpu, resolution: "fhd", purpose: "gaming" });

  const steps = [
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

  return (
    <section id="how-it-works" className="mt-24 scroll-mt-6" aria-labelledby="how-title">
      <p className="eyebrow">Method</p>
      <h2 id="how-title" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        How it works
      </h2>

      <ol className="mt-8 grid gap-4 lg:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.title} className="border border-line bg-panel p-5">
            <p className="font-mono text-sm text-accent">0{i + 1}</p>
            <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted">{s.body}</p>
          </li>
        ))}
      </ol>

      <div className="hud-panel mt-6 p-5 sm:p-6">
        <p className="eyebrow">Worked example</p>
        <p className="mt-2 text-lg">
          {cpu.name} with {gpu.name}, gaming at 1080p
        </p>
        <dl className="mt-4 grid gap-x-8 gap-y-2 font-mono text-sm sm:grid-cols-2">
          <div className="flex justify-between gap-4 border-b border-line py-1.5">
            <dt className="text-muted">GPU share of the work</dt>
            <dd>{(e.gpuShare * 100).toFixed(0)}%</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-line py-1.5">
            <dt className="text-muted">CPU power</dt>
            <dd>{e.cpuPower.toFixed(2)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-line py-1.5">
            <dt className="text-muted">GPU power</dt>
            <dd>{e.gpuPower.toFixed(2)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-line py-1.5">
            <dt className="text-muted">Bottleneck</dt>
            <dd>{e.bottleneck.toFixed(1)}%</dd>
          </div>
        </dl>
        <p className="mt-4 text-sm text-muted">
          The {e.limiting === "CPU" ? "CPU" : "GPU"} has the lower power, so it
          limits the pair and the verdict is &ldquo;{e.note}&rdquo;.
        </p>
      </div>
    </section>
  );
}
