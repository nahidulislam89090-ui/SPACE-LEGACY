import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/space/bits";

export const Route = createFileRoute("/credits")({
  head: () => ({
    meta: [
      { title: "Sources & Credits — SPACE LEGACY" },
      { name: "description", content: "NASA sources, image credits, and licenses for the Space Legacy museum." },
      { property: "og:title", content: "Sources & Credits — SPACE LEGACY" },
    ],
  }),
  component: CreditsPage,
});

// ─── Data ─────────────────────────────────────────────────────────────────────

const MISSION_SOURCES = [
  { name: "Apollo 11 — Lunar Module Eagle", url: "https://www.nasa.gov/mission/apollo-11/", org: "NASA" },
  { name: "Lunar Roving Vehicle (Apollo 15)", url: "https://www.nasa.gov/history/45-years-ago-apollo-15-astronauts-explore-the-moon-with-a-lunar-rover/", org: "NASA History Division" },
  { name: "Apollo Laser Retroreflectors", url: "https://science.nasa.gov/moon/", org: "NASA Science" },
  { name: "Surveyor 3", url: "https://science.nasa.gov/mission/surveyor-3/", org: "NASA Science" },
  { name: "Sojourner / Mars Pathfinder", url: "https://science.nasa.gov/mission/mars-pathfinder/", org: "NASA Science" },
  { name: "Spirit Rover (MER-A)", url: "https://science.nasa.gov/mission/mer-spirit/", org: "NASA Science" },
  { name: "Opportunity Rover (MER-B)", url: "https://science.nasa.gov/mission/mer-opportunity/", org: "NASA Science" },
  { name: "InSight Lander", url: "https://science.nasa.gov/mission/insight/", org: "NASA Science" },
  { name: "Ingenuity Mars Helicopter", url: "https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/", org: "NASA Science" },
  { name: "Voyager 1 & 2", url: "https://science.nasa.gov/mission/voyager/", org: "NASA JPL" },
  { name: "Voyager live status", url: "https://voyager.jpl.nasa.gov/", org: "NASA JPL" },
  { name: "Pioneer 10", url: "https://science.nasa.gov/mission/pioneer-10/", org: "NASA Science" },
  { name: "Pioneer 11", url: "https://science.nasa.gov/mission/pioneer-11/", org: "NASA Science" },
];

const SCIENCE_SOURCES = [
  { name: "Mars dust storms — overview", url: "https://science.nasa.gov/mars/weather/", org: "NASA Science / Mars" },
  { name: "InSight seismometer results", url: "https://science.nasa.gov/mission/insight/", org: "NASA Science" },
  { name: "Apollo retroreflector ranging", url: "https://science.nasa.gov/moon/", org: "NASA Science" },
  { name: "Voyager distance estimator", url: "https://voyager.jpl.nasa.gov/", org: "NASA JPL" },
];

const IMAGE_CREDITS = [
  {
    image: "Hero image (home page)",
    credit: "AI-generated illustration (Google Gemini) — not a NASA image",
    license: "Project-specific illustration",
  },
  {
    image: "Apollo Lunar Module illustration",
    credit: "AI-generated illustration — not a NASA image",
    license: "Project-specific illustration",
  },
  {
    image: "Lunar Rover illustration",
    credit: "AI-generated illustration — not a NASA image",
    license: "Project-specific illustration",
  },
  {
    image: "Mars rover illustration (Sojourner, Spirit, Opportunity)",
    credit: "AI-generated illustration — not a NASA image",
    license: "Project-specific illustration",
  },
  {
    image: "InSight lander illustration",
    credit: "AI-generated illustration — not a NASA image",
    license: "Project-specific illustration",
  },
  {
    image: "Ingenuity helicopter illustration",
    credit: "AI-generated illustration — not a NASA image",
    license: "Project-specific illustration",
  },
  {
    image: "Voyager probe illustration",
    credit: "AI-generated illustration — not a NASA image",
    license: "Project-specific illustration",
  },
  {
    image: "Pioneer 10 illustration",
    credit: "AI-generated illustration — not a NASA image",
    license: "Project-specific illustration",
  },
];

const NEW_CREDITS_V2 = [
  {
    page: "/where-now",
    source: "Voyager 1 & 2 distances and speeds",
    url: "https://voyager.jpl.nasa.gov/",
    note: "Reference positions approx. from Jan 1 2024; verify regularly.",
  },
  {
    page: "/where-now",
    source: "Pioneer 10 last-signal date and approximate speed",
    url: "https://science.nasa.gov/mission/pioneer-10/",
    note: "Last contact Jan 23 2003; speed ~2.56 AU/yr approx.",
  },
  {
    page: "/science",
    source: "InSight seismometer — 1,319 marsquakes detected",
    url: "https://science.nasa.gov/mission/insight/",
    note: "Count verified at mission end Dec 21 2022.",
  },
  {
    page: "/science",
    source: "Mars dust storms and solar panel effects",
    url: "https://science.nasa.gov/mars/weather/",
    note: "General information; verify against latest Mars climate reports.",
  },
  {
    page: "/science",
    source: "Moon surface conditions — no atmosphere, no wind",
    url: "https://science.nasa.gov/moon/",
    note: "Standard planetary science; widely verified.",
  },
];

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-primary underline hover:text-primary/80"
    >
      {children} <ExternalLink className="h-3 w-3" aria-hidden />
    </a>
  );
}

