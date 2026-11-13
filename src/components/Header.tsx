import Link from "next/link";
import { Guilloche } from "./Guilloche";

export function Header() {
  return (
    <header>
      <Guilloche className="block text-accent" height={44} />
      <div className="border-b-2 border-line-strong">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 px-4 py-3 sm:px-8">
          <Link href="/" className="flex items-baseline gap-4" aria-label="BChecker home">
            <span className="text-3xl font-bold leading-none tracking-[0.06em]">BCHECKER</span>
            <span className="hidden text-lg text-muted sm:inline">Component pairing test report</span>
          </Link>
          <nav aria-label="Page sections" className="flex gap-6 text-lg font-medium">
            <a className="underline decoration-muted underline-offset-4 hover:decoration-line-strong" href="#how-it-works">
              Method
            </a>
            <a className="underline decoration-muted underline-offset-4 hover:decoration-line-strong" href="#about-data">
              Sources and limits
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
