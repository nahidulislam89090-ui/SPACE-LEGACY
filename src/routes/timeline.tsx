import { createFileRoute, Link } from "@tanstack/react-router";
import { hardware } from "@/content/hardware";
import { PageHeader } from "@/components/space/bits";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/timeline")({
  head: () => ({
    meta: [
      { title: "Timeline 1967 to today — SPACE LEGACY" },
      { name: "description", content: "Launches, landings and last messages of NASA's machines, from the 1960s to today." },
      { property: "og:title", content: "Timeline — SPACE LEGACY" },
      { property: "og:description", content: "Scroll through 60 years of NASA launches, landings and farewells." },
    ],
  }),
  component: TimelinePage,
});

const kindStyle = { launch: "bg-accent", landing: "bg-primary", end: "bg-status-resting", milestone: "bg-status-talking" } as const;
const kindLabel = { launch: "Launch", landing: "Landing", end: "Last message", milestone: "Big moment" } as const;

function TimelinePage() {
  const events = hardware
    .flatMap((h) => h.events.map((e) => ({ ...e, slug: h.slug, name: h.name })))
    .sort((a, b) => a.date.localeCompare(b.date));
  const byDecade = events.reduce<Record<string, typeof events>>((acc, e) => {
    const d = `${e.date.slice(0, 3)}0s`;
    (acc[d] ||= []).push(e);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-3xl px-4">
      <PageHeader eyebrow="Through the years" title="Timeline" intro="From the first robot on the Moon to a helicopter on Mars." />
      <ul className="mb-10 flex flex-wrap justify-center gap-4 text-sm" aria-label="Key">
        {(Object.keys(kindLabel) as (keyof typeof kindLabel)[]).map((k) => (
          <li key={k} className="flex items-center gap-2"><span className={cn("h-3 w-3 rounded-full", kindStyle[k])} />{kindLabel[k]}</li>
        ))}
      </ul>
      {Object.entries(byDecade).map(([decade, list]) => (
        <section key={decade} className="mb-10">
          <h2 className="sticky top-16 z-10 bg-background/90 py-2 font-display text-3xl font-semibold text-accent backdrop-blur">{decade}</h2>
          <ol className="relative ml-3 border-l-2 border-border">
            {list.map((e, i) => (
              <li key={i} className="relative pb-6 pl-8">
                <span className={cn("absolute -left-[9px] top-1.5 h-4 w-4 rounded-full ring-4 ring-background", kindStyle[e.kind])} aria-hidden />
                <time dateTime={e.date} className="text-sm font-bold text-muted-foreground">
                  {new Date(e.date + "T12:00:00Z").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })}
                </time>
                <p className="text-lg font-bold">{e.label}</p>
                <Link to="/hardware/$slug" params={{ slug: e.slug }} className="text-sm text-primary underline">Meet {e.name.split("(")[0].trim()}</Link>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
