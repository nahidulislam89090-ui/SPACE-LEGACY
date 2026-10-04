import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero.jpg";
import { hardware, zoneLabels, type Zone } from "@/content/hardware";
import { StatusBadge } from "@/components/space/bits";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SPACE LEGACY — Abandoned but Not Forgotten" },
      { name: "description", content: "Meet the NASA machines left on the Moon, on Mars and in deep space, and the science they made possible. For explorers aged 8–14." },
      { property: "og:title", content: "SPACE LEGACY — Abandoned but Not Forgotten" },
      { property: "og:description", content: "An interactive storybook museum of NASA hardware left across the solar system." },
    ],
  }),
  component: Home,
});

const zoneBlurb: Record<Zone, string> = {
  moon: "Landers, moon buggies and mirrors from the 1960s and 70s.",
  mars: "Brave rovers, a listening lander and a tiny helicopter.",
  deep: "Probes still flying between the stars.",
};

function Home() {
  const featured = ["opportunity", "voyager-1", "apollo-11-eagle"].map((s) => hardware.find((h) => h.slug === s)!);
  return (
    <>
      <section className="relative isolate -mt-px flex min-h-[88vh] items-end overflow-hidden">
        <img src={hero} alt="Painting of an old Moon lander with footprints, Earth and Mars in a starry sky" width={1920} height={1088} className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="hero-overlay absolute inset-0 -z-10" />
        <div className="mx-auto w-full max-w-6xl px-4 pb-20 animate-rise">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-accent">Abandoned but not forgotten</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-bold leading-[1.05] sm:text-7xl">
            SPACE <span className="text-primary">LEGACY</span>
          </h1>
          <p className="mt-5 max-w-xl text-xl text-foreground/90">
            The solar system is a giant museum with no roof. Come meet the machines we left behind, and hear their stories.
          </p>
          <Button asChild size="lg" className="glow mt-8 h-14 rounded-full px-8 text-lg font-bold">
            <Link to="/map">Start exploring <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-semibold">Three halls in the museum</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {(Object.keys(zoneLabels) as Zone[]).map((z) => (
            <Link key={z} to="/map" hash={z} className="group rounded-3xl border bg-card p-6 transition-transform hover:-translate-y-1">
              <p className={`font-display text-2xl font-semibold ${z === "moon" ? "text-zone-moon" : z === "mars" ? "text-zone-mars" : "text-zone-deep"}`}>{zoneLabels[z]}</p>
              <p className="mt-2 text-muted-foreground">{zoneBlurb[z]}</p>
              <p className="mt-4 text-sm font-bold">{hardware.filter((h) => h.zone === z).length} machines <ArrowRight className="inline h-4 w-4 transition-transform group-hover:translate-x-1" /></p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <h2 className="text-3xl font-semibold">Letters from space</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {featured.map((h) => (
            <Link key={h.slug} to="/hardware/$slug" params={{ slug: h.slug }} className="overflow-hidden rounded-3xl border bg-card transition-transform hover:-translate-y-1">
              <img src={h.image} alt={h.imageAlt} loading="lazy" width={1200} height={800} className="aspect-[3/2] w-full object-cover" />
              <div className="p-5">
                <StatusBadge status={h.status} />
                <p className="mt-3 font-display text-xl font-semibold">{h.name}</p>
                <p className="mt-2 line-clamp-3 italic text-muted-foreground">“{h.letter}”</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
