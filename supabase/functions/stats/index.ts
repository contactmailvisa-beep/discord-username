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
      .select('user_id, status')
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

    // Get user tokens
    const { data: tokens } = await supabase
      .from('user_tokens')
      .select('id, token_name, is_active, last_used_at, created_at')
      .eq('user_id', userId);

    const totalTokens = tokens?.length || 0;
    const activeTokens = tokens?.filter(t => t.is_active).length || 0;

    // Get check history stats
    const { data: checkHistory } = await supabase
      .from('check_history')
      .select('username_checked, is_available')
      .eq('user_id', userId);

    const totalChecks = checkHistory?.length || 0;
    const availableFound = checkHistory?.filter(h => h.is_available).length || 0;
    const takenFound = totalChecks - availableFound;

    // Get saved usernames count
    const { data: savedUsernames } = await supabase
      .from('saved_usernames')
      .select('id')
      .eq('user_id', userId);

    const savedCount = savedUsernames?.length || 0;

    // Get API logs for this user
    const { data: apiLogs } = await supabase
      .from('api_logs')
      .select('id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    const lastApiRequest = apiLogs?.[0]?.created_at || null;

    const stats = {
      tokens: {
        total: totalTokens,
        active: activeTokens,
        inactive: totalTokens - activeTokens
      },
      checks: {
        total: totalChecks,
        available_found: availableFound,
        taken_found: takenFound
      },
      saved_usernames: savedCount,
      last_api_request: lastApiRequest
    };

    return new Response(
      JSON.stringify(stats),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in stats function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
