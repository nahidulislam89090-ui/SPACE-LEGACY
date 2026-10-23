import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { hardware, statusLabels, zoneLabels, type Hardware, type Status, type Zone } from "@/content/hardware";
import { PageHeader, StatusBadge } from "@/components/space/bits";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Solar System Map — SPACE LEGACY" },
      { name: "description", content: "Explore the Moon, Mars and deep space. Tap a glowing spot to meet a NASA machine." },
      { property: "og:title", content: "Solar System Map — SPACE LEGACY" },
      { property: "og:description", content: "Find every NASA machine left on the Moon, Mars and in deep space." },
    ],
  }),
  component: MapPage,
});

const zoneStyle: Record<Zone, string> = {
  moon: "bg-[radial-gradient(circle_at_30%_30%,var(--zone-moon),transparent_70%)]",
  mars: "bg-[radial-gradient(circle_at_30%_30%,var(--zone-mars),transparent_70%)]",
  deep: "bg-[radial-gradient(circle_at_70%_40%,var(--zone-deep),transparent_70%)]",
};

const dot: Record<Status, string> = {
  talking: "bg-status-talking", traveling: "bg-status-traveling", resting: "bg-status-resting", complete: "bg-status-complete",
};

function MapPage() {
  const [selected, setSelected] = useState<Hardware | null>(null);

  return (
    <div className="mx-auto max-w-6xl px-4">
      <PageHeader eyebrow="The museum with no roof" title="Solar System Map" intro="Each glowing spot is a real machine. Tap one to read its story." />
      <ul className="mb-8 flex flex-wrap justify-center gap-2" aria-label="Status key">
        {(Object.keys(statusLabels) as Status[]).map((s) => <li key={s}><StatusBadge status={s} /></li>)}
      </ul>
      <div className="space-y-10">
        {(Object.keys(zoneLabels) as Zone[]).map((z) => {
          const items = hardware.filter((h) => h.zone === z);
          return (
            <section key={z} id={z} aria-labelledby={`${z}-h`} className="scroll-mt-24">
              <h2 id={`${z}-h`} className="mb-4 text-3xl font-semibold">{zoneLabels[z]}</h2>
              <div className="relative aspect-[16/10] sm:aspect-[16/7] min-h-64 overflow-hidden rounded-3xl border bg-card">
                <div className={cn("absolute -left-16 -top-16 h-[130%] w-[70%] rounded-full opacity-40", zoneStyle[z])} aria-hidden />
                {items.map((h) => (
                  <Link key={h.slug} to="/hardware/$slug" params={{ slug: h.slug }}
                    className="map-hotspot group absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${h.map.x}%`, top: `${h.map.y}%` }}
                    aria-label={`${h.name}: ${statusLabels[h.status]}`}
                    onClick={(e) => {
                      /* On mobile, show bottom sheet instead of navigating */
                      if (window.innerWidth < 640) {
                        e.preventDefault();
                        setSelected(h);
                      }
                    }}>
                    <span className={cn("block h-6 w-6 rounded-full ring-4 ring-background animate-ping-ring sm:h-6 sm:w-6", dot[h.status])} />
                    <span className="pointer-events-none absolute left-1/2 top-8 hidden w-44 -translate-x-1/2 rounded-xl border bg-popover p-2 text-center text-sm font-bold shadow-lg group-hover:block group-focus-visible:block sm:bg-popover/90">
                      {h.name.split("(")[0]}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Mobile bottom sheet */}
      {selected && (
        <>
          <div className="map-label-backdrop sm:hidden" onClick={() => setSelected(null)} aria-hidden />
          <div className="map-label-mobile sm:hidden" role="dialog" aria-label={selected.name}>
            <div className="mb-1 flex items-center justify-between">
              <StatusBadge status={selected.status} />
              <button type="button" onClick={() => setSelected(null)} className="rounded-full p-2 text-muted-foreground hover:bg-muted" aria-label="Close">✕</button>
            </div>
            <p className="font-display text-xl font-semibold">{selected.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{selected.location}</p>
            <Link
              to="/hardware/$slug"
              params={{ slug: selected.slug }}
              className="mt-4 flex min-h-[44px] w-full items-center justify-center rounded-xl bg-primary px-4 py-3 font-bold text-primary-foreground hover:bg-primary/90"
            >
              Read its story →
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
