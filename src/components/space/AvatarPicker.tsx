// AvatarPicker — grid of space avatar options.
import { AVATAR_DEFS, type AvatarKey } from "@/lib/avatars";
import { cn } from "@/lib/utils";

interface AvatarPickerProps {
  value: AvatarKey;
  onChange: (key: AvatarKey) => void;
  size?: "sm" | "lg";
}

export function AvatarPicker({ value, onChange, size = "lg" }: AvatarPickerProps) {
  return (
    <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label="Choose your avatar">
      {AVATAR_DEFS.map((a) => (
        <button
          key={a.key}
          type="button"
          role="radio"
          aria-checked={value === a.key}
          aria-label={a.ariaLabel}
          onClick={() => onChange(a.key)}
          className={cn(
            "flex flex-col items-center gap-1 rounded-2xl border-2 p-2 transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            value === a.key
              ? "border-primary bg-primary/15 shadow-md"
              : "border-border bg-card hover:border-muted-foreground/40"
          )}
        >
          <span className={cn("block", size === "lg" ? "text-3xl" : "text-2xl")} aria-hidden>
            {a.emoji}
          </span>
          <span className="text-[10px] font-bold leading-tight text-muted-foreground">{a.label}</span>
        </button>
      ))}
    </div>
  );
}

/** Displays the avatar emoji at the given size. */
export function AvatarDisplay({
  avatarKey,
  size = "md",
  className,
}: {
  avatarKey: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const def = AVATAR_DEFS.find((a) => a.key === avatarKey) ?? AVATAR_DEFS[0];
  const sizeClasses = {
    sm: "h-8 w-8 text-lg",
    md: "h-11 w-11 text-2xl",
    lg: "h-16 w-16 text-4xl",
    xl: "h-24 w-24 text-6xl",
  };
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-primary/15 border-2 border-primary/30",
        sizeClasses[size],
        className
      )}
      aria-label={def.ariaLabel}
      role="img"
    >
      <span aria-hidden>{def.emoji}</span>
    </div>
  );
}
