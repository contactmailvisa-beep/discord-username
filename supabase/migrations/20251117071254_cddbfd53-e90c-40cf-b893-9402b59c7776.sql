-- إصلاح التحذيرات الأمنية بإضافة search_path للدوال

-- إعادة إنشاء الدالة مع search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
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

-- إعادة إنشاء دالة get_next_active_token مع search_path
CREATE OR REPLACE FUNCTION public.get_next_active_token(p_user_id UUID)
RETURNS TABLE (
  token_id UUID,
  token_value TEXT,
  token_name TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT id, user_tokens.token_value, user_tokens.token_name
  FROM public.user_tokens
  WHERE user_id = p_user_id
    AND is_active = true
    AND (rate_limit_reset IS NULL OR rate_limit_reset < now())
  ORDER BY COALESCE(last_used_at, created_at) ASC
  LIMIT 1;
END;
$$;

-- إعادة إنشاء دالة can_user_check مع search_path
CREATE OR REPLACE FUNCTION public.can_user_check(p_user_id UUID)
RETURNS TABLE (
  can_check BOOLEAN,
  next_check_at TIMESTAMP WITH TIME ZONE,
  plan_type TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plan_type TEXT;
  v_cooldown_minutes INTEGER;
  v_last_check TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT us.plan_type INTO v_plan_type
  FROM public.user_subscriptions us
  WHERE us.user_id = p_user_id AND us.status = 'active';
  
  IF NOT FOUND THEN
    v_plan_type := 'free';
  END IF;
  
  IF v_plan_type = 'premium' THEN
    v_cooldown_minutes := 5;
  ELSE
    v_cooldown_minutes := 15;
  END IF;
  
  SELECT last_check_at INTO v_last_check
  FROM public.check_cooldowns
  WHERE check_cooldowns.user_id = p_user_id;
  
  IF NOT FOUND THEN
    INSERT INTO public.check_cooldowns (user_id, last_check_at, reset_at)
    VALUES (p_user_id, now() - INTERVAL '1 hour', now());
    
    RETURN QUERY SELECT true, now(), v_plan_type;
  ELSE
    IF now() >= (v_last_check + (v_cooldown_minutes || ' minutes')::INTERVAL) THEN
      RETURN QUERY SELECT true, now(), v_plan_type;
    ELSE
      RETURN QUERY SELECT 
        false, 
        v_last_check + (v_cooldown_minutes || ' minutes')::INTERVAL,
        v_plan_type;
    END IF;
  END IF;
END;
$$;

-- إعادة إنشاء دالة update_last_check مع search_path  
CREATE OR REPLACE FUNCTION public.update_last_check(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.check_cooldowns (user_id, last_check_at, reset_at)
  VALUES (p_user_id, now(), now() + INTERVAL '15 minutes')
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    last_check_at = now(),
    reset_at = now() + INTERVAL '15 minutes';
END;
$$;