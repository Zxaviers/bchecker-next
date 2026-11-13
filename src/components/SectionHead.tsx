/** Lettered section heading, as on a printed form. The letter is a real sequence (A to F). */
export function SectionHead({
  letter,
  title,
  id,
}: {
  letter: string;
  title: string;
  id?: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b-2 border-line-strong pb-2">
      <span className="tab" aria-hidden="true">
        {letter}
      </span>
      <h2 id={id} className="text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}
