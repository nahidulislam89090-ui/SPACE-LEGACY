// Quiz scores + badges. Kept on this device for guests; synced to the explorer's account when signed in.
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth";
import {
  ARCHIVIST_PREREQS,
  type BadgeId,
  explorerLevel,
  type ExplorerLevel,
} from "./badges";
import { hardware } from "@/content/hardware";
import type { Zone } from "@/content/hardware";
import { safeGet, safeSet, safeRemove } from "./safeStorage";

type Scores = Record<string, number>; // slug -> best number correct
type BadgeSet = BadgeId[];

interface Progress {
  scores: Scores;
  badges: Set<BadgeId>;
  displayName: string;
  explorerLevel: ExplorerLevel;
  totalScore: number;
  /** Letters that have been read/listened-to (slugs). */
  lettersRead: Set<string>;
  record: (slug: string, correct: number, total: number) => void;
  awardBadge: (id: BadgeId) => void;
  markLetterRead: (slug: string) => void;
  setDisplayName: (n: string) => void;
  resetProgress: () => void;
}

const STORAGE_KEY = "space-legacy-progress";

const ProgressContext = createContext<Progress | null>(null);

interface StoredProgress {
  scores: Scores;
  badges: Set<BadgeId>;
  displayName: string;
  lettersRead: Set<string>;
}

function emptyProgress(): StoredProgress {
  return { scores: {}, badges: new Set<BadgeId>(), displayName: "", lettersRead: new Set<string>() };
}

function fromStorage(): StoredProgress {
  if (typeof window === "undefined") return emptyProgress();
  try {
    const raw = safeGet(STORAGE_KEY);
    const s = JSON.parse(raw || "{}");
    return {
      scores: (s.scores as Scores) || {},
      badges: new Set<BadgeId>((s.badges as BadgeId[]) || []),
      displayName: (s.displayName as string) || "",
      lettersRead: new Set<string>((s.lettersRead as string[]) || []),
    };
  } catch {
    return emptyProgress();
  }
}

