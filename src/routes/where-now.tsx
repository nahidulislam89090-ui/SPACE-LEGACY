import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AlertCircle, Radio, Zap } from "lucide-react";
import { PageHeader, Term } from "@/components/space/bits";

export const Route = createFileRoute("/where-now")({
  head: () => ({
    meta: [
      { title: "Where Are They Now? — SPACE LEGACY" },
      { name: "description", content: "How far are Voyager 1, Voyager 2 and Pioneer 10 right now? Estimated live distances, signal travel times and simple analogies for ages 8–14." },
      { property: "og:title", content: "Where Are They Now? — SPACE LEGACY" },
      { property: "og:description", content: "Real-time estimated distances for humanity's most distant spacecraft." },
    ],
  }),
  component: WhereNow,
});

// ─── Reference data ─────────────────────────────────────────────────────────
// All distances in AU (Astronomical Units). 1 AU ≈ 149,597,870 km.
// Reference positions and speeds sourced from NASA JPL Horizons.
// ⚠ VERIFY: distances, speeds and dates against NASA JPL Horizons before publishing.
// Check https://voyager.jpl.nasa.gov/ for the latest live data.

const SPEED_OF_LIGHT_AU_PER_S = 0.002004; // AU per second  (≈ 299,792 km/s)

interface Probe {
  slug: string;
  name: string;
  status: "talking" | "silent";
  emoji: string;
  /** Distance (AU) on the reference date */
  refDistAU: number;
  /** Reference date as ISO string */
  refDate: string;
  /** Average speed in AU per day */
  speedAUperDay: number;
  description: string;
  analogy: string;
  source: { label: string; url: string };
  lastContact?: string;
  zone: "deep-space";
}

const PROBES: Probe[] = [
  {
    slug: "voyager-1",
    name: "Voyager 1",
    status: "talking",
    emoji: "🌌",
    // ~162 AU as of January 1 2024 (NASA Voyager status page)
    refDistAU: 162.0,
    refDate: "2024-01-01",
    // ~3.596 AU/year → /365.25
    speedAUperDay: 3.596 / 365.25,
    description:
      "Voyager 1 is the farthest human-made object ever. It crossed into interstellar space — the space between the stars — in 2012. It still sends radio signals back to Earth!",
    analogy:
      "If the Sun were a basketball in New York City, Voyager 1 would be past Tokyo. That is how far it has gone.",
    source: { label: "NASA Voyager Mission Status", url: "https://voyager.jpl.nasa.gov/" },
    zone: "deep-space",
  },
  {
    slug: "voyager-2",
    name: "Voyager 2",
    status: "talking",
    emoji: "🛸",
    // ~135 AU as of January 1 2024 (NASA Voyager status page)
    refDistAU: 135.0,
    refDate: "2024-01-01",
    // ~3.253 AU/year
    speedAUperDay: 3.253 / 365.25,
    description:
      "Voyager 2 is the only spacecraft ever to visit all four outer planets: Jupiter, Saturn, Uranus, and Neptune. It entered interstellar space in 2018 and still talks to us.",
    analogy:
      "If you could drive at highway speed (100 km/h) non-stop, you would need over 1,500 years just to reach where Voyager 2 is now.",
    source: { label: "NASA Voyager Mission Status", url: "https://voyager.jpl.nasa.gov/" },
    zone: "deep-space",
  },
  {
    slug: "pioneer-10",
    name: "Pioneer 10",
    status: "silent",
    emoji: "📡",
    // ~91 AU as of its last contact date (January 23, 2003), then continuing at ~2.561 AU/yr
    refDistAU: 80.0,
    refDate: "2003-01-23",
    speedAUperDay: 2.561 / 365.25,
    description:
      "Pioneer 10 was the first spacecraft to travel through the asteroid belt and visit Jupiter. Its nuclear battery ran out. It has been silent since January 2003 — but it's still flying.",
    analogy:
      "Pioneer 10 moves about 12 km every second. Even at that speed, it won't reach the next nearest star for more than 2 million years!",
    source: { label: "NASA Science: Pioneer 10", url: "https://science.nasa.gov/mission/pioneer-10/" },
    lastContact: "January 23, 2003",
    zone: "deep-space",
  },
];

// ─── Distance math ───────────────────────────────────────────────────────────

function calcDistance(probe: Probe): { au: number; km: number; lightMinutes: number } {
  const daysSinceRef =
    (Date.now() - new Date(probe.refDate).getTime()) / (1000 * 60 * 60 * 24);
  const au = probe.refDistAU + probe.speedAUperDay * daysSinceRef;
  const km = au * 149_597_870;
  // Signal travel time: distance / speed of light
  const lightSeconds = au / SPEED_OF_LIGHT_AU_PER_S;
  const lightMinutes = lightSeconds / 60;
  return { au, km, lightMinutes };
}

function fmtAU(au: number) {
  return au.toFixed(1);
}

function fmtKm(km: number) {
  if (km >= 1e9) return `${(km / 1e9).toFixed(1)} billion km`;
  return `${(km / 1e6).toFixed(0)} million km`;
}

