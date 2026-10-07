import { Fragment, useEffect, useState, type ReactNode } from "react";
import { Volume2, Square } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { glossary } from "@/content/glossary";
import { statusLabels, type Status } from "@/content/hardware";
import { cn } from "@/lib/utils";

const statusStyles: Record<Status, string> = {
  talking: "border-status-talking/50 bg-status-talking/15 text-status-talking",
  traveling: "border-status-traveling/50 bg-status-traveling/15 text-status-traveling",
  resting: "border-status-resting/50 bg-status-resting/15 text-status-resting",
  complete: "border-status-complete/50 bg-status-complete/15 text-status-complete",
};

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold", statusStyles[status], className)}>
      <span className={cn("h-2 w-2 rounded-full bg-current", status === "talking" && "animate-pulse")} aria-hidden />
      {statusLabels[status]}
    </span>
  );
}

/** Tap/hover glossary term. */
export function Term({ k, children }: { k: string; children: ReactNode }) {
  const g = glossary[k];
  if (!g) return <>{children}</>;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className="cursor-help font-semibold text-accent underline decoration-dotted underline-offset-4" aria-label={`What does ${g.term} mean?`}>
          {children}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 text-sm">
        <p className="font-display text-base font-semibold">{g.term}</p>
        <p className="mt-1 text-muted-foreground">{g.definition}</p>
      </PopoverContent>
    </Popover>
  );
}

/** Renders text with [[key|words]] glossary markup. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\[\[\w+\|[^\]]+\]\])/g);
  return (
    <>
      {parts.map((p, i) => {
        const m = p.match(/^\[\[(\w+)\|([^\]]+)\]\]$/);
        return m ? <Term key={i} k={m[1]}>{m[2]}</Term> : <Fragment key={i}>{p}</Fragment>;
      })}
    </>
  );
}

export const plain = (text: string) => text.replace(/\[\[\w+\|([^\]]+)\]\]/g, "$1");

export function ReadAloud({ text, onPlay }: { text: string; onPlay?: () => void }) {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  useEffect(() => {
    setSupported("speechSynthesis" in window);
    return () => { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); };
  }, []);
  if (!supported) return null;
  const toggle = () => {
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    const u = new SpeechSynthesisUtterance(plain(text));
    u.rate = 0.95;
    u.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
    setSpeaking(true);
    onPlay?.();
  };
  return (
    <button type="button" onClick={toggle} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-letter-foreground/30 px-4 text-sm font-bold hover:bg-letter-foreground/10" aria-pressed={speaking}>
      {speaking ? <Square className="h-4 w-4" aria-hidden /> : <Volume2 className="h-4 w-4" aria-hidden />}
      {speaking ? "Stop reading" : "Read it to me"}
    </button>
  );
}

export function PageHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <header className="mx-auto max-w-3xl px-4 pb-8 pt-12 text-center animate-rise">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
      <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{title}</h1>
      {intro && <p className="mt-4 text-lg text-muted-foreground">{intro}</p>}
    </header>
  );
}
