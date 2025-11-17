import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { username, userId } = await req.json();

    if (!username || !userId) {
      throw new Error("Missing username or userId");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get user's active tokens
    const { data: tokens, error: tokensError } = await supabase
      .from("user_tokens")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("last_used_at", { ascending: true });

    if (tokensError) throw tokensError;

    if (!tokens || tokens.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "No active tokens found",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Try each token until one works
    let lastError = null;
    for (const token of tokens) {
      let discordResponse;
      try {
        // Check Discord API
        discordResponse = await fetch(
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
          user_id: userId,
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
          .eq("user_id", userId)
          .single();

        if (stats) {
          await supabase
            .from("user_stats")
            .update({
              total_checks: (stats.total_checks || 0) + 1,
              available_found: data.taken === false 
                ? (stats.available_found || 0) + 1 
                : stats.available_found,
              last_active: new Date().toISOString(),
            })
            .eq("user_id", userId);
        }

        return new Response(
          JSON.stringify({
            success: true,
            available: data.taken === false,
            response: data,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      } catch (error: any) {
        lastError = error.message;
        // If token fails, mark it for review but continue with next token
        if (discordResponse && (discordResponse.status === 401 || discordResponse.status === 403)) {
          await supabase
            .from("user_tokens")
            .update({ is_active: false })
            .eq("id", token.id);
        }
        continue;
      }
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: lastError || "All tokens failed",
      }),
      {
        status: 500,
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
