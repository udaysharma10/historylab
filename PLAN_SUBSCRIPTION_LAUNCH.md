# HistoryLab → Premium Invite-Only CBSE Portal — Launch Plan

**Created:** 2026-06-28 · **Revised:** 2026-07-02 after brainstorm with Uday — **model changed from freemium subscriptions to premium one-time purchases, invite-only.**
**Builds on (do not duplicate):**
- `BIGGER_PICTURE.md` — content roadmap (chapters/books/classes). Its original freemium/subscription pricing is **superseded** by this doc.
- `PLAN_AUTH_AND_ANALYTICS.md` — Supabase auth (DONE) + server-side progress sync (its Phase D, *planned, NOT yet implemented*).

---

## 0. The model (decided 2026-07-02)

| Dimension | Decision |
|---|---|
| **Positioning** | **Premium CBSE preparation portal** — not a cheap tuition alternative. Anchor against a tutoring hour (₹800–1,500), not app subscriptions. Validated qualitatively by the Heritage Xperiential pilot cohort (tier-1 school; WTP still unproven until first sales). |
| **Access** | **Invite-only "founding cohort"** while catalogue = Class 10 only. Signup requires an invite code. Each student account holds **3 invites**; admin can mint batches. Public landing page = rich preview + **"Request an invite" waitlist**. **Review trigger:** open access once more classes are covered. |
| **Pricing** | **₹499 one-time per chapter** (lifetime access, no expiry). No subscriptions, no recurring billing. Whole-book bundle **later, depending on uptake** — not at launch. |
| **Free tier** | Ch1 free — but *behind the invite gate* (invited accounts experience Ch1 fully before buying). Publicly, only the landing-page preview is visible. |
| **Teachers** | **No "teacher" role/label anywhere.** Admin creates accounts and can **grant/revoke chapter access from the backend for any account** (FOC comps for selected students/parents/teachers/consortiums). Verification is manual, by the founder. |
| **Anti-sharing** | Make the account a **personalised study state, not a content vault**: per-user progress/mastery, SM-2 flashcard scheduling, and (the moat) **CBSE-pattern practice tests with real marking schemes, marked with feedback and marks per student**. Shared credentials scramble all of it. Light session/device limits only — no heavy DRM. |
| **Payer** | Parent always assumed to pay (payment event doubles as DPDPA parental consent). Signup roles: student/parent only. |

### ⚠️ The architectural truth (unchanged)
All chapter content currently ships in the client JS bundle — anyone can read "premium" chapters from DevTools. **The paywall is not a UI toggle:** premium content must be served on demand from the backend, gated by a server-checked entitlement. This remains the backbone of the plan. (The Round-8 client-side email allowlist `src/lib/chapterAccess.ts` is a stopgap for the student trial; it is **retired** once server entitlements land.)

---

## 1. Target architecture

```
React/Vite (Vercel)  ← landing page w/ preview + waitlist
   │  anon key, RLS-scoped reads
   ▼
Supabase
   ├── Auth (Google now; email/password in S2) — signup gated by invite code
   ├── Postgres + RLS      ← entitlements, purchases, invites, progress, test attempts
   └── Edge Functions      ← create-order, Razorpay webhook, get-chapter, mark-answer (S2)
   ▲
   │  webhooks (signature-verified, idempotent)
Razorpay (one-time Orders — UPI/cards/netbanking; NO Subscriptions API)
```

Dropping subscriptions removes the entire recurring stack: no UPI-Autopay/e-mandate consent friction at checkout, no dunning, no renewal lifecycle — one `payment.captured` webhook instead of five subscription states.

---

## 2. Data model

```sql
-- Chapter SKUs (bundles become rows here later)
create table products (
  id text primary key,              -- 'ch2', 'ch3', ...
  name text not null,
  price_paise int not null,         -- 49900
  active boolean default true
);

-- One row per checkout attempt
create table purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  product_id text references products(id),
  razorpay_order_id text unique,
  razorpay_payment_id text,
  amount_paise int,
  status text not null,             -- 'created' | 'paid' | 'refunded'
  created_at timestamptz default now()
);

-- THE access table — one row = one unlocked chapter for one user.
-- Unifies paid purchases and admin FOC grants (Uday's backend-comp requirement).
create table entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  chapter_id text not null,
  source text not null,             -- 'purchase' | 'admin_grant'
  purchase_id uuid references purchases(id),
  granted_by uuid references profiles(id),   -- admin who comped
  note text,                        -- e.g. 'Heritage pilot cohort'
  created_at timestamptz default now(),
  unique (user_id, chapter_id)
);

-- Invite-only gate + provenance graph (every account traces to an inviter)
create table invites (
  code text primary key,
  inviter_id uuid references profiles(id),   -- null for admin-minted batches
  used_by uuid references profiles(id),
  created_at timestamptz default now(),
  used_at timestamptz
);

create table waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  note text,
  created_at timestamptz default now()
);

-- Immutable audit log of every payment event (idempotent on event id) — unchanged
create table payment_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  razorpay_event_id text unique,
  type text,
  raw jsonb,
  created_at timestamptz default now()
);
```

