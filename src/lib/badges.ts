// Badge definitions and unlock logic.
// Badges are unlocked by events fired throughout the app via useProgress().awardBadge().

export type BadgeId =
  | "first-footprint"
  | "moon-keeper"
  | "red-planet-ranger"
  | "deep-space-voyager"
  | "quiz-whiz"
  | "signal-detective"
  | "time-traveler"
  | "dust-buster"
  | "letter-reader"
  | "space-archivist";

export interface BadgeDef {
  id: BadgeId;
  emoji: string;
  name: string;
  description: string;
  /** Explorer-level text shown in the level badge */
  level?: "Cadet" | "Explorer" | "Archivist";
}

export const BADGE_DEFS: BadgeDef[] = [
  {
    id: "first-footprint",
    emoji: "👣",
    name: "First Footprint",
    description: "You opened your first spacecraft profile. Welcome to the museum!",
    level: "Cadet",
  },
  {
    id: "moon-keeper",
    emoji: "🌕",
    name: "Moon Keeper",
    description: "You finished all Moon profiles and their quizzes. The Moon thanks you!",
    level: "Explorer",
  },
  {
    id: "red-planet-ranger",
    emoji: "🔴",
    name: "Red Planet Ranger",
    description: "You explored every Mars mission and passed the quizzes. Dust boots on!",
    level: "Explorer",
  },
  {
    id: "deep-space-voyager",
    emoji: "🌌",
    name: "Deep Space Voyager",
    description: "You journeyed through all deep-space missions and their quizzes. Boldly done!",
    level: "Explorer",
  },
  {
    id: "quiz-whiz",
    emoji: "⭐",
    name: "Quiz Whiz",
    description: "You scored 100% on at least one quiz. Brilliant!",
    level: "Explorer",
  },
  {
    id: "signal-detective",
    emoji: "📡",
    name: "Signal Detective",
    description: "You explored the radio-signal explainer in Science Corner.",
    level: "Cadet",
  },
  {
    id: "time-traveler",
    emoji: "⏳",
    name: "Time Traveler",
    description: "You scrolled the full mission timeline from the 1960s to today.",
    level: "Explorer",
  },
  {
    id: "dust-buster",
    emoji: "🌪️",
    name: "Dust Buster",
    description: "You completed the dust-storm explainer in Science Corner.",
    level: "Cadet",
  },
  {
    id: "letter-reader",
    emoji: "✉️",
    name: "Letter Reader",
    description: "You read (or listened to) at least 3 Letters from the machines.",
    level: "Explorer",
  },
  {
    id: "space-archivist",
    emoji: "🏆",
    name: "Space Archivist",
    description:
      "You collected all main badges! Your printable Space Archivist certificate is now unlocked.",
    level: "Archivist",
  },
];

/** Badges that must all be earned before Space Archivist auto-unlocks. */
export const ARCHIVIST_PREREQS: BadgeId[] = [
  "first-footprint",
  "moon-keeper",
  "red-planet-ranger",
  "deep-space-voyager",
  "quiz-whiz",
  "signal-detective",
  "time-traveler",
  "dust-buster",
  "letter-reader",
];

export const LEVEL_ORDER = ["Cadet", "Explorer", "Archivist"] as const;
export type ExplorerLevel = (typeof LEVEL_ORDER)[number];

/** Derives the explorer level from the set of earned badge ids. */
export function explorerLevel(earned: Set<BadgeId>): ExplorerLevel {
  if (earned.has("space-archivist")) return "Archivist";
  const explorerBadges: BadgeId[] = [
    "moon-keeper",
    "red-planet-ranger",
    "deep-space-voyager",
    "quiz-whiz",
    "time-traveler",
    "letter-reader",
  ];
  if (explorerBadges.some((b) => earned.has(b))) return "Explorer";
  return "Cadet";
}
