import { Guilloche } from "./Guilloche";
import { SectionHead } from "./SectionHead";
import { Seal } from "./Seal";

export function Footer() {
  return (
    <footer className="mt-28">
      <div className="px-4 sm:px-8">
        <SectionHead letter="G" title="Authorisation" />
        <div className="mt-8 grid items-center gap-8 sm:grid-cols-[1fr_auto]">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="typed border-b-2 border-line-strong pb-1 text-2xl font-bold">BChecker</p>
              <p className="mt-1 text-lg text-muted">Issued by</p>
            </div>
            <div>
              <p className="typed border-b-2 border-line-strong pb-1 text-2xl font-bold">Zxaviers</p>
              <p className="mt-1 text-lg text-muted">Compiled by</p>
            </div>
            <p className="text-lg text-muted sm:col-span-2">
              Form BC-1. An estimate, not a measurement and not an accredited
              certificate. Scores from{" "}
              <a
                className="font-medium text-text underline underline-offset-4"
                href="https://opendata.blender.org"
                rel="noopener noreferrer"
              >
                Blender Open Data
              </a>
              .
            </p>
          </div>
          <Seal className="mx-auto h-40 w-40 -rotate-6 text-accent" />
        </div>
      </div>
      <p className="mt-14 text-center text-lg font-semibold uppercase tracking-[0.3em] text-muted">
        End of report
      </p>
      <Guilloche className="mt-3 block text-accent" height={44} />
    </footer>
  );
}
