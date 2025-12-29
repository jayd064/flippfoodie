-- Nuclear permission fix: Allow ALL operations for everyone
DROP POLICY IF EXISTS "Allow All" ON "public"."products";
DROP POLICY IF EXISTS "Allow public read access" ON "public"."products";
DROP POLICY IF EXISTS "Allow public insert access" ON "public"."products";
DROP POLICY IF EXISTS "Allow public update access" ON "public"."products";

-- Create single permissive policy for ALL operations
CREATE POLICY "Allow All Operations" ON "public"."products" 
FOR ALL 
TO anon, authenticated
USING (true) 
WITH CHECK (true);