-- Drop existing policies on products table
DROP POLICY IF EXISTS "Public insert access" ON public.products;
DROP POLICY IF EXISTS "Public read access" ON public.products;
DROP POLICY IF EXISTS "Public update access" ON public.products;
DROP POLICY IF EXISTS "public_insert_products" ON public.products;
DROP POLICY IF EXISTS "public_select_products" ON public.products;
DROP POLICY IF EXISTS "public_update_products" ON public.products;

-- Create explicit policies for products (no DELETE policy = DELETE blocked)
CREATE POLICY "Allow public read access"
ON public.products FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public insert access"
ON public.products FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public update access"
ON public.products FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Drop existing storage policies for product-images bucket
DROP POLICY IF EXISTS "public_upload_product_images" ON storage.objects;
DROP POLICY IF EXISTS "public_view_product_images" ON storage.objects;
DROP POLICY IF EXISTS "public_update_product_images" ON storage.objects;
DROP POLICY IF EXISTS "Public upload access" ON storage.objects;
DROP POLICY IF EXISTS "Public view access" ON storage.objects;
DROP POLICY IF EXISTS "Public update access" ON storage.objects;

-- Create storage policies (no DELETE policy = DELETE blocked)
CREATE POLICY "Allow public to view product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

CREATE POLICY "Allow public to upload product images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Allow public to update product images"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');