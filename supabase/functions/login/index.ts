import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple base64url encode
function base64url(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function createJWT(payload: Record<string, unknown>, secret: string): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(signingInput));
  const encodedSignature = base64url(String.fromCharCode(...new Uint8Array(signature)));

  return `${signingInput}.${encodedSignature}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return new Response(JSON.stringify({ error: "Username and password are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Hash the provided password
    const encoder = new TextEncoder();
    const data = encoder.encode(password + Deno.env.get("JWT_SECRET"));
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const passwordHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    // Find user
    const { data: user, error } = await supabase
      .from("kod_user")
      .select("user_id, username, password_hash")
      .eq("username", username)
      .maybeSingle();

    if (!user || user.password_hash !== passwordHash) {
      return new Response(JSON.stringify({ error: "Invalid username or password" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get user role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.user_id)
      .single();

    const role = roleData?.role || "customer";

    // Generate JWT
    const now = Math.floor(Date.now() / 1000);
    const expiry = now + 3600; // 1 hour
    const jwtPayload = {
      sub: user.username,
      user_id: user.user_id,
      role,
      iat: now,
      exp: expiry,
    };

    const token = await createJWT(jwtPayload, Deno.env.get("JWT_SECRET")!);

    // Store token in database
    await supabase.from("user_token").insert({
      value: token,
      user_id: user.user_id,
      expiry: new Date(expiry * 1000).toISOString(),
    });

    return new Response(JSON.stringify({ success: true, token, username: user.username }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Set-Cookie": `kodbank_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600`,
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
