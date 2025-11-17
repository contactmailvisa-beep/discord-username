-- إنشاء جداول نظام فحص يوزرات Discord

-- جدول التوكنات
CREATE TABLE IF NOT EXISTS public.user_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  token_value TEXT NOT NULL,
  token_name TEXT NOT NULL DEFAULT 'Token',
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMP WITH TIME ZONE,
  rate_limit_reset TIMESTAMP WITH TIME ZONE,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- جدول الاشتراكات
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  plan_type TEXT NOT NULL DEFAULT 'free' CHECK (plan_type IN ('free', 'premium')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  paypal_subscription_id TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- جدول سجلات الفحص
CREATE TABLE IF NOT EXISTS public.check_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  username_checked TEXT NOT NULL,
  is_available BOOLEAN NOT NULL,
  token_used UUID REFERENCES public.user_tokens(id),
  checked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  response_time INTEGER,
  api_response JSONB
);

-- جدول اليوزرات المتاحة المحفوظة
CREATE TABLE IF NOT EXISTS public.saved_usernames (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  username TEXT NOT NULL,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT,
  is_claimed BOOLEAN DEFAULT false
);

-- جدول Rate Limiting للفحوصات
CREATE TABLE IF NOT EXISTS public.check_cooldowns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  last_check_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  checks_remaining INTEGER DEFAULT 1,
  reset_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- جدول إحصائيات المستخدم
CREATE TABLE IF NOT EXISTS public.user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  total_checks INTEGER DEFAULT 0,
  available_found INTEGER DEFAULT 0,
  tokens_added INTEGER DEFAULT 0,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إنشاء Indexes لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_user_tokens_user_id ON public.user_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tokens_active ON public.user_tokens(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_check_history_user_id ON public.check_history(user_id);
CREATE INDEX IF NOT EXISTS idx_check_history_date ON public.check_history(checked_at);
CREATE INDEX IF NOT EXISTS idx_saved_usernames_user_id ON public.saved_usernames(user_id);

-- RLS Policies

-- user_tokens
ALTER TABLE public.user_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tokens"
  ON public.user_tokens FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tokens"
  ON public.user_tokens FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tokens"
  ON public.user_tokens FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tokens"
  ON public.user_tokens FOR DELETE
  USING (auth.uid() = user_id);

-- user_subscriptions
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON public.user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription"
  ON public.user_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON public.user_subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- check_history
ALTER TABLE public.check_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own check history"
  ON public.check_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own check history"
  ON public.check_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- saved_usernames
ALTER TABLE public.saved_usernames ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved usernames"
  ON public.saved_usernames FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved usernames"
  ON public.saved_usernames FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved usernames"
  ON public.saved_usernames FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved usernames"
  ON public.saved_usernames FOR DELETE
  USING (auth.uid() = user_id);

-- check_cooldowns
ALTER TABLE public.check_cooldowns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cooldown"
  ON public.check_cooldowns FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own cooldown"
  ON public.check_cooldowns FOR ALL
  USING (auth.uid() = user_id);

-- user_stats
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own stats"
  ON public.user_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own stats"
  ON public.user_stats FOR ALL
  USING (auth.uid() = user_id);

-- Functions

-- دالة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers لتحديث updated_at
CREATE TRIGGER update_user_tokens_updated_at
  BEFORE UPDATE ON public.user_tokens
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- دالة للحصول على التوكن النشط التالي
CREATE OR REPLACE FUNCTION public.get_next_active_token(p_user_id UUID)
RETURNS TABLE (
  token_id UUID,
  token_value TEXT,
  token_name TEXT
) AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة لفحص إذا المستخدم يستطيع الفحص (Rate Limit)
CREATE OR REPLACE FUNCTION public.can_user_check(p_user_id UUID)
RETURNS TABLE (
  can_check BOOLEAN,
  next_check_at TIMESTAMP WITH TIME ZONE,
  plan_type TEXT
) AS $$
DECLARE
  v_plan_type TEXT;
  v_cooldown_minutes INTEGER;
  v_last_check TIMESTAMP WITH TIME ZONE;
BEGIN
  -- الحصول على نوع الخطة
  SELECT us.plan_type INTO v_plan_type
  FROM public.user_subscriptions us
  WHERE us.user_id = p_user_id AND us.status = 'active';
  
  IF NOT FOUND THEN
    v_plan_type := 'free';
  END IF;
  
  -- تحديد مدة الانتظار حسب الخطة
  IF v_plan_type = 'premium' THEN
    v_cooldown_minutes := 5;
  ELSE
    v_cooldown_minutes := 15;
  END IF;
  
  -- الحصول على آخر فحص
  SELECT last_check_at INTO v_last_check
  FROM public.check_cooldowns
  WHERE check_cooldowns.user_id = p_user_id;
  
  IF NOT FOUND THEN
    -- إنشاء سجل جديد
    INSERT INTO public.check_cooldowns (user_id, last_check_at, reset_at)
    VALUES (p_user_id, now() - INTERVAL '1 hour', now());
    
    RETURN QUERY SELECT true, now(), v_plan_type;
  ELSE
    -- فحص إذا انتهت مدة الانتظار
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- دالة لتحديث آخر فحص
CREATE OR REPLACE FUNCTION public.update_last_check(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.check_cooldowns (user_id, last_check_at, reset_at)
  VALUES (p_user_id, now(), now() + INTERVAL '15 minutes')
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    last_check_at = now(),
    reset_at = now() + INTERVAL '15 minutes';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;