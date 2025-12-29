-- Enable pg_net extension for HTTP calls from triggers
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Create function to call analyze-product edge function
CREATE OR REPLACE FUNCTION public.trigger_analyze_product()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  edge_function_url text;
  service_role_key text;
BEGIN
  -- Get the Supabase URL and construct edge function URL
  edge_function_url := 'https://bbzwinojtzllthbpxiex.supabase.co/functions/v1/analyze-product';
  
  -- Make async HTTP call to the edge function
  PERFORM extensions.http_post(
    url := edge_function_url,
    body := jsonb_build_object('barcode', NEW.barcode)::text,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiendpbm9qdHpsbHRoYnB4aWV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMjg5NjEsImV4cCI6MjA4MjYwNDk2MX0.9qnIJcPGxewwkvcIb1Rf0skpRljSzQ-_OJ4wMVE_4OE'
    )::jsonb
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger that fires after insert on products
DROP TRIGGER IF EXISTS trigger_analyze_product_on_insert ON public.products;
CREATE TRIGGER trigger_analyze_product_on_insert
  AFTER INSERT ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_analyze_product();