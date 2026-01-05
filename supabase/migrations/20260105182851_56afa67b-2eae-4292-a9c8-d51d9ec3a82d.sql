-- Create profiles table with gamification fields
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE,
  display_name TEXT DEFAULT 'Anonymous Scanner',
  avatar_url TEXT,
  scans_count INTEGER DEFAULT 0,
  villains_exposed INTEGER DEFAULT 0,
  total_karma INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read access for profiles"
ON public.profiles FOR SELECT
USING (true);

-- Allow anyone to insert (for anonymous users)
CREATE POLICY "Anyone can create profiles"
ON public.profiles FOR INSERT
WITH CHECK (true);

-- Allow anyone to update their own profile or anonymous updates
CREATE POLICY "Anyone can update profiles"
ON public.profiles FOR UPDATE
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();