function toStorage(p: { scores: Scores; badges: Set<BadgeId>; displayName: string; lettersRead: Set<string> }) {
  if (typeof window === "undefined") return;
  try {
    safeSet(
      STORAGE_KEY,
      JSON.stringify({
        scores: p.scores,
        badges: [...p.badges],
        displayName: p.displayName,
        lettersRead: [...p.lettersRead],
      })
    );
  } catch {
    // ignore
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [scores, setScores] = useState<Scores>({});
  const [badges, setBadges] = useState<Set<BadgeId>>(new Set());
  const [displayName, setName] = useState("");
  const [lettersRead, setLettersRead] = useState<Set<string>>(new Set());
  /** Prevent saving empty initial state before stored data is loaded. */
  const isLoadedRef = useRef(false);

  // ─── Load from localStorage on mount, then merge from Supabase when signed in ───
  useEffect(() => {
    // Always start with what's in localStorage
    const local = fromStorage();
    setScores(local.scores);
    setBadges(local.badges);
    setName(local.displayName);
    setLettersRead(local.lettersRead);
    isLoadedRef.current = true;

    if (!user) return;

    // When signed in, fetch remote data and merge
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase
          .from("explorer_profiles")
          .select("display_name, quiz_scores, badges, letters_read")
          .eq("user_id", user.id)
          .maybeSingle();

        if (cancelled) return;

        const remoteScores: Scores = (data?.quiz_scores as Scores | null) || {};
        const remoteBadges: BadgeId[] = (data?.badges as BadgeId[] | null) || [];
        const remoteLetters: string[] = (data?.letters_read as string[] | null) || [];

        // Merge: take max scores, union badges/letters, prefer remote display name
        const mergedScores: Scores = { ...local.scores };
        for (const [k, v] of Object.entries(remoteScores)) {
          mergedScores[k] = Math.max(v, mergedScores[k] ?? 0);
        }
        const mergedBadges = new Set<BadgeId>([...local.badges, ...remoteBadges]);
        const mergedLetters = new Set<string>([...local.lettersRead, ...remoteLetters]);
        const name = data?.display_name || local.displayName || "";

        setScores(mergedScores);
        setBadges(mergedBadges);
        setLettersRead(mergedLetters);
        setName(name);

        // Sync merged data back up to Supabase if reachable
        try {
          void supabase.from("explorer_profiles").upsert({
            user_id: user.id,
            quiz_scores: mergedScores as Record<string, number>,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            badges: [...mergedBadges] as any,
            display_name: name || null,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            letters_read: [...mergedLetters] as any,
          });
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
    toStorage({ scores, badges, displayName, lettersRead });
  }, [scores, badges, displayName, lettersRead]);

  /** Sync full progress to Supabase (fire-and-forget) */
  const syncToCloud = useCallback(
    (s: Scores, b: Set<BadgeId>, n: string, l: Set<string>) => {
      if (!user) return;
      try {
        void supabase.from("explorer_profiles").upsert({
          user_id: user.id,
          quiz_scores: s as Record<string, number>,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          badges: [...b] as any,
          display_name: n || null,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          letters_read: [...l] as any,
        });
      } catch {
        // Offline fallback
      }
    },
    [user]
  );

  /** Check zone completion and award zone badge if all profiles+quizzes done. */
  const checkZoneBadge = useCallback(
    (nextScores: Scores, nextBadges: Set<BadgeId>, zone: Zone) => {
      const zoneItems = hardware.filter((h) => h.zone === zone);
      const allDone = zoneItems.every(
        (h) => (nextScores[h.slug] ?? 0) >= Math.ceil(h.quiz.length / 2)
      );
      if (!allDone) return nextBadges;
      const zoneMap: Record<Zone, BadgeId> = {
        moon: "moon-keeper",
        mars: "red-planet-ranger",
        deep: "deep-space-voyager",
      };
      return new Set([...nextBadges, zoneMap[zone]]);
    },
    []
  );

  /** Check if all prereqs are done and award Space Archivist if so. */
  const checkArchivist = (b: Set<BadgeId>): Set<BadgeId> => {
    if (ARCHIVIST_PREREQS.every((id) => b.has(id))) {
      return new Set([...b, "space-archivist"]);
    }
    return b;
  };

  const record = useCallback(
    (slug: string, correct: number, total: number) => {
      const item = hardware.find((h) => h.slug === slug);
      setScores((prevScores) => {
        const nextScores = { ...prevScores, [slug]: Math.max(correct, prevScores[slug] ?? 0) };
        setBadges((prevBadges) => {
          let nextBadges = new Set(prevBadges);
          // Quiz Whiz: 100% on any quiz
          if (correct === total && total > 0) nextBadges = new Set([...nextBadges, "quiz-whiz"]);
          // Zone badges
          if (item) nextBadges = checkZoneBadge(nextScores, nextBadges, item.zone);
          nextBadges = checkArchivist(nextBadges);
          syncToCloud(nextScores, nextBadges, displayName, lettersRead);
          return nextBadges;
        });
        return nextScores;
      });
    },
    [checkZoneBadge, displayName, lettersRead, syncToCloud]
  );

  const awardBadge = useCallback(
    (id: BadgeId) => {
      setBadges((prev) => {
        if (prev.has(id)) return prev;
        let next = new Set([...prev, id]);
        next = checkArchivist(next);
        syncToCloud(scores, next, displayName, lettersRead);
        return next;
      });
    },
    [displayName, lettersRead, scores, syncToCloud]
  );

  const markLetterRead = useCallback(
    (slug: string) => {
      setLettersRead((prev) => {
        const next = new Set([...prev, slug]);
        if (next.size >= 3) {
          setBadges((prevBadges) => {
            if (prevBadges.has("letter-reader")) return prevBadges;
            let nb = new Set([...prevBadges, "letter-reader" as BadgeId]);
            nb = checkArchivist(nb);
            syncToCloud(scores, nb, displayName, next);
            return nb;
          });
        } else {
          syncToCloud(scores, badges, displayName, next);
        }
        return next;
      });
    },
    [badges, displayName, scores, syncToCloud]
  );

  const setDisplayName = useCallback(
    (n: string) => {
      setName(n);
      if (user) {
        try {
          void supabase
            .from("explorer_profiles")
            .update({ display_name: n })
            .eq("user_id", user.id);
        } catch {
          // Offline fallback
        }
      }
    },
    [user]
  );

  const resetProgress = useCallback(() => {
    setScores({});
    setBadges(new Set());
    setName("");
    setLettersRead(new Set());
    safeRemove(STORAGE_KEY);
    if (user) {
      try {
        void supabase
          .from("explorer_profiles")
          .update({ quiz_scores: {}, badges: [], letters_read: [], display_name: null })
          .eq("user_id", user.id);
      } catch {
        // Offline fallback
      }
    }
  }, [user]);

  const level = explorerLevel(badges);
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  return (
    <ProgressContext.Provider
      value={{
        scores,
        badges,
        displayName,
        explorerLevel: level,
        totalScore,
        lettersRead,
        record,
        awardBadge,
        markLetterRead,
        setDisplayName,
        resetProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider");
  return ctx;
}

/** @deprecated use BADGE_DEFS from badges.ts instead */
export const BADGES_FOR_CERTIFICATE = 6;
