# HistoryLab → Subscription Education Portal — Launch Plan

**Created:** 2026-06-28
**Scope:** the engineering + commercial work to turn the current app into a paid, subscription-based portal.
**Builds on (do not duplicate):**
- `BIGGER_PICTURE.md` — product/pricing strategy (freemium tiers, ₹499/₹999, multi-class roadmap). This doc is the *technical execution* of its **Phase C**.
- `PLAN_AUTH_AND_ANALYTICS.md` — Supabase auth (DONE) + server-side progress sync & analytics (its **Phase D**, *planned but NOT yet implemented*).

---

## 0. Current state (honest assessment)

| Area | Status |
|---|---|
| Hosting | Vercel (SPA) + `vercel.json` SPA rewrite ✅ |
| Auth | Supabase Google OAuth ✅ (email/password not yet) |
| User data (progress, SM-2 flashcards, stars) | **localStorage only** (Zustand `persist`). `src/lib/syncProgress.ts` is scaffolded but stores don't use it. → lost on device switch. |
| Content | **Bundled into the JS shipped to the browser** (`src/data/**`). |
| Payments / subscriptions / entitlements | **None.** No Razorpay, no plans, no paywall. |
| Compliance (ToS/Privacy/Refund/GST/DPDPA) | None. |

### ⚠️ The one architectural truth that drives everything
**All chapter content currently ships inside the client bundle.** Anyone can read every "premium" chapter from browser DevTools for free. **A paywall is therefore not a UI toggle** — premium content must be **served from the backend on demand and gated by a server-checked entitlement.** This is the single biggest change and the backbone of this plan.

---

## 1. Target architecture (build on what exists)

```
React/Vite (Vercel)
   │  anon key, RLS-scoped reads
   ▼
Supabase
   ├── Auth (Google + email/password)
   ├── Postgres + Row-Level Security        ← user data, entitlements
   └── Edge Functions (Deno)                ← Razorpay webhook, premium-content fetch, order create
   ▲
   │  webhooks (server-to-server, signature-verified)
Razorpay (Subscriptions: UPI / cards / netbanking, GST invoices)
```
- **Keep:** Vercel + Supabase. **Add:** Razorpay (you already operate it at Blostem) + Supabase Edge Functions.
- **Why Razorpay over Stripe:** India-first (UPI), GST invoices, recurring Subscriptions API, existing org familiarity. Revisit Stripe only if international.

---

## 2. Data model (extends the schema in PLAN_AUTH_AND_ANALYTICS.md)

```sql
-- Plans (seed table)
create table plans (
  id text primary key,            -- 'free' | 'plus' | 'pro'
  name text not null,
  razorpay_plan_id text,          -- maps to a Razorpay Plan (annual / monthly variants)
  price_paise int not null,
  interval text not null,         -- 'year' | 'month'
  scope jsonb not null            -- e.g. {"books":["history"],"classes":["10"]}
);

-- One row per user's current subscription (source of truth = webhook, never the client)
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  plan_id text references plans(id),
  status text not null,           -- 'active' | 'past_due' | 'cancelled' | 'expired'
  razorpay_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Immutable audit log of every payment event (idempotent on event id)
create table payment_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  razorpay_event_id text unique,  -- idempotency key
  type text,                      -- 'subscription.charged', 'payment.failed', ...
  raw jsonb,
  created_at timestamptz default now()
);
```
- **Entitlement = a server-side check**, exposed as a Postgres function / view:
  `has_access(user_id, book, chapter) → bool` (Ch1 always true; else look up an `active` subscription whose `plan.scope` covers it and `current_period_end > now()`).
- **RLS:** users read only their own `subscriptions`; `payment_events`/writes happen **only** from the Edge Function (service-role), never the client.
- Also finish **`student_progress` + `flashcard_state` sync** (PLAN_AUTH Phase D) — required so a *paying* user doesn't lose progress across devices.

---

## 3. Paywall enforcement (the core)

**Principle: free content can ship in the bundle; premium content cannot.**

1. **Split the content.** Keep **Ch1 (free)** bundled. Move **Ch2+ JSON out of the build** into Supabase (a `chapter_content` table or a private Storage bucket).
2. **Gate the fetch.** A Supabase **Edge Function** `get-chapter(book, chapter)` runs `has_access(...)`; returns content only if entitled, else `402/403`.
3. **Client** lazy-loads premium chapters from that function; on `403` shows the **upgrade screen** instead of the content.
4. **Belt-and-braces UI gate** (`canAccessChapter()` from BIGGER_PICTURE) still hides locked UI — but it is **cosmetic**; the Edge Function is the real lock.

> Accept reality: once a paying user has fetched a chapter it's in their browser — perfect DRM is impossible. Goal is "no casual free access + not trivially scrapable," not unbreakable.

---

## 4. Payments & subscription flow (Razorpay)

