import { createFileRoute } from "@tanstack/react-router";
import { Printer, BookOpen, ClipboardList, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/space/bits";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/teachers")({
  head: () => ({
    meta: [
      { title: "Teacher Resources — SPACE LEGACY" },
      { name: "description", content: "Free printable lesson plan, discussion questions, and student worksheets for Space Legacy — the NASA mission storybook for ages 8–14." },
      { property: "og:title", content: "Teacher Resources — SPACE LEGACY" },
      { property: "og:description", content: "Printable lesson plan and worksheets for classroom use. Designed for ages 8–14." },
    ],
  }),
  component: TeachersPage,
});

// ─── Accordion helper ─────────────────────────────────────────────────────────
function Accordion({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border">
      <button
        type="button"
        id={`acc-btn-${id}`}
        aria-expanded={open}
        aria-controls={`acc-panel-${id}`}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left font-bold hover:bg-muted/50"
      >
        {title}
        <ChevronDown className={cn("h-5 w-5 shrink-0 transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      {open && (
        <div
          id={`acc-panel-${id}`}
          role="region"
          aria-labelledby={`acc-btn-${id}`}
          className="border-t px-5 pb-5 pt-4 text-muted-foreground"
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Print-optimized lesson plan ─────────────────────────────────────────────
function LessonPlan() {
  return (
    <div id="lesson-plan" className="print-target space-y-6 rounded-3xl border bg-card p-6 sm:p-10">
      {/* Header */}
      <div className="border-b pb-5">
        <p className="text-xs font-bold uppercase tracking-widest text-accent">SPACE LEGACY · Teacher Resources</p>
        <h2 className="mt-2 font-display text-3xl font-semibold">Lesson Plan: Abandoned but Not Forgotten</h2>
        <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
          <div><dt className="font-bold">Age range</dt><dd className="text-muted-foreground">8–14 years old</dd></div>
          <div><dt className="font-bold">Time</dt><dd className="text-muted-foreground">60–90 minutes (or split)</dd></div>
          <div><dt className="font-bold">Subject areas</dt><dd className="text-muted-foreground">Science, History, English</dd></div>
        </dl>
      </div>

      {/* Learning objectives */}
      <section aria-labelledby="lo-title">
        <h3 id="lo-title" className="font-display text-xl font-semibold">Learning Objectives</h3>
        <p className="mt-1 text-sm text-muted-foreground">By the end of this lesson, students will be able to:</p>
        <ol className="mt-3 list-decimal pl-5 space-y-2 text-sm">
          <li>Name at least three NASA spacecraft left on the Moon, Mars, or in deep space.</li>
          <li>Explain what each spacecraft was designed to do (its mission).</li>
          <li>Describe at least one discovery made by each mission they studied.</li>
          <li>Use vocabulary such as: rover, lander, orbit, solar panel, seismometer, interstellar.</li>
          <li>Discuss why preserving mission history matters for future exploration.</li>
        </ol>
      </section>

      {/* Materials */}
      <section aria-labelledby="materials-title">
        <h3 id="materials-title" className="font-display text-xl font-semibold">Materials Needed</h3>
        <ul className="mt-3 list-disc pl-5 space-y-1 text-sm">
          <li>Device with internet access (one per student or pair) — or projector for group viewing</li>
          <li>This printable lesson plan (print from the browser: File → Print)</li>
          <li>Student worksheets (see below)</li>
          <li>Pencils and/or coloured markers for sketching</li>
          <li>Optional: index cards for "Machine Profile" activity</li>
        </ul>
      </section>

      {/* Curriculum links */}
      <section aria-labelledby="curriculum-title">
        <h3 id="curriculum-title" className="font-display text-xl font-semibold">Curriculum Links</h3>
        <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
          {[
            { subject: "Science", points: ["Space and the solar system", "Forces and energy (solar panels)", "Earth and beyond"] },
            { subject: "English / ELA", points: ["Reading for information", "Writing: persuasive (why save old spacecraft?)", "Listening & speaking"] },
            { subject: "History / Social Studies", points: ["Timeline of human achievement", "International cooperation in space", "Technology and society"] },
          ].map((c) => (
            <div key={c.subject} className="rounded-2xl bg-muted p-4">
              <p className="font-bold">{c.subject}</p>
              <ul className="mt-2 list-disc pl-4 space-y-1 text-muted-foreground">
                {c.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Lesson sequence */}
      <section aria-labelledby="sequence-title">
        <h3 id="sequence-title" className="font-display text-xl font-semibold">Lesson Sequence</h3>
        <ol className="mt-4 space-y-5">
          {[
            {
              time: "0–10 min",
              title: "Hook: What happens to old space machines?",
              steps: [
                "Ask students: \"When we leave something behind, what happens to it?\" (bicycles in rain, sandcastles on a beach)",
                "Show the home page hero image and ask: \"What can you see? What do you think those objects are?\"",
                "Explain that NASA left machines all over the solar system — and many are still there today.",
              ],
            },
            {
              time: "10–25 min",
              title: "Explore the Map",
              steps: [
                "Open the Solar System Map (/map). Point out the three zones: Moon, Mars, Deep Space.",
                "As a class, click on two or three spacecraft. Read the 'Letter from the machine' together.",
                "Pause and ask: \"What was this machine built to do? What did it find?\"",
              ],
            },
            {
              time: "25–45 min",
              title: "Independent / Paired Exploration",
              steps: [
                "Students (individually or in pairs) choose ONE spacecraft to explore in depth.",
                "They should read all six sections: mission, discoveries, ending, why it matters, legacy, and quiz.",
                "Students complete the Student Worksheet while reading.",
                "Encourage use of the glossary tooltips on difficult words.",
              ],
            },
            {
              time: "45–55 min",
              title: "Science Corner",
              steps: [
                "Open Science Corner (/science) as a class activity.",
                "Work through at least one interactive explainer together (suggested: Dust Storms).",
                "Invite students to predict what will happen before interacting.",
              ],
            },
            {
              time: "55–70 min",
              title: "Share & Discuss",
              steps: [
                "Students share one discovery from their chosen spacecraft.",
                "Whole-class discussion (see Discussion Questions below).",
                "Students complete the 'My message' reflection on their worksheet.",
              ],
            },
            {
              time: "70–90 min (optional extension)",
              title: "Badge & Certificate",
              steps: [
                "Students take the mini quiz on their chosen spacecraft.",
                "Visit /badges to see their progress and level.",
                "Space Archivist certificate for students who earn all badges (homework extension).",
              ],
            },
          ].map((step, i) => (
            <li key={i} className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-display text-sm font-bold text-primary-foreground" aria-hidden>{i + 1}</div>
              <div>
                <p className="font-bold">{step.title} <span className="font-normal text-muted-foreground text-sm">({step.time})</span></p>
                <ul className="mt-2 list-disc pl-4 space-y-1 text-sm text-muted-foreground">
                  {step.steps.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Discussion questions */}
      <section aria-labelledby="discussion-title">
        <h3 id="discussion-title" className="font-display text-xl font-semibold">Discussion Questions</h3>
        <ol className="mt-3 list-decimal pl-5 space-y-2 text-sm">
          <li>If you were an engineer, how would you feel about your spacecraft still working years after you expected it to stop?</li>
          <li>Some spacecraft (like the retroreflectors) never stopped working. Others (like Opportunity) were stopped by a dust storm. What can engineers do to plan for unexpected events?</li>
          <li>Voyager 1 carries a 'Golden Record' with sounds and images of Earth. If you made one today, what would you put on it?</li>
          <li>Should we try to bring old spacecraft back to Earth? What would be the benefits and challenges?</li>
          <li>How is exploring space like exploring the deep ocean or a rainforest? How is it different?</li>
        </ol>
      </section>

      {/* Differentiation */}
      <section aria-labelledby="diff-title">
        <h3 id="diff-title" className="font-display text-xl font-semibold">Differentiation</h3>
        <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
          {[
            { label: "Support (ages 8–10)", tips: ["Focus on Moon missions", "Read the 'Letter from the machine' aloud together", "Use the Read-aloud button on each profile", "Glossary tooltips explain hard words"] },
            { label: "Core (ages 10–12)", tips: ["Students choose any mission", "Complete all worksheet sections", "Take the mini quiz without help", "Try the Science Corner explainers"] },
            { label: "Extension (ages 12–14)", tips: ["Compare two missions from different zones", "Research one fact and check it against the NASA source", "Write a short 'farewell letter' from a spacecraft", "Calculate signal travel time using the formula on /where-now"] },
          ].map((d) => (
            <div key={d.label} className="rounded-2xl bg-muted p-4">
              <p className="font-bold">{d.label}</p>
              <ul className="mt-2 list-disc pl-4 space-y-1 text-muted-foreground">{d.tips.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      {/* Assessment */}
      <section aria-labelledby="assess-title">
        <h3 id="assess-title" className="font-display text-xl font-semibold">Assessment Ideas</h3>
        <ul className="mt-3 list-disc pl-5 space-y-1 text-sm">
          <li><strong>Formative:</strong> completed Student Worksheet, quiz score, class discussion participation.</li>
          <li><strong>Summative:</strong> a short report or presentation: "My chosen spacecraft — mission, discovery, and legacy."</li>
          <li><strong>Creative:</strong> draw a 'farewell postcard' from a spacecraft to mission control.</li>
          <li><strong>Digital:</strong> the Space Archivist badge and certificate can serve as evidence of digital literacy work.</li>
        </ul>
      </section>

      <p className="border-t pt-5 text-xs text-muted-foreground">
        Made for the NASA Space Apps Challenge. Not an official NASA document. Facts sourced from NASA mission pages — see /credits for all sources. Always verify mission-specific facts against current NASA pages before teaching.
      </p>
    </div>
  );
}

// ─── Student Worksheet ────────────────────────────────────────────────────────
function StudentWorksheet() {
  return (
    <div id="student-worksheet" className="print-target space-y-5 rounded-3xl border bg-card p-6 sm:p-10">
      <div className="border-b pb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-accent">SPACE LEGACY · Student Worksheet</p>
        <h2 className="mt-2 font-display text-2xl font-semibold">My Spacecraft Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">Pick one spacecraft and answer the questions below as you explore its profile page.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="My name" lines={1} />
        <Field label="Date" lines={1} />
        <Field label="Spacecraft I chose" lines={1} />
        <Field label="Zone (Moon / Mars / Deep Space)" lines={1} />
      </div>

      <Field label="1. What was this spacecraft built to do? (Its mission)" lines={3} />
      <Field label="2. Name two things it discovered" lines={4} />
      <Field label="3. Why did the mission end? (Or is it still going?)" lines={3} />
      <Field label="4. Why does this mission still matter today?" lines={3} />
      <Field label="5. My favourite fact about this spacecraft" lines={2} />

      <div className="rounded-2xl border-2 border-dashed border-accent p-4">
        <p className="font-bold">🖊 My message</p>
        <p className="mt-1 text-sm text-muted-foreground">Imagine you are the spacecraft. Write a short message (2–4 sentences) back to Earth:</p>
        <div className="mt-3 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-6 w-full rounded border-b border-border" />
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-muted p-4">
        <p className="font-bold">🎨 Draw it!</p>
        <p className="mt-1 text-sm text-muted-foreground">Sketch your spacecraft in the box below. Add labels!</p>
        <div className="mt-3 h-40 w-full rounded-2xl border-2 border-dashed border-border bg-background" aria-label="Drawing space" />
      </div>

      <div>
        <p className="font-bold">Quiz score</p>
        <p className="mt-1 text-sm text-muted-foreground">After you take the mini quiz, write your score here:</p>
        <div className="mt-2 inline-flex items-center gap-2 rounded-xl border bg-background px-4 py-2 text-sm">
          <span>I got</span>
          <div className="h-6 w-10 rounded border-b border-border" />
          <span>out of</span>
          <div className="h-6 w-10 rounded border-b border-border" />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        SPACE LEGACY · spacelegacy.app · NASA Space Apps Challenge · Not an official NASA document
      </p>
    </div>
  );
}

function Field({ label, lines }: { label: string; lines: number }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-bold">{label}</label>
      <div className="space-y-3">
        {[...Array(lines)].map((_, i) => (
          <div key={i} className="h-7 w-full rounded border-b border-border" />
        ))}
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
function TeachersPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-4">
      <PageHeader
        eyebrow="For educators"
        title="Teacher Resources"
        intro="Free printable lesson plan and student worksheet for the Space Legacy museum. Designed for ages 8–14."
      />

      {/* Print note */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-card px-5 py-4">
        <p className="text-sm text-muted-foreground">
          <BookOpen className="mr-2 inline h-4 w-4" aria-hidden />
          To print: expand the section you want, then use <strong>File → Print</strong> (or Ctrl/Cmd+P). The print layout hides the rest of the page.
        </p>
        <Button onClick={() => window.print()} className="shrink-0">
          <Printer className="mr-2 h-4 w-4" aria-hidden />
          Print this page
        </Button>
      </div>

      <div className="space-y-6">
        <Accordion id="lesson-plan" title="📋 Lesson Plan (60–90 minutes)">
          <LessonPlan />
        </Accordion>

        <Accordion id="worksheet" title="📝 Student Worksheet — My Spacecraft Profile">
          <StudentWorksheet />
        </Accordion>

        <Accordion id="glossary-ref" title="📖 Glossary Reference (for the board or handout)">
          <div id="glossary-ref-content" className="print-target">
            <p className="mb-4 text-sm text-muted-foreground">Key vocabulary used in Space Legacy. Definitions are also available as pop-up tooltips throughout the site (tap/click any underlined gold word).</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { term: "Rover", def: "A robot car that drives around on another world to explore it." },
                { term: "Lander", def: "A spacecraft that lands on a world and stays in one spot." },
                { term: "Orbit", def: "The curved path an object takes as it goes around a planet or star." },
                { term: "Solar panel", def: "A flat panel that turns sunlight into electricity." },
                { term: "Seismometer", def: "A super-sensitive tool that feels the ground shake, like during a quake." },
                { term: "Interstellar space", def: "The space between the stars, outside the bubble of wind from our Sun." },
                { term: "Retroreflector", def: "A special mirror that bounces light straight back to where it came from." },
                { term: "Sol", def: "One day on Mars — about 40 minutes longer than a day on Earth." },
                { term: "Radio signal", def: "An invisible wave of energy that carries messages at the speed of light." },
                { term: "Regolith", def: "The loose dust and broken rock covering the surface of the Moon or Mars." },
                { term: "RTG / nuclear battery", def: "Makes electricity from the heat of slowly decaying material; works far from the Sun." },
                { term: "Marsquake", def: "An earthquake that happens on Mars." },
                { term: "Flyby", def: "When a spacecraft zooms past a planet to study it without stopping." },
                { term: "AU (Astronomical Unit)", def: "The distance from Earth to the Sun — about 150 million km." },
              ].map((g) => (
                <div key={g.term} className="rounded-xl border bg-background p-3 text-sm">
                  <p className="font-bold">{g.term}</p>
                  <p className="text-muted-foreground">{g.def}</p>
                </div>
              ))}
            </div>
          </div>
        </Accordion>

        <Accordion id="tips" title="💡 Quick Tips for Educators">
          <div className="space-y-3 text-sm text-muted-foreground">
            <p><strong>Screen reader / accessibility:</strong> every page uses semantic HTML, ARIA labels, and keyboard navigation. The read-aloud button on each spacecraft profile works with any browser.</p>
            <p><strong>Accessibility settings:</strong> the Settings gear in the top header lets you switch to Bigger Text and Less Motion for students who need it.</p>
            <p><strong>Offline:</strong> the site is not currently available offline. Download the printable worksheets ahead of time if your classroom internet is unreliable.</p>
            <p><strong>Badge system:</strong> the badge system uses browser storage, so badges are saved per device. For shared devices, use the Reset Progress button on /badges between students.</p>
            <p><strong>Sharing:</strong> students can share any spacecraft profile URL directly. For example, /hardware/opportunity links straight to Opportunity.</p>
            <p><strong>Fact-checking:</strong> all facts are sourced from NASA mission pages (see /credits). Encourage older students to click the "Fact source" link at the bottom of each profile to practise primary-source research.</p>
          </div>
        </Accordion>
      </div>

      {/* Reusable link */}
      <div className="mt-10 rounded-3xl border bg-card px-6 py-5 text-center">
        <ClipboardList className="mx-auto h-8 w-8 text-accent" aria-hidden />
        <p className="mt-2 font-display text-lg font-semibold">Share this page</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Link to <code className="rounded bg-muted px-1 py-0.5">/teachers</code> so colleagues can access lesson materials directly.
        </p>
      </div>
    </div>
  );
}
