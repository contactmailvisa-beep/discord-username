-- Create enum for ticket status
CREATE TYPE ticket_status AS ENUM ('pending', 'urgent', 'emergency', 'status_7', 'scheduled', 'closed');

-- Create support_team table
CREATE TABLE public.support_team (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  added_by UUID NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Create support_tickets table
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status ticket_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  closed_at TIMESTAMP WITH TIME ZONE,
  assigned_to UUID REFERENCES public.support_team(user_id)
);

-- Create support_messages table
CREATE TABLE public.support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_support BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE public.support_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for support_team
CREATE POLICY "Admin can manage support team"
ON public.support_team
FOR ALL
USING (is_admin_by_email());

CREATE POLICY "Support team members can view team"
ON public.support_team
FOR SELECT
USING (
  user_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.support_team WHERE user_id = auth.uid())
);

-- RLS Policies for support_tickets
CREATE POLICY "Users can view their own tickets"
ON public.support_tickets
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can create tickets"
ON public.support_tickets
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Support team can view all tickets"
ON public.support_tickets
FOR SELECT
USING (EXISTS (SELECT 1 FROM public.support_team WHERE user_id = auth.uid()));

CREATE POLICY "Support team can update tickets"
ON public.support_tickets
FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.support_team WHERE user_id = auth.uid()));

-- RLS Policies for support_messages
CREATE POLICY "Users can view messages in their tickets"
ON public.support_messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.support_tickets
    WHERE id = ticket_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can send messages in their tickets"
ON public.support_messages
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.support_tickets
    WHERE id = ticket_id AND user_id = auth.uid()
  ) AND sender_id = auth.uid()
);

CREATE POLICY "Support team can view all messages"
ON public.support_messages
FOR SELECT
USING (EXISTS (SELECT 1 FROM public.support_team WHERE user_id = auth.uid()));

CREATE POLICY "Support team can send messages"
ON public.support_messages
FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM public.support_team WHERE user_id = auth.uid()) AND
  sender_id = auth.uid()
);

-- Create function to update ticket updated_at
CREATE OR REPLACE FUNCTION update_ticket_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for tickets
CREATE TRIGGER update_support_tickets_timestamp
BEFORE UPDATE ON public.support_tickets
FOR EACH ROW
EXECUTE FUNCTION update_ticket_timestamp();

-- Add realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_tickets;