# Abandoned but Not Forgotten — Build Plan

"The Museum with No Roof": an interactive storybook + museum about NASA hardware left on the Moon, Mars, and in deep space, for ages 8–14 and their teachers.

## Pages
- `/` Landing: starfield hero, title, one-line pitch, "Start exploring".
- `/map` Solar System Map: three zones (Moon, Mars, Deep Space) with clickable hotspots and status badges (Still talking / Silent but traveling / Resting on the surface / Mission complete).
- `/hardware/$slug` Profile pages using the six-part template: Meet the machine, Mission, Big discoveries, Ending, Why it matters today, Quick activity + quiz. Each has a "Letter from..." narration (visually separate from facts, with read-aloud) and a Legacy card.
- `/timeline` Scrollable 1960s-to-today timeline (launch, landing, end).
- `/where-now` Distance panel for Voyager 1/2 and Pioneer 10/11: estimated distance computed from a dated reference + average speed, signal travel time, simple analogy, "check NASA for the latest" note.
- `/science` Science Corner: 4 interactive explainers (dust storms vs solar panels slider, radio signal travel animation, why footprints last, Mars quakes from InSight).
- `/badges` Score, collected Explorer badges, printable "Space Archivist" certificate.
- `/teachers` One-page printable lesson plan + worksheet per item.
- `/credits` NASA sources, image credits, licenses.

## Hardware (8 profiles, more listed on the map)
Apollo 11 Lunar Module descent stage, Apollo Lunar Roving Vehicle, Apollo retroreflectors, Surveyor 3, Sojourner, Spirit, Opportunity, InSight, Ingenuity, Voyager 1, Voyager 2, Pioneer 10. All facts drawn from NASA mission pages; any uncertain live status flagged.

## Design
Dark deep-space background, Mars-orange primary, Voyager-gold accent, lunar-gray surfaces. Friendly display font (Fredoka or Baloo 2) + highly readable body (Atkinson Hyperlegible). Parallax stars, gentle motion, large touch targets, high contrast.

## Accessibility
Keyboard nav and focus rings, alt text, glossary tooltips on every technical term, reduced-motion toggle, text-size toggle, Web Speech read-aloud for letters.

## Technical details
- TanStack Start (React + Vite + TS) with Tailwind v4 — the project's fixed stack (Next.js not used). Framer Motion for animation. No 3D viewer in v1 (optional; can add later).
- Content in `src/content/*.ts` typed data files (hardware, timeline, glossary, quizzes) for easy editing.
- Images: NASA public-domain images via images-assets.nasa.gov URLs, credited on Credits page.
- Quiz progress and badges stored in the browser (localStorage) — no accounts needed.
- Printing via print-optimized CSS for certificate and lesson plans.
- Each route has its own SEO metadata.
- README with run/build/deploy notes + a "How this project meets the challenge" section.
- After building: checklist of facts, image credits, and mission statuses to verify manually.
