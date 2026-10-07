// Favorites context: heart toggle for hardware profiles.
// Guests: localStorage only. Signed-in users: synced to Supabase.
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth";
import { safeGet, safeSet } from "./safeStorage";

const STORAGE_KEY = "space-legacy-favorites";

interface FavoritesState {
  favorites: string[];
  isFav: (slug: string) => boolean;
  toggleFav: (slug: string) => void;
}

const FavoritesContext = createContext<FavoritesState>({
  favorites: [],
  isFav: () => false,
  toggleFav: () => {},
});

function fromStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = safeGet(STORAGE_KEY);
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  /** Prevent saving empty initial state before stored data is loaded. */
  const isLoadedRef = useRef(false);

  // ─── Load from localStorage on mount, then merge from Supabase when signed in ───
  useEffect(() => {
    // Always start with what's in localStorage
    const local = fromStorage();
    setFavorites(local);
    isLoadedRef.current = true;

    if (!user) return;

    // When signed in, fetch remote data and merge
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase
          .from("explorer_profiles")
          .select("favorites")
          .eq("user_id", user.id)
          .maybeSingle();

        if (cancelled) return;

        const remote: string[] = (data?.favorites as string[] | null) || [];

        // Merge: union local + remote
        const merged = [...new Set([...remote, ...local])];
        setFavorites(merged);

        // Sync merged data up to Supabase
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          void supabase.from("explorer_profiles").update({ favorites: merged as any }).eq("user_id", user.id);
        } catch {
          // Offline fallback
        }
      } catch {
        // Supabase network / offline fallback
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  // ─── Persist to localStorage on every state change ───
  useEffect(() => {
    if (!isLoadedRef.current) return;
    safeSet(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  // Sync to Supabase (fire-and-forget)
  const syncToCloud = useCallback(
    (favs: string[]) => {
      if (!user) return;
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        void supabase.from("explorer_profiles").update({ favorites: favs as any }).eq("user_id", user.id);
      } catch {
        // Offline fallback
      }
    },
    [user]
  );

  const isFav = useCallback((slug: string) => favorites.includes(slug), [favorites]);

  const toggleFav = useCallback(
    (slug: string) => {
      setFavorites((prev) => {
        const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
        syncToCloud(next);
        return next;
      });
    },
    [syncToCloud]
  );

  return (
    <FavoritesContext.Provider value={{ favorites, isFav, toggleFav }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
