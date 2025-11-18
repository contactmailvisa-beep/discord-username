-- Create security definer function to check if user is in support team
CREATE OR REPLACE FUNCTION public.is_support_member(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.support_team
    WHERE user_id = _user_id
  )
$$;

-- Drop the problematic policy
DROP POLICY IF EXISTS "Support team members can view team" ON public.support_team;

-- Create new policy using the function
CREATE POLICY "Support team members can view team"
ON public.support_team
FOR SELECT
USING (
  user_id = auth.uid() OR
  public.is_support_member(auth.uid())
);