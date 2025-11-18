import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-api-key, x-token-name",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const startTime = Date.now();
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";

  try {
    const apiKey = req.headers.get("x-api-key");
    const tokenName = req.headers.get("x-token-name");
    const { usernames } = await req.json();

    if (!apiKey || !tokenName) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing API key or token name",
        }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!usernames || !Array.isArray(usernames) || usernames.length === 0 || usernames.length > 10) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid usernames array (must be 1-10 usernames)",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verify API key and get user
    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from("api_keys")
      .select("*")
      .eq("api_key", apiKey)
      .eq("status", "active")
      .maybeSingle();

    if (apiKeyError || !apiKeyData) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid or revoked API key",
        }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if user is banned
    const { data: banData } = await supabase
      .rpc("is_api_banned", { check_user_id: apiKeyData.user_id })
      .maybeSingle();

    if (banData && (banData as any).is_banned) {
      await supabase.from("api_logs").insert({
        api_key_id: apiKeyData.id,
        user_id: apiKeyData.user_id,
        endpoint: "/check-api-username",
        token_name: tokenName,
        usernames_checked: usernames,
        status_code: 403,
        ip_address: ip,
        user_agent: userAgent,
        error_message: `Banned until ${(banData as any).expires_at}: ${(banData as any).reason}`,
        processing_time: Date.now() - startTime,
      });

      return new Response(
        JSON.stringify({
          success: false,
          error: "API access banned",
          banned_until: (banData as any).expires_at,
          reason: (banData as any).reason,
        }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if API key is currently processing
    if (apiKeyData.is_processing) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "API key is already processing a request. Please wait.",
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check rate limit (60 seconds)
    if (apiKeyData.last_request_at) {
      const lastRequest = new Date(apiKeyData.last_request_at).getTime();
      const now = Date.now();
      const diff = (now - lastRequest) / 1000;
      
      if (diff < apiKeyData.rate_limit) {
        const waitTime = Math.ceil(apiKeyData.rate_limit - diff);
        return new Response(
          JSON.stringify({
            success: false,
            error: "Rate limit exceeded",
            retry_after: waitTime,
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Check daily limit - get subscription status
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("plan, status")
      .eq("user_id", apiKeyData.user_id)
      .eq("status", "active")
      .maybeSingle();
    
    const isPremium = subscription?.plan === "premium" || 
                     apiKeyData.user_id === "54f4231d-9b07-4cd1-98f5-a483ac27db29";
    const dailyLimit = isPremium ? 100 : 50;

    // Reset counter if new day
    await supabase.rpc("reset_daily_api_counters");

    // Reload API key data after reset
    const { data: refreshedKey } = await supabase
      .from("api_keys")
      .select("requests_today")
      .eq("id", apiKeyData.id)
      .single();

    const currentRequests = refreshedKey?.requests_today || 0;

    if (currentRequests >= dailyLimit) {
      await supabase.from("api_logs").insert({
        api_key_id: apiKeyData.id,
        user_id: apiKeyData.user_id,
        endpoint: "/check-api-username",
        token_name: tokenName,
        usernames_checked: usernames,
        status_code: 429,
        ip_address: ip,
        user_agent: userAgent,
        error_message: `Daily limit reached (${dailyLimit} requests)`,
        processing_time: Date.now() - startTime,
      });

      return new Response(
        JSON.stringify({
          success: false,
          error: "Daily limit reached",
          limit: dailyLimit,
          used: currentRequests,
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Set processing flag
    await supabase
      .from("api_keys")
      .update({ is_processing: true })
      .eq("id", apiKeyData.id);

    // Get user's token
    const { data: token, error: tokenError } = await supabase
      .from("user_tokens")
      .select("*")
      .eq("user_id", apiKeyData.user_id)
      .eq("token_name", tokenName)
      .eq("is_active", true)
      .single();

    if (tokenError || !token) {
      await supabase
        .from("api_keys")
        .update({ is_processing: false })
        .eq("id", apiKeyData.id);

      await supabase.from("api_logs").insert({
        api_key_id: apiKeyData.id,
        user_id: apiKeyData.user_id,
        endpoint: "/check-api-username",
        token_name: tokenName,
        usernames_checked: usernames,
        status_code: 404,
        ip_address: ip,
        user_agent: userAgent,
        error_message: "Token not found or inactive",
        processing_time: Date.now() - startTime,
      });

      return new Response(
        JSON.stringify({
          success: false,
          error: "Token not found or inactive",
        }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check usernames
    const results = [];
    for (const username of usernames) {
      try {
        const discordResponse = await fetch(
          "https://discord.com/api/v9/users/@me/pomelo-attempt",
          {
            method: "POST",
            headers: {
              Authorization: token.token_value,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username }),
          }
        );

        const data = await discordResponse.json();

        results.push({
          username,
          available: data.taken === false,
          response: data,
        });

        // Update token usage
        await supabase
          .from("user_tokens")
          .update({
            last_used_at: new Date().toISOString(),
            usage_count: (token.usage_count || 0) + 1,
          })
          .eq("id", token.id);

        // Log check history
        await supabase.from("check_history").insert({
          user_id: apiKeyData.user_id,
          username_checked: username,
          is_available: data.taken === false,
          api_response: data,
          token_used: token.id,
          response_time: 0,
        });

        // Update user stats
        const { data: stats } = await supabase
          .from("user_stats")
          .select("*")
          .eq("user_id", apiKeyData.user_id)
          .single();

        if (stats) {
          await supabase
            .from("user_stats")
            .update({
              total_checks: (stats.total_checks || 0) + 1,
              available_found:
                data.taken === false
                  ? (stats.available_found || 0) + 1
                  : stats.available_found,
              last_active: new Date().toISOString(),
            })
            .eq("user_id", apiKeyData.user_id);
        }
      } catch (error: any) {
        results.push({
          username,
          available: false,
          error: error.message,
        });
      }
    }

    // Update API key
    await supabase
      .from("api_keys")
      .update({
        last_request_at: new Date().toISOString(),
        last_used_at: new Date().toISOString(),
        requests_today: currentRequests + 1,
        last_reset_at: new Date().toISOString(),
        is_processing: false,
      })
      .eq("id", apiKeyData.id);

    // Log successful request
    await supabase.from("api_logs").insert({
      api_key_id: apiKeyData.id,
      user_id: apiKeyData.user_id,
      endpoint: "/check-api-username",
      token_name: tokenName,
      usernames_checked: usernames,
      results: results,
      status_code: 200,
      ip_address: ip,
      user_agent: userAgent,
      processing_time: Date.now() - startTime,
    });

    return new Response(
      JSON.stringify({
        success: true,
        results,
        requests_remaining: dailyLimit - (currentRequests + 1),
        daily_limit: dailyLimit,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
