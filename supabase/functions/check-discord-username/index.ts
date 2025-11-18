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
    const { usernames, tokenName } = await req.json();

    if (!usernames || !Array.isArray(usernames) || usernames.length === 0) {
      throw new Error("Missing or invalid usernames array");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get the Global token from flepower7@gmail.com
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    const globalUser = authUsers?.users?.find(u => u.email === "flepower7@gmail.com");

    if (!globalUser) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Global account not found",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: globalToken, error: tokenError } = await supabase
      .from("user_tokens")
      .select("*")
      .eq("user_id", globalUser.id)
      .eq("token_name", tokenName || "Global")
      .eq("is_active", true)
      .maybeSingle();

    if (tokenError || !globalToken) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Global token not found or inactive",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check all usernames in parallel
    const results: Record<string, string> = {};
    const checkPromises = usernames.map(async (username: string) => {
      try {
        const discordResponse = await fetch(
          "https://discord.com/api/v9/users/@me/pomelo-attempt",
          {
            method: "POST",
            headers: {
              Authorization: globalToken.token_value,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username }),
          }
        );

        const data = await discordResponse.json();

        if (discordResponse.status === 429) {
          results[username] = "rate_limited";
          return;
        }

        if (discordResponse.status === 401 || discordResponse.status === 403) {
          await supabase
            .from("user_tokens")
            .update({ is_active: false })
            .eq("id", globalToken.id);
          results[username] = "token_invalid";
          return;
        }

        results[username] = data.taken === false ? "available" : "taken";
      } catch (error) {
        console.error(`Error checking ${username}:`, error);
        results[username] = "error";
      }
    });

    await Promise.all(checkPromises);

    // Update token usage
    await supabase
      .from("user_tokens")
      .update({
        last_used_at: new Date().toISOString(),
        usage_count: (globalToken.usage_count || 0) + usernames.length,
      })
      .eq("id", globalToken.id);

    return new Response(
      JSON.stringify({
        success: true,
        results,
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
