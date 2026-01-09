-- Add new gamification columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS credits integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS equipped_theme text DEFAULT 'default',
ADD COLUMN IF NOT EXISTS daily_quests jsonb DEFAULT '{"villain_scan": false, "hero_scan": false, "comment": false, "last_reset": null}'::jsonb,
ADD COLUMN IF NOT EXISTS owned_themes text[] DEFAULT ARRAY['default']::text[];