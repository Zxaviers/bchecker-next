import { useId } from "react";

const ROTATIONS = Array.from({ length: 12 }, (_, i) => i * 15);

/** Rosette seal: a ring of rotated ellipses with a lettered border. Crisp geometry only. */
export function Seal({ className = "" }: { className?: string }) {
  const id = useId();
  return (
    <svg aria-hidden="true" viewBox="0 0 160 160" className={className}>
      <defs>
        <path id={id} d="M80 80 m-64 0 a64 64 0 1 1 128 0 a64 64 0 1 1 -128 0" />
      </defs>
      <circle cx="80" cy="80" r="76" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="80" cy="80" r="52" fill="none" stroke="currentColor" strokeWidth="1" />
      <g fill="none" stroke="currentColor" strokeWidth="0.8">
        {ROTATIONS.map((r) => (
          <ellipse key={r} cx="80" cy="80" rx="48" ry="17" transform={`rotate(${r} 80 80)`} />
        ))}
      </g>
      <text fill="currentColor" fontSize="11" fontWeight="700" letterSpacing="3.2">
        <textPath href={`#${id}`} startOffset="0">
          BCHECKER  &#183;  ESTIMATE ONLY  &#183;  BCHECKER  &#183;  ESTIMATE ONLY  &#183;
        </textPath>
      </text>
      <text
        x="80"
        y="89"
        textAnchor="middle"
        fill="currentColor"
        fontSize="26"
        fontWeight="700"
      >
        BC-1
      </text>
    </svg>
  );
}
