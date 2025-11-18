import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-api-key, x-token-name",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = req.headers.get("x-api-key");
    const tokenName = req.headers.get("x-token-name");
    
    let body;
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const responseData = {
      message: "Test endpoint working",
      received: {
        apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : "missing",
        tokenName: tokenName || "missing",
        bodyKeys: Object.keys(body),
        usernamesCount: body.usernames?.length || 0
      }
    };

    console.log("Test API called:", responseData);

    return new Response(
      JSON.stringify(responseData),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
