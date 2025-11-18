-- Create api_keys table
CREATE TABLE IF NOT EXISTS public.api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  api_key text NOT NULL UNIQUE,
  label text DEFAULT 'My API Key',
  rate_limit integer DEFAULT 60,
  daily_limit integer DEFAULT 50,
  requests_today integer DEFAULT 0,
  last_request_at timestamp with time zone,
  last_reset_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  last_used_at timestamp with time zone,
  status text DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
  is_processing boolean DEFAULT false
);

-- Create api_logs table
CREATE TABLE IF NOT EXISTS public.api_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id uuid NOT NULL REFERENCES public.api_keys(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  endpoint text NOT NULL,
  token_name text,
  usernames_checked jsonb,
  results jsonb,
  status_code integer,
  ip_address text,
  user_agent text,
  error_message text,
  created_at timestamp with time zone DEFAULT now(),
  processing_time integer
);

-- Create api_bans table
CREATE TABLE IF NOT EXISTS public.api_bans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  banned_by uuid NOT NULL,
  reason text NOT NULL,
  banned_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone NOT NULL,
  is_active boolean DEFAULT true
);

-- Function to generate API key
CREATE OR REPLACE FUNCTION public.generate_api_key()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  result TEXT := 'duc_';
  i INTEGER;
BEGIN
  FOR i IN 1..32 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::INTEGER, 1);
  END LOOP;
  RETURN result;
END;
$$;

-- Function to check if user is banned
CREATE OR REPLACE FUNCTION public.is_api_banned(check_user_id uuid)
RETURNS TABLE(is_banned boolean, expires_at timestamp with time zone, reason text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    true,
    ab.expires_at,
    ab.reason
  FROM public.api_bans ab
  WHERE ab.user_id = check_user_id
    AND ab.is_active = true
    AND ab.expires_at > now()
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::timestamp with time zone, NULL::text;
  END IF;
END;
$$;

-- Function to reset daily API counters
CREATE OR REPLACE FUNCTION public.reset_daily_api_counters()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.api_keys
  SET requests_today = 0
  WHERE DATE(last_reset_at) < CURRENT_DATE;
END;
$$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_api_key ON public.api_keys(api_key);
CREATE INDEX IF NOT EXISTS idx_api_logs_user_id ON public.api_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_api_logs_api_key_id ON public.api_logs(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_logs_created_at ON public.api_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_bans_user_id ON public.api_bans(user_id);

-- Enable RLS
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_bans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for api_keys
CREATE POLICY "Users can view own API keys"
  ON public.api_keys FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own API keys"
  ON public.api_keys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own API keys"
  ON public.api_keys FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own API keys"
  ON public.api_keys FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all API keys"
  ON public.api_keys FOR SELECT
  USING (is_admin_by_email());

CREATE POLICY "Service role can manage API keys"
  ON public.api_keys FOR ALL
  USING (true);

-- RLS Policies for api_logs
CREATE POLICY "Users can view own API logs"
  ON public.api_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all API logs"
  ON public.api_logs FOR SELECT
  USING (is_admin_by_email());

CREATE POLICY "Service role can insert API logs"
  ON public.api_logs FOR INSERT
  WITH CHECK (true);

-- RLS Policies for api_bans
CREATE POLICY "Users can view own bans"
  ON public.api_bans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admin can manage bans"
  ON public.api_bans FOR ALL
  USING (is_admin_by_email());