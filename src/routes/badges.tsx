import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Award, Lock, Printer, RotateCcw, Trophy, UserRound } from "lucide-react";
import { BADGE_DEFS, LEVEL_ORDER, type BadgeId, type ExplorerLevel } from "@/lib/badges";
import { useProgress } from "@/lib/progress";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/badges")({
  head: () => ({
    meta: [
      { title: "Explorer Badges — SPACE LEGACY" },
      { name: "description", content: "Collect Explorer badges as you explore NASA missions. Unlock the Space Archivist certificate when you earn them all." },
      { property: "og:title", content: "Explorer Badges — SPACE LEGACY" },
      { property: "og:description", content: "Your badge shelf, explorer level, and printable Space Archivist certificate." },
    ],
  }),
  component: BadgesPage,
});

// ─── Level colours ────────────────────────────────────────────────────────────
const levelStyle: Record<ExplorerLevel, string> = {
  Cadet: "border-status-resting/60 bg-status-resting/15 text-status-resting",
  Explorer: "border-primary/60 bg-primary/15 text-primary",
  Archivist: "border-accent/60 bg-accent/15 text-accent",
};

const levelDesc: Record<ExplorerLevel, string> = {
  Cadet: "You've started your journey. Keep exploring!",
  Explorer: "Great work — you're making real discoveries!",
  Archivist: "You've earned every badge. The solar system salutes you! 🎉",
};

