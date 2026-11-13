export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          BChecker is an estimate, not a measurement. Scores from{" "}
          <a
            className="text-text underline decoration-line-strong underline-offset-4 hover:decoration-accent"
            href="https://opendata.blender.org"
            rel="noopener noreferrer"
          >
            Blender Open Data
          </a>
          .
        </p>
        <p className="eyebrow">Built by Zxaviers</p>
      </div>
    </footer>
  );
}
