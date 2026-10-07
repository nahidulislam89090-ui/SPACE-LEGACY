// Built-in space avatar definitions.
// Each avatar has an emoji, label, and aria description.

export type AvatarKey =
  | "astronaut"
  | "rover"
  | "voyager"
  | "moon"
  | "mars"
  | "comet"
  | "satellite"
  | "rocket"
  | "telescope"
  | "planet";

export interface AvatarDef {
  key: AvatarKey;
  emoji: string;
  label: string;
  ariaLabel: string;
}

export const AVATAR_DEFS: AvatarDef[] = [
  { key: "astronaut", emoji: "🧑‍🚀", label: "Astronaut", ariaLabel: "Astronaut avatar" },
  { key: "rover", emoji: "🤖", label: "Rover", ariaLabel: "Rover avatar" },
  { key: "voyager", emoji: "🛸", label: "Voyager Probe", ariaLabel: "Voyager probe avatar" },
  { key: "moon", emoji: "🌕", label: "Moon", ariaLabel: "Moon avatar" },
  { key: "mars", emoji: "🔴", label: "Mars", ariaLabel: "Mars avatar" },
  { key: "comet", emoji: "☄️", label: "Comet", ariaLabel: "Comet avatar" },
  { key: "satellite", emoji: "🛰️", label: "Satellite", ariaLabel: "Satellite avatar" },
  { key: "rocket", emoji: "🚀", label: "Rocket", ariaLabel: "Rocket avatar" },
  { key: "telescope", emoji: "🔭", label: "Telescope", ariaLabel: "Telescope avatar" },
  { key: "planet", emoji: "🪐", label: "Saturn", ariaLabel: "Saturn planet avatar" },
];

export function getAvatar(key: string): AvatarDef {
  return AVATAR_DEFS.find((a) => a.key === key) ?? AVATAR_DEFS[0]!;
}
