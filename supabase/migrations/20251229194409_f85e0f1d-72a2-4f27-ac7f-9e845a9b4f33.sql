-- Create products table
CREATE TABLE public.products (
  barcode TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT,
  ingredients_text TEXT,
  health_score INTEGER,
  front_image_url TEXT,
  back_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create scans table
CREATE TABLE public.scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_barcode TEXT NOT NULL REFERENCES public.products(barcode) ON DELETE CASCADE,
  scanned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

-- Products policies (public read, authenticated write)
CREATE POLICY "Anyone can view products" 
ON public.products FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert products" 
ON public.products FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update products" 
ON public.products FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Scans policies (users can only see their own scans)
CREATE POLICY "Users can view their own scans" 
ON public.scans FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own scans" 
ON public.scans FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scans" 
ON public.scans FOR DELETE 
USING (auth.uid() = user_id);

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true);

-- Storage policies
CREATE POLICY "Anyone can view product images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'product-images' AND auth.uid() IS NOT NULL);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for products
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();