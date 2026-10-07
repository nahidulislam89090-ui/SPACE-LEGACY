// Favorites context: heart toggle for hardware profiles.
// Guests: localStorage only. Signed-in users: synced to Supabase.
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth";
import { safeGet, safeSet } from "./safeStorage";

function getFavoritesKey(userId?: string | null): string {
  if (!userId) return "space-legacy-favorites-guest";
  return `space-legacy-favorites-${userId}`;
}

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

function fromStorage(userId?: string | null): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = safeGet(getFavoritesKey(userId));
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id || null;
  const [favorites, setFavorites] = useState<string[]>([]);
  /** Prevent saving empty initial state before stored data is loaded. */
  const isLoadedRef = useRef(false);
  const activeUserIdRef = useRef<string | null>(null);

  // ─── Load from isolated user storage on mount and when userId changes ───
  useEffect(() => {
    isLoadedRef.current = false;
    activeUserIdRef.current = userId;

    const local = fromStorage(userId);
    setFavorites(local);
    isLoadedRef.current = true;

    if (!user || user.id.startsWith("local-") || user.id.startsWith("guest-")) return;

    // When signed in with remote account, fetch remote data and merge
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase
          .from("explorer_profiles")
          .select("favorites")
          .eq("user_id", user.id)
          .maybeSingle();

        if (cancelled || activeUserIdRef.current !== user.id) return;

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
  }, [userId]);

  // ─── Persist to isolated user storage on every state change ───
  useEffect(() => {
    if (!isLoadedRef.current) return;
    safeSet(getFavoritesKey(userId), JSON.stringify(favorites));
  }, [favorites, userId]);

  // Sync to Supabase (fire-and-forget)
  const syncToCloud = useCallback(
    (favs: string[]) => {
      if (!user || user.id.startsWith("local-") || user.id.startsWith("guest-")) return;
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
