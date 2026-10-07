// Simple SVG progress ring.
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  value: number; // 0–100
  size?: number;
  strokeWidth?: number;
  label: string;
  className?: string;
  /** Color class for the filled arc, e.g. "text-zone-moon" */
  colorClass?: string;
}

export function ProgressRing({
  value,
  size = 64,
  strokeWidth = 6,
  label,
  className,
  colorClass = "text-primary",
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(value, 100) / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/40"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn("transition-all duration-700 ease-out", colorClass)}
        />
      </svg>
      <span className="absolute font-display text-xs font-bold">{Math.round(value)}%</span>
    </div>
  );
}
