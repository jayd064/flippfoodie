-- Add analysis columns to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS analysis_summary text,
ADD COLUMN IF NOT EXISTS positive_points text[],
ADD COLUMN IF NOT EXISTS negative_points text[];