function fmtSignal(minutes: number) {
  if (minutes < 60) return `${Math.round(minutes)} minutes`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h} hour${h !== 1 ? "s" : ""} ${m} minute${m !== 1 ? "s" : ""}`;
}

// ─── Component ───────────────────────────────────────────────────────────────

function ProbeCard({ probe }: { probe: Probe }) {
  const { au, km, lightMinutes } = useMemo(() => calcDistance(probe), [probe]);

  return (
    <article className="rounded-3xl border bg-card p-6 sm:p-8 animate-rise">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl" aria-hidden>{probe.emoji}</span>
          <div>
            <h2 className="font-display text-2xl font-semibold">{probe.name}</h2>
            {probe.status === "talking" ? (
              <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-status-talking/50 bg-status-talking/15 px-3 py-0.5 text-xs font-bold text-status-talking">
                <span className="h-2 w-2 animate-pulse rounded-full bg-current" aria-hidden /> Still talking
              </span>
            ) : (
              <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-status-traveling/50 bg-status-traveling/15 px-3 py-0.5 text-xs font-bold text-status-traveling">
                <span className="h-2 w-2 rounded-full bg-current" aria-hidden /> Silent but traveling
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="mt-4 text-lg text-muted-foreground">{probe.description}</p>

      {/* Distance numbers */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Distance from Earth (approx.)" value={`${fmtAU(au)} AU`} sub={fmtKm(km)} />
        <Stat
          label={<><Term k="radio">Signal</Term> travel time</>}
          value={fmtSignal(lightMinutes)}
          sub="one way, at the speed of light"
        />
        <Stat
          label="Speed (approx.)"
          value={`${((probe.speedAUperDay * 149_597_870) / 86400).toFixed(0)} km/s`}
          sub="kilometres per second"
        />
      </div>

      {/* Visual signal bar */}
      <SignalBar minutes={lightMinutes} />

      {probe.lastContact && (
        <p className="mt-4 text-sm text-muted-foreground">
          Last heard from: <strong>{probe.lastContact}</strong>
        </p>
      )}

      <p className="mt-4 rounded-2xl bg-muted px-4 py-3 text-base">
        <strong>Think about it: </strong>{probe.analogy}
      </p>

      <p className="mt-4 text-sm text-muted-foreground">
        Source:{" "}
        <a href={probe.source.url} target="_blank" rel="noreferrer" className="underline hover:text-foreground">
          {probe.source.label}
        </a>
      </p>
    </article>
  );
}

function Stat({
  label,
  value,
  sub,
}: {
  label: React.ReactNode;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl bg-muted p-4">
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-foreground">{value}</p>
      <p className="mt-0.5 text-sm text-muted-foreground">{sub}</p>
    </div>
  );
}

function SignalBar({ minutes }: { minutes: number }) {
  // Show a coloured bar representing signal delay relative to max (Pioneer ≈ 15 hrs)
  const maxMin = 15 * 60;
  const pct = Math.min((minutes / maxMin) * 100, 100);
  return (
    <div className="mt-4" aria-hidden>
      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Signal delay (one way)</p>
      <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent to-primary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function WhereNow() {
  return (
    <div className="mx-auto max-w-4xl px-4">
      <PageHeader
        eyebrow="Live estimates"
        title="Where Are They Now?"
        intro="Voyager 1, Voyager 2 and Pioneer 10 are flying away from Earth right now. Here is how far we think they are today."
      />

      {/* Accuracy note */}
      <aside className="mb-10 flex gap-3 rounded-2xl border border-accent/40 bg-accent/10 p-4 text-sm text-foreground">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
        <div>
          <p className="font-bold">About these numbers</p>
          <p className="mt-1 text-muted-foreground">
            Distances are <em>estimated</em> from a dated reference position plus average speed — they are close but not exact.
            For the very latest data, visit <a href="https://voyager.jpl.nasa.gov/" target="_blank" rel="noreferrer" className="underline">NASA JPL Voyager Status</a>.
            {" "}Speeds and distances should be re-verified against NASA JPL Horizons before each publication.
            Pioneer 11 is not shown because its last reliable position data is harder to find — check NASA for any updates.
          </p>
        </div>
      </aside>

      {/* What is an AU? */}
      <div className="mb-10 flex gap-3 rounded-2xl bg-muted p-4 text-sm">
        <Radio className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
        <p>
          <strong>What is an AU?</strong>{" "}
          An <abbr title="Astronomical Unit">AU</abbr> (Astronomical Unit) is the distance from the Earth to the Sun — about 150 million kilometres. Astronomers use AU instead of millions of kilometres to keep the numbers manageable.
        </p>
      </div>

      <div className="space-y-8">
        {PROBES.map((p) => (
          <ProbeCard key={p.slug} probe={p} />
        ))}
      </div>

      {/* Pioneer 11 note */}
      <aside className="mt-10 flex gap-3 rounded-2xl border bg-card p-5 text-sm">
        <Zap className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
        <div>
          <p className="font-bold">What about Pioneer 11?</p>
          <p className="mt-1 text-muted-foreground">
            Pioneer 11 stopped sending data in November 1995. Like Pioneer 10 it is still coasting through space, heading toward the constellation Aquila.
            Its exact position is uncertain — always{" "}
            <a href="https://science.nasa.gov/mission/pioneer-11/" target="_blank" rel="noreferrer" className="underline">check NASA</a> for the latest.
          </p>
        </div>
      </aside>

      {/* Facts to re-verify */}
      <aside className="mt-8 rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
        <p className="font-bold text-foreground">📋 Facts to re-verify before publishing</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Voyager 1 and 2 distances and speeds — <a href="https://voyager.jpl.nasa.gov/" target="_blank" rel="noreferrer" className="underline">voyager.jpl.nasa.gov</a></li>
          <li>Pioneer 10 estimated distance (last signal Jan 2003; continuing at ~2.56 AU/yr)</li>
          <li>Confirm Pioneer 11 last-contact date (November 1995)</li>
          <li>Verify 1 AU = 149,597,870 km for current IAU value</li>
          <li>Speed of light: 299,792.458 km/s (exact by definition)</li>
        </ul>
      </aside>
    </div>
  );
}
