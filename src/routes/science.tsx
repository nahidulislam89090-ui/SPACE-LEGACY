import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Wind, Radio, Footprints, Activity, CheckCircle2 } from "lucide-react";
import { PageHeader, Term } from "@/components/space/bits";
import { useProgress } from "@/lib/progress";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/science")({
  head: () => ({
    meta: [
      { title: "Science Corner — SPACE LEGACY" },
      { name: "description", content: "Four interactive science explainers: dust storms, radio signals, footprints on the Moon, and marsquakes — for curious explorers aged 8–14." },
      { property: "og:title", content: "Science Corner — SPACE LEGACY" },
      { property: "og:description", content: "Interactive explainers about dust storms, radio signals, Moon footprints, and marsquakes." },
    ],
  }),
  component: SciencePage,
});

// ─── Facts to re-verify ─────────────────────────────────────────────────────
// - Dust storm frequency and scale on Mars (check NASA Mars weather reports)
// - Radio signal travel time to Voyager 1 (≈22+ hours one way; verify at voyager.jpl.nasa.gov)
// - Moon surface vacuum conditions (check NASA Artemis science docs)
// - InSight marsquake count (1,319 as of mission end Dec 2022; verify at science.nasa.gov/mission/insight)

// ─── Shared card shell ───────────────────────────────────────────────────────
function ExplainerCard({
  id,
  icon,
  eyebrow,
  title,
  children,
  completed,
}: {
  id: string;
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  completed?: boolean;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-20 rounded-3xl border bg-card p-6 sm:p-8"
      aria-labelledby={`${id}-title`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary">
            {icon}
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent">{eyebrow}</p>
            <h2 id={`${id}-title`} className="font-display text-2xl font-semibold">{title}</h2>
          </div>
        </div>
        {completed && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-status-talking/20 px-3 py-1 text-xs font-bold text-status-talking" aria-label="Explainer completed">
            <CheckCircle2 className="h-4 w-4" aria-hidden /> Done!
          </span>
        )}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

// ─── 1: Dust Storms vs Solar Panels ─────────────────────────────────────────
function DustStormExplainer() {
  const { awardBadge } = useProgress();
  const [dust, setDust] = useState([0]);
  const [completed, setCompleted] = useState(false);
  const dustPct = dust[0]; // 0-100

  // Award badge when user drags to > 80%
  useEffect(() => {
    if (dustPct >= 80 && !completed) {
      setCompleted(true);
      awardBadge("dust-buster");
    }
  }, [dustPct, completed, awardBadge]);

  const sunlight = Math.round(Math.max(0, 100 - dustPct * 0.9));
  const power = sunlight;

  const roverStatus =
    dustPct < 20
      ? { label: "All good! 🔋 Full power.", color: "text-status-talking" }
      : dustPct < 50
      ? { label: "Getting dusty… power dropping. 🟡", color: "text-status-traveling" }
      : dustPct < 75
      ? { label: "Storm overhead! Very little power. 🔴", color: "text-destructive" }
      : { label: "Critical! Batteries nearly empty. ☠️", color: "text-destructive" };

  return (
    <ExplainerCard
      id="dust-storms"
      icon={<Wind className="h-6 w-6" />}
      eyebrow="Explainer 1"
      title="Dust Storms vs Solar Panels"
      completed={completed}
    >
      <p className="text-lg text-muted-foreground">
        Mars gets gigantic{" "}
        <Term k="solar">dust storms</Term>. When dust covers the sky, sunlight can't reach solar panels. No sunlight means no electricity. That's what happened to <strong>Opportunity</strong> in 2018.
      </p>

      <div className="mt-6 space-y-4">
        <label className="block font-bold" htmlFor="dust-slider">
          Drag to add dust to the sky 🌪️
        </label>
        <Slider
          id="dust-slider"
          min={0}
          max={100}
          step={1}
          value={dust}
          onValueChange={setDust}
          className="w-full"
          aria-label="Amount of dust in the sky (0 = clear, 100 = total blackout)"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Clear sky</span>
          <span>Total dust blackout</span>
        </div>
      </div>

      {/* Visual simulation */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {/* Sky */}
        <div className="overflow-hidden rounded-2xl" aria-label={`Sky: ${dustPct}% dust`}>
          <div className="relative flex h-32 items-center justify-center transition-colors duration-300"
            style={{
              background: `linear-gradient(180deg,
                rgba(${Math.round(dustPct * 1.2)}, ${Math.round(dustPct * 0.8)}, 20, ${0.6 + dustPct * 0.004})
                0%, hsl(30 60% ${50 - dustPct * 0.3}%) 100%)`,
            }}
          >
            <span
              className="text-5xl transition-all duration-500"
              style={{ filter: `brightness(${1 - dustPct / 140})`, fontSize: `${3 - dustPct / 50}rem` }}
              aria-hidden
            >
              ☀️
            </span>
          </div>
          <p className="bg-muted px-3 py-1.5 text-center text-sm font-bold">
            Sky: {dustPct}% dust — {sunlight}% sunlight reaching panels
          </p>
        </div>

        {/* Power meter */}
        <div className="rounded-2xl border bg-background p-4">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">Rover power</p>
          <div className="h-4 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${power}%`,
                background: power > 50 ? "var(--color-status-talking)" : power > 25 ? "var(--color-status-traveling)" : "var(--color-destructive)",
              }}
              role="meter"
              aria-valuenow={power}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Rover battery level"
            />
          </div>
          <p className={cn("mt-3 font-display text-lg font-semibold", roverStatus.color)}>
            {roverStatus.label}
          </p>
          {dustPct >= 80 && (
            <p className="mt-2 rounded-xl bg-accent/15 px-3 py-2 text-sm text-accent font-bold">
              🏅 Dust Buster badge unlocked!
            </p>
          )}
        </div>
      </div>

      <p className="mt-4 rounded-2xl bg-muted px-4 py-3 text-sm">
        <strong>Real story:</strong> In June 2018, a planet-wide dust storm covered Mars. Opportunity's panels couldn't make power. After 1,000+ rescue attempts over 8 months, NASA said goodbye on February 13, 2019.
      </p>
    </ExplainerCard>
  );
}

// ─── 2: Radio Signal Travel ──────────────────────────────────────────────────
const DESTINATIONS = [
  { name: "Moon", distKm: 384_400, emoji: "🌕" },
  { name: "Mars (average)", distKm: 225_000_000, emoji: "🔴" },
  { name: "Voyager 1 (approx.)", distKm: 24_000_000_000, emoji: "🛸" },
];

function SignalExplainer() {
  const { awardBadge } = useProgress();
  const [choice, setChoice] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [visited, setVisited] = useState(new Set<number>());

  const dest = DESTINATIONS[choice];
  const lightSpeedKmS = 299_792;
  const totalSeconds = dest.distKm / lightSpeedKmS;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);

  const handleSelect = (i: number) => {
    setChoice(i);
    setAnimating(false);
    const next = new Set([...visited, i]);
    setVisited(next);
    if (next.size >= DESTINATIONS.length && !completed) {
      setCompleted(true);
      awardBadge("signal-detective");
    }
  };

  const startAnim = () => {
    setAnimating(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setAnimating(true)));
  };

  const animDuration =
    choice === 0 ? 1.5 : choice === 1 ? 3 : 6; // visual only

  return (
    <ExplainerCard
      id="radio-signal"
      icon={<Radio className="h-6 w-6" />}
      eyebrow="Explainer 2"
      title="How Long Does a Signal Take?"
      completed={completed}
    >
      <p className="text-lg text-muted-foreground">
        When we send a <Term k="radio">radio signal</Term> to a spacecraft, it travels at the <strong>speed of light</strong> — but space is so huge it can still take hours! Pick a destination to see how long.
      </p>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Choose a destination">
        {DESTINATIONS.map((d, i) => (
          <button
            key={d.name}
            type="button"
            onClick={() => handleSelect(i)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-bold transition-colors",
              i === choice
                ? "border-primary bg-primary/20 text-primary"
                : "border-border hover:border-primary hover:bg-primary/10"
            )}
            aria-pressed={i === choice}
          >
            {d.emoji} {d.name}
          </button>
        ))}
      </div>

      {/* Animation track */}
      <div className="relative mt-6 overflow-hidden rounded-2xl bg-muted p-4" aria-live="polite">
        <div className="flex items-center justify-between text-2xl">
          <span title="Earth" aria-label="Earth">🌍</span>
          <span title={dest.name} aria-label={dest.name}>{dest.emoji}</span>
        </div>
        <div className="relative mt-2 h-4 overflow-hidden rounded-full bg-background">
          {animating && (
            <span
              className="absolute top-0 h-full w-4 rounded-full bg-accent"
              style={{
                animation: `signal-travel ${animDuration}s linear forwards`,
              }}
              aria-hidden
            />
          )}
        </div>
        <button
          type="button"
          onClick={startAnim}
          className="mt-3 rounded-full border border-primary px-4 py-1.5 text-sm font-bold text-primary hover:bg-primary/10"
        >
          ▶ Send signal
        </button>
      </div>

      <div className="mt-4 rounded-2xl bg-primary/10 px-4 py-3 text-center">
        <p className="font-display text-2xl font-semibold">
          {minutes > 0 ? `${minutes} min ${seconds} sec` : `${seconds} seconds`}
        </p>
        <p className="text-sm text-muted-foreground">one way — the reply takes just as long again!</p>
      </div>

      {choice === 2 && (
        <p className="mt-4 rounded-2xl bg-muted px-4 py-3 text-sm">
          <strong>That means:</strong> when NASA sends a command to Voyager 1, they wait over 44 hours (there and back) for any response. Engineers have to be very patient!
        </p>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        ⚠ Voyager 1 distance is approximate (~24 billion km). Check{" "}
        <a href="https://voyager.jpl.nasa.gov/" target="_blank" rel="noreferrer" className="underline">voyager.jpl.nasa.gov</a> for the latest.
      </p>

      {/* Inline keyframes for the signal animation */}
      <style>{`
        @keyframes signal-travel {
          from { left: 0; }
          to { left: calc(100% - 1rem); }
        }
      `}</style>
    </ExplainerCard>
  );
}

