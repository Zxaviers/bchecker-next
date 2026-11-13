import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main" className="mx-auto w-full max-w-6xl px-4 pt-12 sm:px-6 sm:pt-16">
        <p className="eyebrow">Loadout analyzer</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
          Find what&apos;s holding your build back.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted">
          Choose a CPU and a GPU, say what you use them for, and get an
          estimate of which part is the limit and by how much.
        </p>
        <section aria-label="Loadout" className="hud-panel mt-10 p-6">
          <p className="eyebrow">Loadout loads here</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
