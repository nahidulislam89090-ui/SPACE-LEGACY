import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, Mail, Rocket, MapPin, Lightbulb } from "lucide-react";
import { getHardware, hardware, zoneLabels } from "@/content/hardware";
import { ReadAloud, Rich, StatusBadge } from "@/components/space/bits";
import { Quiz } from "@/components/space/Quiz";

export const Route = createFileRoute("/hardware/$slug")({
  loader: ({ params }) => {
    const item = getHardware(params.slug);
    if (!item) throw notFound();
    return { slug: item.slug };
  },
  head: ({ loaderData }) => {
    const item = loaderData ? getHardware(loaderData.slug) : undefined;
    if (!item) return { meta: [{ title: "Not found — SPACE LEGACY" }, { name: "robots", content: "noindex" }] };
    const desc = `${item.name}: its mission, discoveries, ending and why it still matters.`;
    return {
      meta: [
        { title: `${item.name} — SPACE LEGACY` },
        { name: "description", content: desc },
        { property: "og:title", content: `${item.name} — SPACE LEGACY` },
        { property: "og:description", content: desc },
      ],
    };
  },
  notFoundComponent: MissingMachine,
  component: Profile,
});

function MissingMachine() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-3xl font-semibold">We couldn't find that machine</h1>
      <Link to="/map" className="mt-6 inline-block font-bold text-primary underline">Back to the map</Link>
    </div>
  );
}

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border bg-card p-6 sm:p-8">
      <h2 className="flex items-center gap-3 text-2xl font-semibold">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-base text-primary-foreground" aria-hidden>{n}</span>
        {title}
      </h2>
      <div className="mt-4 text-lg">{children}</div>
    </section>
  );
}

function Profile() {
  const { slug } = Route.useLoaderData();
  const item = getHardware(slug)!;
  const idx = hardware.findIndex((h) => h.slug === slug);
  const next = hardware[(idx + 1) % hardware.length];

  return (
    <article className="mx-auto max-w-4xl px-4 py-10">
      <Link to="/map" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to the map</Link>

      <div className="mt-6 overflow-hidden rounded-3xl border bg-card animate-rise">
        <img src={item.image} alt={item.imageAlt} width={1200} height={800} className="aspect-[2/1] w-full object-cover" />
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={item.status} />
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold">{zoneLabels[item.zone]}</span>
          </div>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">{item.name}</h1>
          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="flex gap-2"><Rocket className="mt-1 h-5 w-5 text-primary" aria-hidden /><div><dt className="text-sm text-muted-foreground">Launched</dt><dd className="font-bold">{item.launch}</dd></div></div>
            <div className="flex gap-2"><MapPin className="mt-1 h-5 w-5 text-primary" aria-hidden /><div><dt className="text-sm text-muted-foreground">Where it is</dt><dd className="font-bold">{item.location}</dd></div></div>
          </dl>
        </div>
      </div>

      <aside className="mt-8 rounded-3xl bg-letter p-6 text-letter-foreground sm:p-8" aria-label={`Letter from ${item.name}`}>
        <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest"><Mail className="h-4 w-4" /> A letter from the machine</p>
        <p className="mt-3 font-display text-2xl leading-snug">“{item.letter}”</p>
        <p className="mt-3 text-sm opacity-80">This letter is make-believe, told in the machine's voice. The facts below are real.</p>
        <div className="mt-4"><ReadAloud text={item.letter} /></div>
      </aside>

      <div className="mt-8 space-y-6">
        <Section n={1} title="Its mission"><p><Rich text={item.mission} /></p></Section>
        <Section n={2} title="Its big discoveries">
          <ul className="space-y-3">{item.discoveries.map((d, i) => <li key={i} className="flex gap-3"><span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden /><span><Rich text={d} /></span></li>)}</ul>
        </Section>
        <Section n={3} title="Its ending"><p><Rich text={item.ending} /></p></Section>
        <Section n={4} title="Why it matters today"><p><Rich text={item.mattersToday} /></p></Section>

        <section className="rounded-3xl border-2 border-dashed border-accent p-6 sm:p-8">
          <p className="text-sm font-bold uppercase tracking-widest text-accent">Legacy card</p>
          <p className="mt-2 font-display text-xl"><Rich text={item.legacy} /></p>
        </section>

        <Section n={5} title="Quick activity">
          <p className="flex gap-3 rounded-2xl bg-muted p-4"><Lightbulb className="h-6 w-6 shrink-0 text-accent" aria-hidden /><span><strong>Think about it:</strong> {item.thinkAbout}</span></p>
          <h3 className="mb-4 mt-6 text-xl font-semibold">Mini quiz</h3>
          <Quiz item={item} />
        </Section>

        <p className="text-sm text-muted-foreground">
          Fact source: <a href={item.source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline">{item.source.label} <ExternalLink className="h-3 w-3" /></a>
        </p>

        <Link to="/hardware/$slug" params={{ slug: next.slug }} className="block rounded-3xl border bg-card p-6 text-right hover:border-primary">
          <span className="text-sm text-muted-foreground">Next machine</span>
          <span className="block font-display text-2xl font-semibold">{next.name} →</span>
        </Link>
      </div>
    </article>
  );
}
