-- Create tribes table
CREATE TABLE IF NOT EXISTS public.tribes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create posts table for spotlight and trending
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  upvotes INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_spotlight BOOLEAN DEFAULT false,
  tribe_id UUID REFERENCES public.tribes(id) ON DELETE SET NULL,
  author_name TEXT DEFAULT 'Anonymous',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tribes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read access for tribes" ON public.tribes
  FOR SELECT USING (true);

CREATE POLICY "Public read access for posts" ON public.posts
  FOR SELECT USING (true);

-- Allow authenticated users to insert/update posts
CREATE POLICY "Authenticated users can create posts" ON public.posts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can update posts" ON public.posts
  FOR UPDATE USING (true);

-- Seed tribes
INSERT INTO public.tribes (name, slug, description) VALUES
  ('Amul', 'amul', 'The taste of India - Dairy products discussion'),
  ('Nestle', 'nestle', 'Good Food, Good Life - Nestle product reviews'),
  ('Parle', 'parle', 'India''s favorite biscuit brand discussions')
ON CONFLICT (slug) DO NOTHING;

-- Seed spotlight post
INSERT INTO public.posts (title, content, image_url, upvotes, is_spotlight, author_name) VALUES
  ('Is Brown Bread a Scam?', 'We investigated 15 popular brown bread brands and found shocking revelations about what''s really inside. Most "whole wheat" breads contain less than 30% whole grain flour, with caramel coloring used to fake the brown appearance.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800', 1850, true, 'FoodDetective');

-- Seed trending posts
INSERT INTO public.posts (title, content, image_url, upvotes, is_spotlight, author_name) VALUES
  ('Lay''s Magic Masala: What They Don''t Tell You', 'A deep dive into the ingredient list reveals some surprising additives that most consumers overlook. From MSG to artificial flavors, here''s the complete breakdown.', 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800', 2340, false, 'ChipsCritic'),
  ('Maggi vs WickedGud: The Ultimate Showdown', 'We tested both noodles in a blind taste test with 50 participants. The results might surprise you!', 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=800', 1520, false, 'NoodleNinja'),
  ('Why Amul is Still the King of Dairy', 'Despite new competitors, Amul continues to dominate. Here''s our analysis of their quality standards.', 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800', 980, false, 'DairyExpert');

-- Add affiliate_url column to products table if not exists
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS affiliate_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_hero BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS hero_pair_barcode TEXT;