import Link from "next/link";
import { CPUS, GPUS } from "@/data/parts";

export function Header() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3" aria-label="BChecker home">
          <span
            aria-hidden="true"
            className="grid h-9 w-9 place-items-center border-2 border-accent font-bold leading-none text-accent"
          >
            B
          </span>
          <span className="text-xl font-bold tracking-[0.18em] text-text">
            BCHECKER
          </span>
        </Link>
        <nav aria-label="Page sections" className="eyebrow flex flex-wrap gap-x-5 gap-y-1">
          <a className="hover:text-text" href="#how-it-works">How it works</a>
          <a className="hover:text-text" href="#about-data">
            {CPUS.length} CPUs <span aria-hidden="true">/</span> {GPUS.length} GPUs
          </a>
        </nav>
      </div>
    </header>
  );
}
