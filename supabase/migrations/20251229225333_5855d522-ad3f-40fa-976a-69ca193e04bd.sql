-- Drop existing update policy and recreate as permissive
DROP POLICY IF EXISTS "Allow public update access" ON public.products;

CREATE POLICY "Allow public update access" 
ON public.products 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

-- Add last_analyzed_at column
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS last_analyzed_at TIMESTAMP WITH TIME ZONE;