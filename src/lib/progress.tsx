// Quiz scores + badges. Kept on this device for guests; synced to the explorer's account when signed in.
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth";

type Scores = Record<string, number>; // slug -> best number correct
interface Progress {
  scores: Scores;
  displayName: string;
  record: (slug: string, correct: number) => void;
  setDisplayName: (n: string) => void;
}

const KEY = "space-legacy-progress";
const ProgressContext = createContext<Progress | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [scores, setScores] = useState<Scores>({});
  const [displayName, setName] = useState("");

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || "{}");
      setScores(s.scores || {});
      setName(s.displayName || "");
    } catch { /* ignore */ }
  }, []);

  // On sign-in, merge account progress with this device's progress.
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("explorer_profiles").select("display_name, quiz_scores").eq("user_id", user.id).maybeSingle();
      const remote = (data?.quiz_scores as Scores | null) || {};
      setScores((local) => {
        const merged: Scores = { ...remote };
        for (const [k, v] of Object.entries(local)) merged[k] = Math.max(v, merged[k] ?? 0);
        void supabase.from("explorer_profiles").upsert({ user_id: user.id, quiz_scores: merged, display_name: data?.display_name ?? null });
        return merged;
      });
      if (data?.display_name) setName(data.display_name);
    })();
  }, [user]);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify({ scores, displayName }));
  }, [scores, displayName]);

  const record = useCallback((slug: string, correct: number) => {
    setScores((prev) => {
      const next = { ...prev, [slug]: Math.max(correct, prev[slug] ?? 0) };
      if (user) void supabase.from("explorer_profiles").update({ quiz_scores: next }).eq("user_id", user.id);
      return next;
    });
  }, [user]);

  const setDisplayName = useCallback((n: string) => {
    setName(n);
    if (user) void supabase.from("explorer_profiles").update({ display_name: n }).eq("user_id", user.id);
  }, [user]);

  return <ProgressContext.Provider value={{ scores, displayName, record, setDisplayName }}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider");
  return ctx;
}

export const BADGES_FOR_CERTIFICATE = 6;
