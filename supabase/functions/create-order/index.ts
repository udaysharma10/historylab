// create-order — Sprint 3 (plan §4). Creates a Razorpay Order for a product.
// The price ALWAYS comes from the products table server-side; the client only
// names a product_id. A purchases row (status 'created') is written first and
// its id is the Razorpay receipt, so every order is traceable.
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
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const keyId = Deno.env.get("RAZORPAY_KEY_ID");
  const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
  if (!keyId || !keySecret) return json({ error: "payments not configured" }, 500);

  const authClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: req.headers.get("Authorization")! } } },
  );
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return json({ error: "unauthorized" }, 401);

  let productId: unknown;
  let attemptId: unknown;
  try {
    ({ product_id: productId, attempt_id: attemptId } = await req.json());
  } catch {
    return json({ error: "bad request" }, 400);
  }
  if (typeof productId !== "string" || !/^[a-z0-9-]{1,40}$/.test(productId)) {
    return json({ error: "bad request" }, 400);
  }

  const service = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: product } = await service
    .from("products")
    .select("id, name, kind, price_paise, is_free")
    .eq("id", productId)
    .eq("active", true)
    .maybeSingle();
  if (!product) return json({ error: "unknown product" }, 404);
  if (product.is_free || product.price_paise < 100) {
    return json({ error: "product is not purchasable" }, 400);
  }

  // Chapters: refuse double-purchase of something already owned.
  if (product.kind === "chapter") {
    const { data: owned } = await service
      .from("entitlements")
      .select("id")
      .eq("user_id", user.id)
      .eq("chapter_id", product.id)
      .maybeSingle();
    if (owned) return json({ error: "already owned" }, 409);
  }

  // Examiner review (Milestone B): the addon is bought FOR one submitted
  // attempt. Validate ownership + state, refuse double-purchase per attempt.
  if (product.kind === "addon") {
    if (typeof attemptId !== "string" || !/^[0-9a-f-]{36}$/.test(attemptId)) {
      return json({ error: "attempt required" }, 400);
    }
    const { data: attempt } = await service
      .from("attempts")
      .select("id, user_id, status")
      .eq("id", attemptId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (!attempt) return json({ error: "unknown attempt" }, 404);
    if (attempt.status !== "submitted") {
      return json({ error: "attempt not submitted" }, 409);
    }
    const { data: existing } = await service
      .from("examiner_reviews")
      .select("id, status")
      .eq("attempt_id", attemptId)
      .neq("status", "refunded")
      .maybeSingle();
    if (existing) return json({ error: "already submitted for review" }, 409);
  }

  const { data: purchase, error: purchaseErr } = await service
    .from("purchases")
    .insert({
      user_id: user.id,
      product_id: product.id,
      amount_paise: product.price_paise,
      status: "created",
      attempt_id: product.kind === "addon" ? attemptId : null,
    })
    .select("id")
    .single();
  if (purchaseErr || !purchase) {
    console.error("purchase insert failed", purchaseErr);
    return json(
      { error: "could not start purchase", step: "purchase-insert", detail: purchaseErr?.message },
      500,
    );
  }

  const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: product.price_paise,
      currency: "INR",
      receipt: purchase.id,
      notes: {
        user_id: user.id,
        product_id: product.id,
        purchase_id: purchase.id,
        ...(product.kind === "addon" && typeof attemptId === "string"
          ? { attempt_id: attemptId }
          : {}),
      },
    }),
  });
  if (!rzpRes.ok) {
    const detail = await rzpRes.text();
    console.error("razorpay order failed", rzpRes.status, detail);
    return json(
      { error: "payment gateway error", step: "razorpay", status: rzpRes.status, detail: detail.slice(0, 300) },
      502,
    );
  }
  const order = await rzpRes.json();

  await service
    .from("purchases")
    .update({ razorpay_order_id: order.id, updated_at: new Date().toISOString() })
    .eq("id", purchase.id);

  const { data: profile } = await service
    .from("profiles")
    .select("guardian_email, name")
    .eq("id", user.id)
    .maybeSingle();

  return json({
    order_id: order.id,
    amount: order.amount,
    currency: order.currency,
    key_id: keyId,
    product_name: product.name,
    prefill_email: profile?.guardian_email || user.email || "",
    prefill_name: profile?.name || "",
  });
});
