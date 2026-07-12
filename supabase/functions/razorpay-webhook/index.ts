// razorpay-webhook — Sprint 3 (plan §4). The durable source of truth for
// payment state. Signature-verified against RAZORPAY_WEBHOOK_SECRET (raw-body
// HMAC-SHA256), idempotent on the Razorpay event id (payment_events unique
// constraint), handles payment.captured (mark paid + grant) and
// refund.processed (mark refunded + revoke).
//
// DEPLOY WITH --no-verify-jwt — Razorpay does not send a Supabase JWT; the
// HMAC signature is the authentication.
import { createClient } from "jsr:@supabase/supabase-js@2";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
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
  const secret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET");
  if (!secret) return json({ error: "webhook not configured" }, 500);

  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";
  const expected = await hmacHex(secret, rawBody);
  if (signature !== expected) {
    console.warn("webhook signature mismatch");
    return json({ error: "invalid signature" }, 400);
  }

  let event: {
    event?: string;
    payload?: {
      payment?: { entity?: Record<string, unknown> };
      refund?: { entity?: Record<string, unknown> };
    };
  };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return json({ error: "bad payload" }, 400);
  }

  const service = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Idempotency: Razorpay retries deliveries; the event id is unique.
  const eventId = req.headers.get("x-razorpay-event-id") ?? crypto.randomUUID();
  const payment = event.payload?.payment?.entity as
    | { id?: string; order_id?: string; notes?: Record<string, string> }
    | undefined;
  const notes = payment?.notes ?? {};
  const { error: logErr } = await service.from("payment_events").insert({
    razorpay_event_id: eventId,
    type: event.event ?? "unknown",
    raw: event,
    user_id: notes.user_id ?? null,
  });
  if (logErr) {
    if (logErr.code === "23505") return json({ ok: true, duplicate: true }); // already processed
    console.error("payment_events insert failed", logErr);
    return json({ error: "event log failed" }, 500);
  }

  if (event.event === "payment.captured" && payment?.order_id) {
    const { data: purchase } = await service
      .from("purchases")
      .select("id, user_id, product_id, status, products(kind)")
      .eq("razorpay_order_id", payment.order_id)
      .maybeSingle();
    if (purchase) {
      if (purchase.status !== "paid") {
        await service
          .from("purchases")
          .update({
            status: "paid",
            razorpay_payment_id: payment.id,
            updated_at: new Date().toISOString(),
          })
          .eq("id", purchase.id);
      }
      if ((purchase.products as { kind?: string } | null)?.kind === "chapter") {
        await service.from("entitlements").upsert(
          {
            user_id: purchase.user_id,
            chapter_id: purchase.product_id,
            source: "purchase",
            purchase_id: purchase.id,
          },
          { onConflict: "user_id,chapter_id", ignoreDuplicates: true },
        );
      }
    } else {
      console.warn("payment.captured for unknown order", payment.order_id);
    }
  }

  if (event.event === "refund.processed") {
    const refund = event.payload?.refund?.entity as { payment_id?: string } | undefined;
    if (refund?.payment_id) {
      const { data: purchase } = await service
        .from("purchases")
        .select("id")
        .eq("razorpay_payment_id", refund.payment_id)
        .maybeSingle();
      if (purchase) {
        await service
          .from("purchases")
          .update({ status: "refunded", updated_at: new Date().toISOString() })
          .eq("id", purchase.id);
        // Refund revokes the chapter (plan §4).
        await service.from("entitlements").delete().eq("purchase_id", purchase.id);
      }
    }
  }

  return json({ ok: true });
});
