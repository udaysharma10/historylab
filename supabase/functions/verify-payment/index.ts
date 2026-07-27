// verify-payment — Sprint 3 (plan §4). Immediate post-checkout handshake:
// verifies Razorpay's payment signature (HMAC-SHA256 of "order_id|payment_id"
// with the key secret) and, on success, marks the purchase paid and grants the
// entitlement. The webhook remains the durable source of truth (it re-applies
// the same idempotent writes and handles refunds), this endpoint exists so the
// student is unlocked the second the modal closes.
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

async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
  if (!keySecret) return json({ error: "payments not configured" }, 500);

  const authClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: req.headers.get("Authorization")! } } },
  );
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return json({ error: "unauthorized" }, 401);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "bad request" }, 400);
  }
  const orderId = body.razorpay_order_id;
  const paymentId = body.razorpay_payment_id;
  const signature = body.razorpay_signature;
  if (
    typeof orderId !== "string" || typeof paymentId !== "string" ||
    typeof signature !== "string"
  ) {
    return json({ error: "missing fields" }, 400);
  }

  const expected = await hmacHex(keySecret, `${orderId}|${paymentId}`);
  if (expected !== signature) {
    console.warn("signature mismatch", { orderId, user: user.id });
    return json({ error: "signature mismatch" }, 400);
  }

  const service = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // The order must belong to the calling user.
  const { data: purchase } = await service
    .from("purchases")
    .select("id, user_id, product_id, status, attempt_id, products(kind)")
    .eq("razorpay_order_id", orderId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!purchase) return json({ error: "unknown order" }, 404);

  if (purchase.status !== "paid") {
    await service
      .from("purchases")
      .update({
        status: "paid",
        razorpay_payment_id: paymentId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", purchase.id);
  }

  const kind = (purchase.products as { kind?: string } | null)?.kind;
  if (kind === "chapter") {
    await service.from("entitlements").upsert(
      {
        user_id: user.id,
        chapter_id: purchase.product_id,
        source: "purchase",
        purchase_id: purchase.id,
      },
      { onConflict: "user_id,chapter_id", ignoreDuplicates: true },
    );
  }
  // Examiner review (Milestone B): a paid addon opens the review record for
  // its attempt — that row IS Neha's queue entry.
  if (kind === "addon" && purchase.attempt_id) {
    await service.from("examiner_reviews").upsert(
      {
        attempt_id: purchase.attempt_id,
        user_id: user.id,
        purchase_id: purchase.id,
        status: "paid",
      },
      { onConflict: "attempt_id", ignoreDuplicates: true },
    );
  }

  return json({ success: true, product_id: purchase.product_id });
});
