import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "dark" | "light";
interface Settings {
  theme: Theme;
  reduceMotion: boolean;
  largeText: boolean;
  setTheme: (t: Theme) => void;
  setReduceMotion: (v: boolean) => void;
  setLargeText: (v: boolean) => void;
}

const SettingsContext = createContext<Settings | null>(null);
const KEY = "space-legacy-settings";

// Runs before paint (inlined in <head>) so the right theme shows immediately.
export const settingsBootScript = `(function(){try{var s=JSON.parse(localStorage.getItem('${KEY}')||'{}');var c=document.documentElement.classList;if(s.theme!=='light')c.add('dark');if(s.reduceMotion)c.add('reduce-motion');if(s.largeText)c.add('text-large');}catch(e){document.documentElement.classList.add('dark')}})();`;

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || "{}");
      setTheme(s.theme === "light" ? "light" : "dark");
      setReduceMotion(!!s.reduceMotion);
      setLargeText(!!s.largeText);
    } catch { /* ignore */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const c = document.documentElement.classList;
    c.toggle("dark", theme === "dark");
    c.toggle("reduce-motion", reduceMotion);
    c.toggle("text-large", largeText);
    localStorage.setItem(KEY, JSON.stringify({ theme, reduceMotion, largeText }));
  }, [theme, reduceMotion, largeText, ready]);

  return (
    <SettingsContext.Provider value={{ theme, reduceMotion, largeText, setTheme, setReduceMotion, setLargeText }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}