- **`has_access(user_id, chapter)`** (Postgres fn): chapter is free (`ch1`) → true for any signed-in account; else an `entitlements` row exists. Lifetime — no expiry logic anywhere.
- **RLS:** users read only their own rows; `entitlements`/`purchases` writes happen **only** via Edge Functions (service role) or admin.
- Also finish **`student_progress` + `flashcard_state` sync** (PLAN_AUTH Phase D) — under the personalised-study-state strategy this is no longer nice-to-have, it *is* the product moat's foundation.

---

## 3. Paywall enforcement (unchanged core)

1. Ch1 stays bundled (free). **Ch2+ content moves out of the build** into Supabase (table or private Storage).
2. Edge Function `get-chapter(chapter)` runs `has_access(...)`; returns content or `403`.
3. Client lazy-loads premium chapters; on `403` shows the purchase screen.
4. UI locks remain cosmetic; the Edge Function is the real gate.

> Once an entitled user has fetched a chapter it's in their browser — goal is "no casual free access," not unbreakable DRM.

## 4. Payments (Razorpay one-time Orders)

1. Edge Function `create-order(product_id)` → Razorpay Order → open Checkout on client.
2. Webhook (verify `X-Razorpay-Signature`, idempotent on event id): `payment.captured` → mark purchase `paid` + insert `entitlements` row; `refund.processed` → mark `refunded` + delete/flag the entitlement.
3. Never trust client-reported payment state — entitlement derives only from webhook-written rows.
4. GST invoice per charge (Razorpay-generated); admin can trigger refunds from Razorpay dashboard.

## 5. Invites & access flow

