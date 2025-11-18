-- Allow admins and support team to view all profiles for search
CREATE POLICY "Support team can view profiles for search"
ON public.profiles
FOR SELECT
USING (
  is_admin_by_email() OR
  public.is_support_member(auth.uid())
);