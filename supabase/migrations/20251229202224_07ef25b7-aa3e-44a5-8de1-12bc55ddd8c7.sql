-- Drop existing restrictive policies on products
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can insert products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON public.products;

-- Create public access policies for products
CREATE POLICY "Public read access" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.products FOR UPDATE USING (true);

-- Drop existing storage policies for product-images bucket
DROP POLICY IF EXISTS "Anyone can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product images" ON storage.objects;

-- Create public access policies for storage
CREATE POLICY "Public read product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Public insert product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Public update product images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images');