function Section({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="scroll-mt-20 rounded-3xl border bg-card p-6 sm:p-8" aria-labelledby={id ? `${id}-title` : undefined}>
      <h2 id={id ? `${id}-title` : undefined} className="font-display text-2xl font-semibold">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function CreditsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4">
      <PageHeader
        eyebrow="Transparency"
        title="Sources & Credits"
        intro="Every fact in Space Legacy comes from a named NASA source. This page lists them all."
      />

      {/* Jump nav */}
      <nav aria-label="Jump to section" className="mb-8 flex flex-wrap gap-2 text-sm">
        {[
          { href: "#missions", label: "Mission sources" },
          { href: "#science-sources", label: "Science sources" },
          { href: "#images", label: "Image credits" },
          { href: "#new-v2", label: "New in v2" },
          { href: "#licenses", label: "Licenses" },
        ].map(({ href, label }) => (
          <a key={href} href={href} className="rounded-full border px-4 py-1.5 text-sm font-bold hover:border-primary hover:bg-primary/10">
            {label}
          </a>
        ))}
      </nav>

      <div className="space-y-8">
        {/* Mission sources */}
        <Section id="missions" title="Mission Fact Sources">
          <p className="mb-4 text-sm text-muted-foreground">
            All mission facts are drawn directly from NASA's public science and history pages, which are the primary sources. These were checked at the time of writing; always verify current mission status at the source.
          </p>
          <ul className="space-y-2">
            {MISSION_SOURCES.map((s) => (
              <li key={s.url} className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm">
                <span className="font-bold">{s.name}</span>
                <span className="text-muted-foreground">—</span>
                <ExtLink href={s.url}>{s.org}</ExtLink>
              </li>
            ))}
          </ul>
        </Section>

        {/* Science sources */}
        <Section id="science-sources" title="Science Corner Sources">
          <ul className="space-y-2">
            {SCIENCE_SOURCES.map((s) => (
              <li key={s.url} className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm">
                <span className="font-bold">{s.name}</span>
                <span className="text-muted-foreground">—</span>
                <ExtLink href={s.url}>{s.org}</ExtLink>
              </li>
            ))}
          </ul>
        </Section>

        {/* Image credits */}
        <Section id="images" title="Image Credits">
          <p className="mb-4 text-sm text-muted-foreground">
            All spacecraft images in this project are <strong>AI-generated illustrations</strong> created for this project and are not official NASA photographs. They are used to evoke the spirit of each mission for a young audience.
            We strongly encourage educators and students to also view the actual NASA photographs linked from each mission's source page above.
          </p>
          <ul className="space-y-3">
            {IMAGE_CREDITS.map((c) => (
              <li key={c.image} className="rounded-xl border bg-background p-4 text-sm">
                <p className="font-bold">{c.image}</p>
                <p className="text-muted-foreground">{c.credit}</p>
                <p className="mt-0.5 text-xs text-muted-foreground/70">License: {c.license}</p>
              </li>
            ))}
          </ul>
        </Section>

        {/* New in v2 */}
        <Section id="new-v2" title="New Sources Added in This Build (v2)">
          <p className="mb-4 text-sm text-muted-foreground">
            These sources were added for the /where-now and /science pages. Fact-checking dates are noted.
          </p>
          <ul className="space-y-3">
            {NEW_CREDITS_V2.map((c) => (
              <li key={c.source} className="rounded-xl border bg-background p-4 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-bold">{c.source}</p>
                    <p className="text-muted-foreground">{c.note}</p>
                  </div>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-bold">{c.page}</span>
                </div>
                <div className="mt-1">
                  <ExtLink href={c.url}>{c.url}</ExtLink>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        {/* Licenses */}
        <Section id="licenses" title="Licenses & Permissions">
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">NASA content:</strong> NASA images, text and data are generally in the public domain and freely usable with attribution, per the{" "}
              <ExtLink href="https://www.nasa.gov/nasa-brand-center/images-and-media/">NASA media use guidelines</ExtLink>.
            </p>
            <p>
              <strong className="text-foreground">Project content:</strong> Text written for this project (letters, descriptions, quiz questions) is original work created for the NASA Space Apps Challenge 2024 and is made available under{" "}
              <ExtLink href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</ExtLink>.
            </p>
            <p>
              <strong className="text-foreground">Fonts:</strong>{" "}
              <ExtLink href="https://fonts.google.com/specimen/Fredoka">Fredoka</ExtLink> (display) and{" "}
              <ExtLink href="https://fonts.google.com/specimen/Atkinson+Hyperlegible">Atkinson Hyperlegible</ExtLink> (body) served via Google Fonts under{" "}
              <ExtLink href="https://scripts.sil.org/OFL">SIL Open Font License</ExtLink>.
            </p>
            <p>
              <strong className="text-foreground">Disclaimer:</strong> This is a fan project made for an educational competition. It is not an official NASA website. While we aim for accuracy, always verify facts at the primary NASA sources listed above before using them in teaching or research.
            </p>
          </div>
        </Section>
      </div>
    </div>
  );
}
