-- Add RLS policy for admin to view all subscriptions
CREATE POLICY "Admin can view all subscriptions"
ON public.user_subscriptions
FOR SELECT
TO authenticated
USING (is_admin_by_email());