// ─── Badge card ──────────────────────────────────────────────────────────────
function BadgeCard({ id, earned }: { id: BadgeId; earned: boolean }) {
  const def = BADGE_DEFS.find((b) => b.id === id)!;
  return (
    <div
      className={cn(
        "group relative flex flex-col items-center gap-3 rounded-3xl border-2 p-5 text-center transition-all",
        earned
          ? "border-accent/50 bg-card hover:-translate-y-1 hover:shadow-lg"
          : "border-border bg-muted/30 opacity-50"
      )}
      aria-label={earned ? `${def.name} — earned` : `${def.name} — locked`}
    >
      {/* Emoji or lock */}
      <div className={cn(
        "relative flex h-16 w-16 items-center justify-center rounded-2xl text-4xl",
        earned ? "bg-accent/10" : "bg-muted"
      )}>
        {earned ? (
          <span aria-hidden>{def.emoji}</span>
        ) : (
          <Lock className="h-7 w-7 text-muted-foreground" aria-hidden />
        )}
        {earned && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs" aria-hidden>✓</span>
        )}
      </div>

      <div>
        <p className="font-display text-base font-semibold leading-tight">{def.name}</p>
        <p className="mt-1 text-xs text-muted-foreground leading-snug">{def.description}</p>
        {def.level && (
          <span className={cn("mt-2 inline-block rounded-full border px-2 py-0.5 text-xs font-bold", levelStyle[def.level])}>
            {def.level}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Certificate ─────────────────────────────────────────────────────────────
function Certificate({ name }: { name: string }) {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      id="space-archivist-certificate"
      className="print-target mx-auto max-w-2xl rounded-3xl border-4 border-accent bg-card p-10 text-center shadow-2xl"
    >
      <p className="text-4xl" aria-hidden>🏆</p>
      <p className="mt-3 text-xs font-bold uppercase tracking-[0.3em] text-accent">Space Legacy</p>
      <h2 className="mt-2 font-display text-4xl font-bold">Certificate of Achievement</h2>
      <p className="mt-1 text-lg text-muted-foreground">This certifies that</p>
      <p className="mt-3 font-display text-3xl font-semibold text-primary">{name || "Space Explorer"}</p>
      <p className="mt-3 text-lg text-muted-foreground">
        has earned the rank of <strong className="text-accent">Space Archivist</strong><br />
        by completing all Explorer badges in the
      </p>
      <p className="mt-1 font-display text-2xl font-semibold">SPACE LEGACY museum</p>
      <p className="mt-3 text-muted-foreground">Issued: {today}</p>
      <div className="mt-6 flex justify-center gap-4 text-3xl" aria-hidden>
        🌕 🔴 🌌 🛸 ⭐ 📡 ⏳ 🌪️ ✉️ 🏆
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        NASA Space Apps Challenge · Not an official NASA document
      </p>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
function BadgesPage() {
  const { badges, explorerLevel: level, displayName, setDisplayName, resetProgress, scores } = useProgress();
  const { user } = useAuth();
  const [certName, setCertName] = useState(displayName);
  const [showCert, setShowCert] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  const totalBadges = BADGE_DEFS.length;
  const earnedCount = badges.size;
  const progressPct = Math.round((earnedCount / totalBadges) * 100);
  const archivistUnlocked = badges.has("space-archivist");

  const handlePrint = () => {
    window.print();
  };

  const handleNameChange = (v: string) => {
    setCertName(v);
    setDisplayName(v);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Header */}
      <header className="animate-rise text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Your achievements</p>
        <h1 className="mt-3 font-display text-5xl font-bold">Explorer Badges</h1>
        <p className="mt-3 text-lg text-muted-foreground">Collect badges as you explore the museum.</p>
      </header>

      {/* Guest prompt */}
      {!user && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm">
          <UserRound className="h-5 w-5 shrink-0 text-accent" aria-hidden />
          <p>
            Your badges are saved on this device only.{" "}
            <Link to="/login" search={{ redirect: "", message: "" }} className="font-bold underline hover:text-foreground">
              Log in to save them to your account
            </Link>{" "}
            and keep them across devices.
          </p>
        </div>
      )}

      {/* Level + progress */}
      <div className="mt-8 rounded-3xl border bg-card p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Explorer level</p>
            <div className="mt-1 flex items-center gap-2">
              {LEVEL_ORDER.map((lv, i) => (
                <span
                  key={lv}
                  className={cn(
                    "rounded-full border px-3 py-1 text-sm font-bold transition-all",
                    lv === level ? levelStyle[lv] : "border-border text-muted-foreground opacity-40"
                  )}
                  aria-current={lv === level ? "true" : undefined}
                >
                  {lv}
                </span>
              ))}
            </div>
            <p className="mt-2 text-muted-foreground">{levelDesc[level]}</p>
          </div>

          <div className="flex items-center gap-2">
            <Trophy className="h-8 w-8 text-accent" aria-hidden />
            <div>
              <p className="font-display text-3xl font-bold">{earnedCount}<span className="text-muted-foreground">/{totalBadges}</span></p>
              <p className="text-xs text-muted-foreground">badges earned</p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-1 flex justify-between text-xs font-bold text-muted-foreground">
            <span>Progress</span>
            <span>{progressPct}%</span>
          </div>
          <Progress value={progressPct} className="h-3" aria-label={`${progressPct}% of badges earned`} />
        </div>
      </div>

      {/* Trophy shelf */}
      <section aria-labelledby="badge-shelf-title" className="mt-10">
        <h2 id="badge-shelf-title" className="mb-6 font-display text-2xl font-semibold">Trophy Shelf</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BADGE_DEFS.map((def) => (
            <BadgeCard key={def.id} id={def.id} earned={badges.has(def.id)} />
          ))}
        </div>
      </section>

      {/* How to earn badges */}
      <section className="mt-10 rounded-3xl border bg-card p-6 sm:p-8" aria-labelledby="how-to-earn-title">
        <h2 id="how-to-earn-title" className="font-display text-xl font-semibold">How to earn badges</h2>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li>👣 <strong>First Footprint</strong> — open any spacecraft profile</li>
          <li>🌕 <strong>Moon Keeper</strong> — finish all Moon profiles' quizzes (pass at least half)</li>
          <li>🔴 <strong>Red Planet Ranger</strong> — finish all Mars profiles' quizzes</li>
          <li>🌌 <strong>Deep Space Voyager</strong> — finish all deep space profiles' quizzes</li>
          <li>⭐ <strong>Quiz Whiz</strong> — get 100% on any quiz</li>
          <li>📡 <strong>Signal Detective</strong> — explore all destinations in the radio signal explainer</li>
          <li>⏳ <strong>Time Traveler</strong> — scroll to the bottom of the Timeline</li>
          <li>🌪️ <strong>Dust Buster</strong> — drag the dust slider past 80% in Science Corner</li>
          <li>✉️ <strong>Letter Reader</strong> — read (or listen to) 3 "Letters from the machines"</li>
          <li>🏆 <strong>Space Archivist</strong> — earn all of the above! Unlocks your certificate.</li>
        </ul>
      </section>

      {/* Certificate */}
      <section className="mt-10" aria-labelledby="cert-title">
        <div className="flex items-center justify-between gap-4">
          <h2 id="cert-title" className="font-display text-2xl font-semibold">Space Archivist Certificate</h2>
          {archivistUnlocked && (
            <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-bold text-accent">Unlocked!</span>
          )}
        </div>

        {!archivistUnlocked ? (
          <div className="mt-4 rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
            <Lock className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden />
            <p className="mt-3 font-display text-xl">Earn all 9 main badges to unlock your certificate.</p>
            <p className="mt-1 text-muted-foreground">You have {earnedCount - (badges.has("space-archivist") ? 1 : 0)} of 9. Keep going!</p>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {/* Name field */}
            <div className="flex flex-wrap items-center gap-3">
              <label htmlFor="cert-name" className="font-bold">Your name for the certificate:</label>
              <input
                id="cert-name"
                type="text"
                value={certName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Type your name"
                maxLength={60}
                className="flex-1 rounded-xl border border-border bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Preview toggle */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => setShowCert((v) => !v)}
                aria-expanded={showCert}
              >
                <Award className="mr-2 h-4 w-4" />
                {showCert ? "Hide preview" : "Preview certificate"}
              </Button>
              <Button onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Save as PDF / Print
              </Button>
            </div>

            {showCert && (
              <div ref={certRef} className="mt-4">
                <Certificate name={certName || displayName || "Space Explorer"} />
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              To save as PDF: click "Save as PDF / Print", then choose "Save as PDF" in the print dialog. The certificate will be formatted for A4/Letter.
            </p>
          </div>
        )}
      </section>

      {/* Reset progress */}
      <section className="mt-10 border-t border-border pt-8">
        <h2 className="font-display text-xl font-semibold text-muted-foreground">Reset progress</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Useful on a shared classroom device. This will clear all badges, quiz scores, and your certificate name from this device.
          {user ? " Your account data will also be reset." : ""}
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="mt-4 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset all progress
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will delete all your badges, quiz scores and certificate name from this device
                {user ? " and your account" : ""}. It cannot be undone.
                <br /><br />
                If you are on a shared classroom device, this lets the next student start fresh.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={resetProgress}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Yes, reset everything
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </div>
  );
}