// ─── 3: Why Footprints Last on the Moon ──────────────────────────────────────
function FootprintsExplainer() {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setRevealed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const reasons = [
    {
      id: "no-wind",
      emoji: "💨",
      question: "Is there wind on the Moon?",
      answer: "Almost none! The Moon has no atmosphere — no air at all. On Earth, wind slowly blows dust and fills in footprints. On the Moon there is no air to make wind, so nothing disturbs the dust.",
    },
    {
      id: "no-rain",
      emoji: "🌧️",
      question: "Does it rain on the Moon?",
      answer: "Never. Rain erodes footprints on Earth. The Moon has no water cycle, no clouds, and no rain. The footprints just sit there, perfectly preserved.",
    },
    {
      id: "no-life",
      emoji: "🌿",
      question: "Do plants or bugs disturb the Moon's surface?",
      answer: "No living things at all! On Earth, worms and roots push through soil, and bacteria break things down. The Moon is sterile — nothing grows or moves in the dust.",
    },
    {
      id: "micrometeorites",
      emoji: "☄️",
      question: "Will the footprints last forever?",
      answer: "Not quite forever. Very tiny space rocks called micrometeorites rain down constantly and very slowly 'sandblast' the surface. Scientists think the Apollo footprints may survive for millions of years before fading.",
    },
  ];

  return (
    <ExplainerCard
      id="footprints"
      icon={<Footprints className="h-6 w-6" />}
      eyebrow="Explainer 3"
      title="Why Do Footprints Last on the Moon?"
    >
      <p className="text-lg text-muted-foreground">
        Neil Armstrong's footprints from 1969 are probably still there today. On Earth, footprints on a beach last minutes. Why is the Moon so different? Tap each question to find out.
      </p>

      <div className="mt-6 space-y-3">
        {reasons.map((r) => (
          <div key={r.id} className="rounded-2xl border">
            <button
              type="button"
              id={`foot-btn-${r.id}`}
              aria-expanded={revealed.has(r.id)}
              aria-controls={`foot-panel-${r.id}`}
              onClick={() => toggle(r.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-bold hover:bg-muted/50"
            >
              <span>
                <span className="mr-2 text-xl" aria-hidden>{r.emoji}</span>
                {r.question}
              </span>
              <span className="shrink-0 text-xl" aria-hidden>{revealed.has(r.id) ? "▲" : "▼"}</span>
            </button>
            {revealed.has(r.id) && (
              <div
                id={`foot-panel-${r.id}`}
                role="region"
                aria-labelledby={`foot-btn-${r.id}`}
                className="border-t px-5 pb-4 pt-3 text-muted-foreground"
              >
                {r.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-muted p-4">
        <p className="font-bold">🧪 Try it at home</p>
        <p className="mt-1 text-muted-foreground">
          Press your finger into dry sand, then into wet sand. Which footprint lasts longer? The Moon's soil (called <Term k="regolith">regolith</Term>) is very dry and fine — and there's nothing to disturb it.
        </p>
      </div>
    </ExplainerCard>
  );
}

// ─── 4: Marsquakes from InSight ──────────────────────────────────────────────
function MarsquakeExplainer() {
  const [waveActive, setWaveActive] = useState(false);
  const waveRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerQuake = () => {
    setWaveActive(false);
    if (waveRef.current) clearTimeout(waveRef.current);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setWaveActive(true);
      waveRef.current = setTimeout(() => setWaveActive(false), 3000);
    }));
  };

  // Cleanup
  useEffect(() => () => { if (waveRef.current) clearTimeout(waveRef.current); }, []);

  const facts = [
    { emoji: "🔢", label: "Marsquakes detected", value: "1,319" },
    { emoji: "📏", label: "Largest quake (magnitude)", value: "~5.0" },
    { emoji: "📅", label: "Mission end", value: "Dec 21, 2022" },
    { emoji: "🌍", label: "Similar tool on Earth", value: "Seismometer" },
  ];

  return (
    <ExplainerCard
      id="marsquakes"
      icon={<Activity className="h-6 w-6" />}
      eyebrow="Explainer 4"
      title="Marsquakes — Listening to Mars Shake"
    >
      <p className="text-lg text-muted-foreground">
        NASA's <strong>InSight</strong> lander had a super-sensitive <Term k="seismometer">seismometer</Term> pressed against the Martian ground. When Mars shook, InSight felt it — just like you feel the ground shake in an earthquake. Scientists used those shakes to peek deep inside Mars.
      </p>

      {/* Interactive quake trigger */}
      <div className="mt-6 overflow-hidden rounded-2xl border bg-background">
        <div className="relative flex h-24 items-center bg-muted/30 px-4" aria-live="polite" aria-label="Seismograph display">
          {/* Ground line */}
          <div className="absolute inset-x-4 h-px bg-border" aria-hidden />
          {waveActive && (
            <div className="absolute inset-x-4 flex items-center" aria-hidden>
              {/* Animated wave SVG */}
              <svg className="h-20 w-full" viewBox="0 0 400 80" preserveAspectRatio="none">
                <polyline
                  points="0,40 30,40 50,10 70,70 90,20 110,60 130,30 150,50 170,40 200,40 400,40"
                  fill="none"
                  stroke="var(--color-primary)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  style={{ animation: "draw-wave 0.5s ease-out forwards" }}
                />
              </svg>
            </div>
          )}
          {!waveActive && (
            <div className="absolute inset-x-4 flex items-center" aria-hidden>
              <svg className="h-20 w-full" viewBox="0 0 400 80" preserveAspectRatio="none">
                <line x1="0" y1="40" x2="400" y2="40" stroke="var(--color-muted-foreground)" strokeWidth="1.5" strokeDasharray="4 4" />
              </svg>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between border-t px-4 py-3">
          <p className="text-sm text-muted-foreground">
            {waveActive ? "🌊 Marsquake detected!" : "Quiet… waiting for a quake"}
          </p>
          <button
            type="button"
            onClick={triggerQuake}
            className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90"
          >
            Trigger a quake!
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {facts.map((f) => (
          <div key={f.label} className="rounded-2xl bg-muted p-3 text-center">
            <p className="text-2xl" aria-hidden>{f.emoji}</p>
            <p className="mt-1 font-display text-xl font-semibold">{f.value}</p>
            <p className="text-xs text-muted-foreground">{f.label}</p>
          </div>
        ))}
      </div>

      <p className="mt-4 rounded-2xl bg-muted px-4 py-3 text-sm">
        <strong>How does shaking tell us what's inside?</strong>{" "}
        Seismic waves travel through a planet and change speed depending on what they pass through — rock, liquid, or metal. By measuring those changes, scientists could figure out the size of Mars's metal <Term k="core">core</Term>. Clever, right?
      </p>

      <p className="mt-3 text-xs text-muted-foreground">
        ⚠ Marsquake count (1,319) verified at mission end Dec 2022. Check{" "}
        <a href="https://science.nasa.gov/mission/insight/" target="_blank" rel="noreferrer" className="underline">science.nasa.gov/mission/insight</a> for any updated analysis.
      </p>

      <style>{`
        @keyframes draw-wave {
          from { stroke-dasharray: 0 1000; }
          to { stroke-dasharray: 1000 0; }
        }
      `}</style>
    </ExplainerCard>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
function SciencePage() {
  return (
    <div className="mx-auto max-w-4xl px-4">
      <PageHeader
        eyebrow="Science Corner"
        title="How Does It All Work?"
        intro="Four interactive activities to explain the real science behind NASA's missions."
      />

      {/* Jump links */}
      <nav aria-label="Jump to explainer" className="mb-10 flex flex-wrap justify-center gap-2 text-sm">
        {[
          { href: "#dust-storms", label: "🌪️ Dust Storms" },
          { href: "#radio-signal", label: "📡 Radio Signals" },
          { href: "#footprints", label: "👣 Footprints" },
          { href: "#marsquakes", label: "📳 Marsquakes" },
        ].map(({ href, label }) => (
          <a
            key={href}
            href={href}
            className="rounded-full border border-border px-4 py-1.5 font-bold hover:border-primary hover:bg-primary/10"
          >
            {label}
          </a>
        ))}
      </nav>

      <div className="space-y-8">
        <DustStormExplainer />
        <SignalExplainer />
        <FootprintsExplainer />
        <MarsquakeExplainer />
      </div>

      {/* Verify note */}
      <aside className="mt-10 rounded-2xl border bg-card px-5 py-4 text-sm text-muted-foreground">
        <p className="font-bold text-foreground">📋 Facts to re-verify before publishing</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Mars dust storm frequency and coverage (NASA Mars Climate Sounder data)</li>
          <li>Radio signal travel time to Voyager 1 — check voyager.jpl.nasa.gov for current distance</li>
          <li>Footprint lifespan estimates (check NASA Artemis science documentation)</li>
          <li>InSight marsquake count: 1,319 (verified at mission end Dec 21, 2022)</li>
          <li>Largest InSight marsquake magnitude ~5.0 (check published InSight papers)</li>
        </ul>
      </aside>
    </div>
  );
}
