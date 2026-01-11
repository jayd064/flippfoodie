-- Add verification columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS account_type text NOT NULL DEFAULT 'user' CHECK (account_type IN ('user', 'brand_official', 'admin')),
ADD COLUMN IF NOT EXISTS is_verified boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS brand_name text;

-- Create an index for efficient lookups of verified accounts
CREATE INDEX IF NOT EXISTS idx_profiles_verified ON public.profiles(is_verified) WHERE is_verified = true;

-- Add a comment explaining the security model
COMMENT ON COLUMN public.profiles.is_verified IS 'Admin-only field. Cannot be modified by users through the frontend.';
COMMENT ON COLUMN public.profiles.account_type IS 'Account type: user, brand_official, or admin. Admin-controlled only.';