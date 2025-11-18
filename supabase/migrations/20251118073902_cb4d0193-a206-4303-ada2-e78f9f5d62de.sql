-- Fix search_path for functions
CREATE OR REPLACE FUNCTION public.can_use_global_account(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_next_available_at TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT next_available_at INTO v_next_available_at
  FROM public.global_account_usage
  WHERE user_id = p_user_id
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF v_next_available_at IS NULL THEN
    RETURN TRUE;
  END IF;
  
  IF now() >= v_next_available_at THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$;

CREATE OR REPLACE FUNCTION public.record_global_account_usage(p_user_id UUID)
RETURNS TIMESTAMP WITH TIME ZONE
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_next_available_at TIMESTAMP WITH TIME ZONE;
BEGIN
  v_next_available_at := now() + INTERVAL '12 hours';
  
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