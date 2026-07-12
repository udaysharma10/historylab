// get-chapter — the real paywall gate (plan §3).
// Returns a chapter's content bundle only if has_access(user, chapter) holds.
// chapter_content has no client RLS policies; this function (service role) is
// the single read path.
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Identify the caller from their JWT (platform already verified it).
  const authClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: req.headers.get("Authorization")! } } },
  );
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return json({ error: "unauthorized" }, 401);

  let chapter: unknown;
  try {
    ({ chapter } = await req.json());
  } catch {
    return json({ error: "bad request" }, 400);
  }
  if (typeof chapter !== "string" || !/^[a-z0-9-]{1,40}$/.test(chapter)) {
    return json({ error: "bad request" }, 400);
  }

  const service = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: allowed, error: accessErr } = await service.rpc("has_access", {
    p_user: user.id,
    p_chapter: chapter,
  });
  if (accessErr) return json({ error: "access check failed" }, 500);
  if (allowed !== true) return json({ error: "forbidden" }, 403);

  const { data, error } = await service
    .from("chapter_content")
    .select("content")
    .eq("chapter_id", chapter)
    .single();
  if (error || !data) return json({ error: "not found" }, 404);

  return json(data.content);
});
