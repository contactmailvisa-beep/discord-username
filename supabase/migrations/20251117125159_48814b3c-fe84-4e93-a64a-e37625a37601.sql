-- Create function to check admin by email from auth.users directly
CREATE OR REPLACE FUNCTION public.is_admin_by_email()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  RETURN (
    SELECT email = 'flepower7@gmail.com'
    FROM auth.users
    WHERE id = auth.uid()
  );
END;
$$;

-- Drop existing admin policies on user_subscriptions
DROP POLICY IF EXISTS "Admin can update subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Admin can insert subscriptions" ON public.user_subscriptions;

-- Create new policies using the email check function
CREATE POLICY "Admin can update subscriptions by email"
ON public.user_subscriptions
FOR UPDATE
TO authenticated
USING (is_admin_by_email());

CREATE POLICY "Admin can insert subscriptions by email"
ON public.user_subscriptions
FOR INSERT
TO authenticated
WITH CHECK (is_admin_by_email());