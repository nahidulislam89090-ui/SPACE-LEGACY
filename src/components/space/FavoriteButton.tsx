// Heart toggle button for hardware profile pages.
import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/favorites";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  slug: string;
  className?: string;
}

export function FavoriteButton({ slug, className }: FavoriteButtonProps) {
  const { isFav, toggleFav } = useFavorites();
  const active = isFav(slug);

  return (
    <button
      type="button"
      onClick={() => toggleFav(slug)}
      className={cn(
        "group inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-bold transition-all",
        active
          ? "border-destructive/50 bg-destructive/15 text-destructive hover:bg-destructive/25"
          : "border-border bg-card text-muted-foreground hover:border-destructive/40 hover:text-destructive",
        className
      )}
      aria-pressed={active}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-all",
          active ? "fill-destructive text-destructive scale-110" : "group-hover:scale-110"
        )}
        aria-hidden
      />
      {active ? "Saved" : "Save"}
    </button>
  );
}
