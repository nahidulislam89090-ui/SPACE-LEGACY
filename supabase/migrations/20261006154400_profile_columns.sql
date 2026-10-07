-- Add avatar, favorites, and preferences columns to explorer_profiles
ALTER TABLE public.explorer_profiles
  ADD COLUMN IF NOT EXISTS avatar TEXT NOT NULL DEFAULT 'astronaut',
  ADD COLUMN IF NOT EXISTS favorites JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS preferences JSONB NOT NULL DEFAULT '{}'::jsonb;
