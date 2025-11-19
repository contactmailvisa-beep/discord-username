-- Drop old recursive policies
DROP POLICY IF EXISTS "Support team can view all tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Support team can update tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Support team can view all messages" ON public.support_messages;
DROP POLICY IF EXISTS "Support team can send messages" ON public.support_messages;

-- Create new policies using is_support_member function
CREATE POLICY "Support team can view all tickets"
ON public.support_tickets
FOR SELECT
USING (public.is_support_member(auth.uid()));

CREATE POLICY "Support team can update tickets"
ON public.support_tickets
FOR UPDATE
USING (public.is_support_member(auth.uid()));

CREATE POLICY "Support team can view all messages"
ON public.support_messages
FOR SELECT
USING (public.is_support_member(auth.uid()));

CREATE POLICY "Support team can send messages"
ON public.support_messages
FOR INSERT
WITH CHECK (
  public.is_support_member(auth.uid()) AND
  sender_id = auth.uid()
);