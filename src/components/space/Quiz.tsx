import { useState } from "react";
import { Award, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Hardware } from "@/content/hardware";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

export function Quiz({ item }: { item: Hardware }) {
  const { record, scores } = useProgress();
  const [picks, setPicks] = useState<(number | null)[]>(item.quiz.map(() => null));
  const done = picks.every((p) => p !== null);
  const correct = picks.filter((p, i) => p === item.quiz[i].answer).length;
  const earned = (scores[item.slug] ?? 0) >= Math.ceil(item.quiz.length / 2);

  const pick = (qi: number, oi: number) => {
    if (picks[qi] !== null) return;
    const next = picks.map((p, i) => (i === qi ? oi : p));
    setPicks(next);
    if (next.every((p) => p !== null)) {
      const numCorrect = next.filter((p, i) => p === item.quiz[i].answer).length;
      record(item.slug, numCorrect, item.quiz.length);
    }
  };

  return (
    <div className="space-y-6">
      {item.quiz.map((q, qi) => (
        <fieldset key={qi} className="rounded-2xl border bg-card p-5">
          <legend className="px-2 font-display text-lg font-semibold">{qi + 1}. {q.q}</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {q.options.map((o, oi) => {
              const chosen = picks[qi] === oi;
              const answered = picks[qi] !== null;
              const right = oi === q.answer;
              return (
                <button key={oi} type="button" onClick={() => pick(qi, oi)} disabled={answered}
                  className={cn("flex min-h-12 items-center justify-between gap-2 rounded-xl border-2 px-4 py-2 text-left font-bold transition-colors",
                    !answered && "hover:border-primary hover:bg-primary/10",
                    answered && right && "border-status-talking bg-status-talking/15",
                    answered && chosen && !right && "border-destructive bg-destructive/15",
                    answered && !chosen && !right && "opacity-60")}
                  aria-pressed={chosen}>
                  {o}
                  {answered && right && <Check className="h-5 w-5 shrink-0" aria-label="Correct" />}
                  {answered && chosen && !right && <X className="h-5 w-5 shrink-0" aria-label="Not quite" />}
                </button>
              );
            })}
          </div>
          {picks[qi] !== null && <p className="mt-3 text-sm text-muted-foreground" role="status">{q.explain}</p>}
        </fieldset>
      ))}
      {done && (
        <div className="flex flex-wrap items-center gap-4 rounded-2xl border-2 border-accent bg-accent/10 p-5" role="status">
          <Award className="h-10 w-10 text-accent" aria-hidden />
          <div className="flex-1">
            <p className="font-display text-xl font-semibold">You got {correct} of {item.quiz.length}!</p>
            <p className="text-muted-foreground">{earned ? "Explorer badge collected! See it on your Badges page." : "Get at least half right to earn this badge. Try again!"}</p>
          </div>
          <Button variant="outline" onClick={() => setPicks(item.quiz.map(() => null))}>Try again</Button>
        </div>
      )}
    </div>
  );
}