1. **Seed Razorpay Plans** (Plus annual/monthly, Pro annual/monthly) → store `razorpay_plan_id` in `plans`.
2. **Checkout:** Edge Function `create-subscription(plan_id)` → Razorpay `subscription_id` → open Razorpay Checkout on the client.
3. **Webhook** (Edge Function, **verify `X-Razorpay-Signature`**, idempotent on event id) handles:
   `subscription.activated / .charged / .pending / .halted / .cancelled`, `payment.failed` → upserts `subscriptions.status` + `current_period_end`, appends `payment_events`.
4. **Renewals/dunning:** Razorpay auto-charges; on `past_due` show a banner + grace period, then downgrade to free on `expired`.
5. **Never** trust client-reported payment state — entitlement always derives from the webhook-written `subscriptions` row.

---

## 5. Accounts, billing & content ops
- **Account page:** current plan, renewal date, **upgrade / cancel**, payment history, download GST invoice (Razorpay-generated).
- **Email/password auth** + reset (not everyone has Google).
- **Parent-owns / student-uses** account model (see §6).
- **CMS for Neha** (Phase 2): edit content without code — admin UI over the `chapter_content` table (or a headless CMS). Becomes essential once content is a product, not a repo.
- **Admin:** manage users, comp/refund a subscription, see MRR/active subs.

---

## 6. Compliance (do NOT skip — it's a minors' product in India)
- **DPDPA (India):** processing **children's** data requires **verifiable parental consent** and bars behavioural tracking/targeted ads to minors. Design accounts as **parent creates & pays, student uses**; capture consent at signup. (Aligns with your Blostem DPDPA experience.)
- **GST:** register + issue **GST-compliant invoices** on every charge (Razorpay can generate).
- **Razorpay requirement:** publicly visible **Refund/Cancellation policy**, plus **Terms of Service** and **Privacy Policy** pages before going live.
- **Analytics:** privacy-friendly (PostHog/Plausible), no PII to third parties, no ad networks.

---

## 7. Phased execution

| Phase | Goal | Key work | Outcome |
|---|---|---|---|
| **S0** | Foundation | Finish PLAN_AUTH Phase D (server-side progress + flashcard sync, activity logging) | Paid users keep progress across devices |
| **S1 — MVP monetisation** | First rupee | `plans/subscriptions/payment_events` tables + RLS · Razorpay Plans + `create-subscription` + **webhook** · **move Ch2 server-side + `get-chapter` gate** · upgrade screen · account page (plan/cancel/invoice) · ToS/Privacy/Refund pages | **Launchable**: Ch1 free, Ch2 paywalled, real payments |
| **S2 — Hardening** | Trust & ops | email/password auth · parent/student model + DPDPA consent · GST invoicing polish · analytics funnel (visit→signup→paywall→pay) · dunning/renewal UX · basic admin | Sustainable operations |
| **S3 — Scale** | Growth | content CMS for Neha · coupons/referrals · more chapters/classes (BIGGER_PICTURE Phases D–F) · school licences · optional mobile wrapper | Catalogue + B2B |

**Effort:** S0+S1 ≈ **a few focused weeks** — the heavy infra (auth, DB, hosting, gateway) already exists; the real work is the **entitlement/paywall + content-server move + Razorpay webhooks**.

---

## 8. Cost (early stage)
- Supabase free tier covers ~hundreds of students (see PLAN_AUTH cost table); Edge Functions included.
- Vercel free/hobby fine initially.
- Razorpay: **per-transaction fee (~2%)** + GST; no fixed monthly.
- → Near-zero fixed cost until meaningful volume.

---

## 9. Open decisions (for Uday)
1. **Account model:** parent-pays/student-uses (recommended for DPDPA) vs student self-signup?
2. **Plus vs Pro at launch:** ship one plan first (simpler) or both?
3. **Billing default:** annual-only at launch (aligns to academic year, lower churn) or annual+monthly?
4. **Free boundary:** Ch1 only (current) — keep, or "first section of every chapter"?
5. **Brand:** stay HistoryLab, or rename to StudyLab now (BIGGER_PICTURE defers this) before marketing spend?
6. **Content protection appetite:** how much effort on anti-scraping vs ship-fast?

---

## 10. Risks
- **Content leakage** — mitigated (not eliminated) by serving premium content per-request to entitled users.
- **Account sharing** — one sub used by many; mitigate later with device/session limits if it becomes material.
- **Webhook reliability** — idempotent handler + reconcile job against Razorpay as source of truth.
- **Minor-data compliance** — treat as a launch blocker, not an afterthought.

---

### TL;DR
The **product strategy already exists** (BIGGER_PICTURE) and the **auth/backend foundation is partly built** (Supabase auth done; progress-sync planned). To actually launch paid you need, in order: **(S0)** finish server-side user-data sync, **(S1)** add Razorpay subscriptions + a **server-enforced paywall that moves premium content out of the bundle** + account/billing + legal pages, **(S2)** compliance (DPDPA/GST) + email auth + analytics. The paywall-enforcement piece is the non-obvious, must-do core.
