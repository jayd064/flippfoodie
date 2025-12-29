-- Drop the broken trigger first, then the function
DROP TRIGGER IF EXISTS trigger_analyze_product_on_insert ON public.products;
DROP FUNCTION IF EXISTS public.trigger_analyze_product() CASCADE;