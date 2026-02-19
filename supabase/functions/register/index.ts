import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { username, email, password, phone } = await req.json();

    if (!username || !email || !password || !phone) {
      return new Response(JSON.stringify({ error: "All fields are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check if username or email already exists
    const { data: existing } = await supabase
      .from("kod_user")
      .select("user_id")
      .or(`username.eq.${username},email.eq.${email}`)
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ error: "Username or email already exists" }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Hash password using Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(password + Deno.env.get("JWT_SECRET"));
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const passwordHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    // Insert user
    const { data: newUser, error: insertError } = await supabase
      .from("kod_user")
      .insert({
        username,
        email,
        password_hash: passwordHash,
        phone_no: phone,
        balance: 100000,
      })
      .select("user_id")
      .single();

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Assign customer role
    await supabase.from("user_roles").insert({
      user_id: newUser.user_id,
      role: "customer",
    });

    return new Response(JSON.stringify({ success: true, message: "Registration successful" }), {
      status: 201,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
