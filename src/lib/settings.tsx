import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth";
import { safeGet, safeSet } from "./safeStorage";

export type Theme = "dark" | "light" | "system";
interface Settings {
  theme: Theme;
  reduceMotion: boolean;
  largeText: boolean;
  readAloud: boolean;
  setTheme: (t: Theme) => void;
  setReduceMotion: (v: boolean) => void;
  setLargeText: (v: boolean) => void;
  setReadAloud: (v: boolean) => void;
}

const SettingsContext = createContext<Settings | null>(null);
const KEY = "space-legacy-settings";

function resolvedTheme(theme: Theme): "dark" | "light" {
  if (theme === "system") {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: light)").matches) return "light";
    return "dark";
  }
  return theme;
}

// Runs before paint (inlined in <head>) so the right theme shows immediately.
export const settingsBootScript = `(function(){try{if(typeof window!=='undefined'&&window.localStorage){var s=JSON.parse(localStorage.getItem('${KEY}')||'{}');var c=document.documentElement.classList;var t=s.theme;if(t==='system'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}if(t!=='light')c.add('dark');if(s.reduceMotion)c.add('reduce-motion');if(s.largeText)c.add('text-large');}}catch(e){try{document.documentElement.classList.add('dark')}catch(_){}}})();`;

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [readAloud, setReadAloud] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = safeGet(KEY);
      const s = JSON.parse(raw || "{}");
      setTheme((s.theme as Theme) || "dark");
      setReduceMotion(!!s.reduceMotion);
      setLargeText(!!s.largeText);
      setReadAloud(!!s.readAloud);
    } catch { /* ignore */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (typeof window === "undefined") return;
    const resolved = resolvedTheme(theme);
    const c = document.documentElement.classList;
    c.toggle("dark", resolved === "dark");
    c.toggle("reduce-motion", reduceMotion);
    c.toggle("text-large", largeText);
    safeSet(KEY, JSON.stringify({ theme, reduceMotion, largeText, readAloud }));
  }, [theme, reduceMotion, largeText, readAloud, ready]);

  // Listen for system theme changes when in "system" mode
  useEffect(() => {
    if (theme !== "system") return;
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const handler = () => {
      document.documentElement.classList.toggle("dark", !mq.matches);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  return (
    <SettingsContext.Provider value={{ theme, reduceMotion, largeText, readAloud, setTheme, setReduceMotion, setLargeText, setReadAloud }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}

/** Hook to sync settings to Supabase when signed in. Call once in profile/settings. */
export function useSyncSettingsToCloud() {
  const { user } = useAuth();
  const settings = useSettings();

  const sync = () => {
    if (!user) return;
    const prefs = {
      theme: settings.theme,
      reduceMotion: settings.reduceMotion,
      largeText: settings.largeText,
      readAloud: settings.readAloud,
    };
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      void supabase.from("explorer_profiles").update({ preferences: prefs as any }).eq("user_id", user.id);
    } catch {
      // Offline fallback
    }
  };

  return sync;
}
