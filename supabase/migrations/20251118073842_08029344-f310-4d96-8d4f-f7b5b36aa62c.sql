-- Create table to track Global Account usage per user
CREATE TABLE IF NOT EXISTS public.global_account_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  last_check_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  next_available_at TIMESTAMP WITH TIME ZONE NOT NULL,
  checks_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.global_account_usage ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own usage
CREATE POLICY "Users can view their own global usage"
ON public.global_account_usage
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own usage
CREATE POLICY "Users can insert their own global usage"
ON public.global_account_usage
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own usage
CREATE POLICY "Users can update their own global usage"
ON public.global_account_usage
FOR UPDATE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_global_account_usage_user_id ON public.global_account_usage(user_id);

-- Create function to check if user can use Global Account
CREATE OR REPLACE FUNCTION public.can_use_global_account(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_next_available_at TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get the next available time for this user
  SELECT next_available_at INTO v_next_available_at
  FROM public.global_account_usage
  WHERE user_id = p_user_id
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- If no record exists, user can use it
  IF v_next_available_at IS NULL THEN
    RETURN TRUE;
  END IF;
  
  -- Check if enough time has passed (12 hours)
  IF now() >= v_next_available_at THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$;

-- Create function to record Global Account usage
CREATE OR REPLACE FUNCTION public.record_global_account_usage(p_user_id UUID)
RETURNS TIMESTAMP WITH TIME ZONE
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_next_available_at TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Calculate next available time (12 hours from now)
  v_next_available_at := now() + INTERVAL '12 hours';
  
  -- Insert or update usage record
  INSERT INTO public.global_account_usage (user_id, last_check_at, next_available_at)
  VALUES (p_user_id, now(), v_next_available_at)
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    last_check_at = now(),
    next_available_at = v_next_available_at,
    checks_count = global_account_usage.checks_count + 1,
    updated_at = now();
  
  RETURN v_next_available_at;
END;
$$;

-- Add unique constraint on user_id if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'global_account_usage_user_id_key'
  ) THEN
    ALTER TABLE public.global_account_usage 
    ADD CONSTRAINT global_account_usage_user_id_key UNIQUE (user_id);
  END IF;
END $$;