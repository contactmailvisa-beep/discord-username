import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = req.headers.get('x-api-key');

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key is required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify API key and get user
    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from('api_keys')
      .select('user_id, status, requests_today, daily_limit')
      .eq('api_key', apiKey)
      .eq('status', 'active')
      .single();

    if (apiKeyError || !apiKeyData) {
      return new Response(
        JSON.stringify({ error: 'Invalid or inactive API key' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = apiKeyData.user_id;

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('username, created_at, avatar_url')
      .eq('id', userId)
      .single();

    // Check premium status
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan, status, current_period_end')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    const isPremium = !!subscription && (subscription.plan === 'basic' || subscription.plan === 'premium');

    // Get API usage stats
    const { data: apiKeys } = await supabase
      .from('api_keys')
      .select('id, label, status, requests_today, daily_limit, created_at, last_used_at')
      .eq('user_id', userId);

    const totalApiKeys = apiKeys?.length || 0;
    const activeApiKeys = apiKeys?.filter(key => key.status === 'active').length || 0;

    const userData = {
      username: profile?.username,
      created_at: profile?.created_at,
      avatar_url: profile?.avatar_url,
      is_premium: isPremium,
      premium_plan: isPremium ? subscription.plan : null,
      premium_expires: isPremium ? subscription.current_period_end : null,
      api_stats: {
        total_keys: totalApiKeys,
        active_keys: activeApiKeys,
        daily_limit: apiKeyData.daily_limit,
        requests_today: apiKeyData.requests_today,
        requests_remaining: apiKeyData.daily_limit - apiKeyData.requests_today
      }
    };

    return new Response(
      JSON.stringify(userData),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in user function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
