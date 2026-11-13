import { AboutData } from "@/components/AboutData";
import { Analyzer } from "@/components/Analyzer";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HowItWorks } from "@/components/HowItWorks";
import { Seal } from "@/components/Seal";
import { CPUS, GPUS } from "@/data/parts";

const DETAILS: [string, string][] = [
  ["Form", "BC-1"],
  ["Parts on file", `${CPUS.length} CPUs, ${GPUS.length} GPUs`],
  ["Data", "Blender Open Data, v4.5.0"],
  ["Basis", "Rendering benchmark"],
  ["Status", "Estimate only"],
];

export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="relative mx-auto max-w-6xl px-2 pb-16 pt-3 sm:px-6 sm:pb-24 sm:pt-10">
        {/* the second sheet, turned slightly beneath the report */}
        <div
          aria-hidden="true"
          className="paper-under absolute inset-x-5 bottom-10 top-6 -rotate-[0.8deg] sm:inset-x-10 sm:bottom-16 sm:top-14"
        />
        <div className="paper relative overflow-hidden">
          <Header />
          <main id="main" className="relative px-4 pt-10 sm:px-8 sm:pt-14">
            <Seal className="pointer-events-none absolute -right-24 -top-16 hidden h-[30rem] w-[30rem] text-accent opacity-[0.09] md:block" />
            <div className="relative grid items-end gap-8 lg:grid-cols-[1fr_20rem]">
              <div>
                <h1 className="max-w-[16ch] text-[clamp(3.25rem,8.5vw,6rem)] font-bold leading-[0.95] tracking-tight text-balance">
                  Does your CPU hold your GPU back?
                </h1>
                <p className="mt-5 max-w-[48ch] text-xl text-muted">
                  Choose two parts and what you use them for. BChecker works out
                  which one sets the pace, shows the arithmetic and cites every score.
                </p>
              </div>
              <dl className="entry typed text-sm">
                {DETAILS.map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between gap-4 border-b border-line px-3 py-2 last:border-b-0"
                  >
                    <dt className="text-muted">{k}</dt>
                    <dd className="text-right font-bold">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <section aria-label="Test form" className="relative mt-12">
              <Analyzer />
            </section>
            <HowItWorks />
            <AboutData />
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}