- Signup requires a valid unused invite code (checked server-side at profile creation; code marked used atomically).
- New student accounts are seeded **3 invite codes**; earning more via streaks = S3 gamification hook.
- Admin mints invite **batches** (for a teacher's class, a pilot school, a consortium).
- Landing page: content preview (screenshots/sample cards, no gated content) + waitlist email capture.
- **DPDPA:** parental-consent capture at signup (parent-pays model); no behavioural ads/tracking of minors; privacy-friendly analytics only.

## 6. Admin panel (backend flexibility — Uday's requirement)

- Create accounts directly (bypasses invite gate).
- **Grant / revoke chapter entitlements for any account** (`admin_grant` rows with a `note`) — this is how teachers, pilot cohorts, and FOC consortiums get access. No teacher role exists.
- Mint invite batches; view/convert waitlist; view purchases + payment events; trigger refund flow.

## 7. CBSE practice-test engine (S2 — the moat)

Per-chapter **CBSE-pattern papers**: same question typology and marking scheme as the board (objective/MCQ 1-mark, 2/3-mark short answers, 5-mark long answers, source-based and competency/case-based questions), timed attempts, typed answers.

- **Objective questions:** auto-marked.
- **Subjective (2/3/5-mark):** marked **by AI against the official CBSE marking scheme** — per-point feedback, marks awarded, model answer shown. Neha calibrates with a spot-check set before launch of this feature. (Assumption to confirm: AI-marked with teacher calibration, vs. human-marked.)
- Attempt history, per-section mastery, percentile within cohort (once N allows).
- **Why it kills credential sharing:** marks, feedback, attempt history, SM-2 scheduling, and mastery stats are meaningful only per-individual. A shared account produces garbage state for everyone using it.

## 8. Compliance (launch blockers, not afterthoughts)

- **DPDPA:** minors → verifiable parental consent (parent-pays flow provides it); no targeted ads; data-minimal analytics.
- **GST** registration + compliant invoices on every charge.
- **Razorpay prerequisites:** public Refund/Cancellation policy, ToS, Privacy Policy pages before go-live.

---

## 9. Phased execution

| Phase | Goal | Key work | Outcome |
|---|---|---|---|
| **S0 — Foundation** | Personalised state survives devices | PLAN_AUTH Phase D: server-side progress + flashcard(SM-2) sync, activity logging | Prereq for both the moat and paid UX |
| **S1 — Founding-cohort launch** | First rupee | Schema (§2) + RLS · invite-gated signup + waitlist landing page · **Ch2 content server-side + `get-chapter`** · Razorpay one-time orders + webhook · purchase screen · **admin panel (accounts, grants, invite batches)** · ToS/Privacy/Refund · DPDPA consent at signup | **Launch: Ch2 @ ₹499 to the Heritage pilot cohort** — the real WTP test |
| **S2 — The moat** | CBSE prep portal, not content app | **CBSE test engine w/ AI marking (§7)** · parent progress email (weekly) · email/password auth · session/device limits (2 devices) · analytics funnel (visit→waitlist→invite→signup→purchase) | Sharing-proof personal value; premium justified |
| **S3 — Growth** | Catalogue + loops | Ch3–5 content (BIGGER_PICTURE Phase D) · book-bundle SKU **if uptake supports it** · streak-earned invites + gamification · CMS for Neha · open access when ≥2 classes covered | Scale path |

**Effort:** S0+S1 ≈ a few focused weeks (heavy infra exists; the work is entitlements + content-server move + one-time payment flow + admin panel). The test engine (S2) is the biggest net-new build — content authoring (papers + marking schemes) is the long pole, not code.

---

## 10. Decision log

**Closed 2026-07-02 (Uday):**
1. Invite-only **founding cohort** while Class-10-only; open access once more classes ship. 3 invites/student; admin batches.
2. **₹499 one-time per chapter**; bundle deferred until uptake data. Lifetime access.
3. **No teacher role at all** — admin creates accounts / grants chapters from backend for anyone (FOC flexibility).
4. Anti-sharing = personalised study state + **CBSE-style practice tests with real marking schemes, marks and feedback** (Tier 1 strategy). Light technical friction only.
5. Signup roles: student/parent; parent always assumed payer (→ DPDPA consent).

**Closed 2026-07-02 (round 2):**
6. **Merchant of record: Teknomatics** (Uday's other company; Neha the operating owner) — Razorpay onboarding + GST under Teknomatics, NOT Blostem.
7. **Launch choreography:** no direct selling to students. Admin **comps chapters FOC from the backend** to the pilot cohort; product spreads virally; students ask parents to buy. (This is why admin grant/revoke for any account is a launch requirement.)
8. **Domain:** `historylab.in` already purchased (by Neha). Vercel/Supabase/OAuth wiring per HANDOFF.
9. **Execution gate: mockups first.** Page-by-page HTML mockups of the entire new front end (landing, waitlist, invite flow, payment flow, admin panel) in the exact C2 design language, visually validated by Uday **before** actual development. Mockups live in `mockups/launch-*.html`.

**Closed 2026-07-02 (round 3):**
10. **Launch scope: public launch happens only WITH the CBSE test engine.** S1 (payments/paywall) is built and verified in test mode but does NOT go public on its own. Sprint sequence unchanged (S0 → S1 → test engine → **launch** → trust/ops). The test engine is the launch differentiator, not a fast-follow.
11. **Mockup gate extended to ALL sprints:** every screen through Sprint 6 (test centre, paper player, AI-marked results, parent weekly email, email/password auth, devices/session limits) must be mocked and validated by Uday before development starts. Mockups: `mockups/launch-00..10`.

**Still open / assumptions to confirm:**
- Parent weekly progress email: scoped to S2 (assumed, not explicitly decided).
- Ch1 free *behind* the invite gate; public sees only the preview (assumed).
- Subjective-answer marking: AI vs CBSE marking scheme with Neha calibration (assumed AI-first).
- Exact chapter price ₹499 flat for all chapters (vs varying by chapter size).

---

## 11. Risks

- **Invite-only throttles the funnel** — intentional while catalogue is thin; guarded by the explicit review trigger (more classes ⇒ open up). Don't let exclusivity become an unexamined growth ceiling.
- **WTP untested** — ₹499 is a hypothesis until the Heritage cohort launch (S1) proves it. Pilot feedback was on a free product.
- **AI marking quality** — mis-marked board answers destroy trust fastest; requires Neha's calibration set + a "dispute/re-check" affordance.
- **Content leakage** — mitigated (not eliminated) by server-side gating; invite provenance makes abuse attributable.
- **Webhook reliability** — idempotent handler + periodic reconcile against Razorpay.
- **Minor-data compliance (DPDPA)** — launch blocker, not an afterthought.

---

### TL;DR
Premium, invite-only CBSE prep portal. One-time ₹499/chapter via Razorpay Orders (no subscriptions — massively simpler). Access = `entitlements` rows written only by the payment webhook or the admin panel (which replaces any teacher tier). Premium content moves server-side behind `has_access`. The durable anti-sharing moat = per-student progress + CBSE-pattern tests marked with real marking schemes. Sequence: S0 progress-sync → S1 founding-cohort launch (Ch2 @ ₹499 to the Heritage pilot) → S2 test engine + parent reports → S3 catalogue/bundles/open access.
