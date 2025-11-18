-- Fix function search path with CASCADE
DROP FUNCTION IF EXISTS update_ticket_timestamp() CASCADE;

CREATE OR REPLACE FUNCTION update_ticket_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER update_support_tickets_timestamp
BEFORE UPDATE ON public.support_tickets
FOR EACH ROW
EXECUTE FUNCTION update_ticket_timestamp();