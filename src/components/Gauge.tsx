import type { Severity } from "@/lib/severity";

const SEGMENTS = 20;

const FILL: Record<Severity, string> = {
  low: "bg-accent",
  mid: "bg-warn",
  high: "bg-danger",
};

interface GaugeProps {
  percent: number;
  severity: Severity;
}

/** Segmented health-bar. Each segment is 5%; 0% renders an empty bar. */
export function Gauge({ percent, severity }: GaugeProps) {
  const filled = Math.round((Math.min(100, Math.max(0, percent)) / 100) * SEGMENTS);

  return (
    <div
      role="meter"
      aria-label="Bottleneck"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-valuetext={`${percent.toFixed(2)} percent`}
      className="flex gap-[3px]"
    >
      {Array.from({ length: SEGMENTS }, (_, i) => {
        const on = i < filled;
        return (
          <span
            key={i}
            aria-hidden="true"
            className={`h-6 flex-1 origin-bottom ${on ? FILL[severity] : "bg-line"}`}
            style={
              on
                ? { animation: `seg-in 260ms ease-out ${i * 28}ms both` }
                : undefined
            }
          />
        );
      })}
    </div>
  );
}
