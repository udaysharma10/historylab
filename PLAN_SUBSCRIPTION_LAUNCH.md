# HistoryLab → Open-Access CBSE Prep Portal — Launch Plan

**Created:** 2026-06-28 · **Revised:** 2026-07-02 (freemium subscriptions → premium one-time, invite-only) · **Revised again 2026-07-07 after Neha's review — INVITE-ONLY AND ₹499 ARE DEAD: open access for all CBSE students, ₹199 launch price (₹499 list), test engine paid-only, human examiner marking as an add-on.**
**Builds on (do not duplicate):**
- `BIGGER_PICTURE.md` — content roadmap (chapters/books/classes). Its original freemium/subscription pricing is **superseded** by this doc.
- `PLAN_AUTH_AND_ANALYTICS.md` — Supabase auth (DONE) + server-side progress sync (its Phase D, *planned, NOT yet implemented*).

---

## 0. The model (decided 2026-07-02; revised 2026-07-07 per Neha)

| Dimension | Decision |
|---|---|
| **Positioning** | **India's CBSE prep portal — premium quality at a mass-market price.** Target = all-India CBSE Class 10 (~2M+ board candidates/yr), not just tier-1 metro schools. Neha's ruling: scale over exclusivity. Teacher credibility fronts the brand. |
| **Access** | **OPEN TO ALL. No invite gate, no waitlist, no invite codes at all** (killed 2026-07-07). Landing page → "Start Chapter 1 free" → open signup. |
| **Pricing** | **₹199 launch/early price per chapter, against a ₹499 list price** (shown struck through). One-time, lifetime access, no subscriptions. Whole-book bundle later, depending on uptake. |
| **Free tier** | Ch1 **learning modes** free for every signed-up student (narrative, figures, maps, timeline, flashcards). **Practice tests are NOT in the free tier** — the test engine comes only with chapter purchase. Landing page shows a static sample of a marked answer instead (zero marking cost). |
| **Test marking** | **Two tiers per paper:** (1) **AI marking included** with the chapter — instant, per-point against the CBSE scheme, unlimited attempts. (2) **Human "CBSE Examiner" marking as a paid add-on per paper** (Neha reviews with AI pre-marking in her queue; 48–72h turnaround; price TBD, mocked at ₹149). Every human-marked paper feeds AI calibration. |
| **Teachers** | Unchanged — no teacher role; admin grants/revokes chapter access FOC for any account. |
| **Anti-sharing** | Unchanged — personalised study state (progress, SM-2, attempts, marks, percentiles) + light 2-device session limits. |
| **Payer** | Unchanged — parent pays (DPDPA consent); signup captures **guardian email** as a first-class field (product-review fix #1). Student→parent purchase handoff ("Ask your parent to unlock") is a core conversion mechanic (fix #2). |

### ⚠️ The architectural truth (unchanged)
All chapter content currently ships in the client JS bundle — anyone can read "premium" chapters from DevTools. **The paywall is not a UI toggle:** premium content must be served on demand from the backend, gated by a server-checked entitlement. This remains the backbone of the plan. (The Round-8 client-side email allowlist `src/lib/chapterAccess.ts` is a stopgap for the student trial; it is **retired** once server entitlements land.)

---

## 1. Target architecture

```
React/Vite (Vercel)  ← landing page w/ preview + waitlist
   │  anon key, RLS-scoped reads
   ▼
Supabase
   ├── Auth (Google now; email/password in S2) — open signup, guardian email captured
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
-- (2026-07-07) invites + waitlist tables DELETED — access is open, no gate.

-- Human examiner marking add-on (one row per purchased review of one attempt)
create table examiner_reviews (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null,                  -- references the test attempt
  user_id uuid references profiles(id),
  purchase_id uuid references purchases(id), -- the add-on payment
  status text not null,                      -- 'queued' | 'in_review' | 'returned'
  examiner_id uuid references profiles(id),  -- Neha (admin)
  returned_at timestamptz,
  created_at timestamptz default now()
);
-- products now includes marking add-on SKUs (e.g. 'examiner-review') alongside chapter SKUs.

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

## 5. Access flow (open — revised 2026-07-07)

- **Open signup:** landing page → "Start Chapter 1 free" → Google sign-in → profile (student name, class) + **guardian email (required)** + DPDPA parental-consent → straight into Ch1. No codes, no waitlist, no gate.
- Guardian email is the channel for: GST invoices, purchase links from the student→parent handoff, weekly reports (S2/6), new-device alerts.
- **Student→parent purchase handoff:** at any paywall the student can tap **"Ask your parent"** → WhatsApp/email to the guardian with the student's progress + a one-tap checkout link. This is the primary conversion mechanic.
- **DPDPA:** parental-consent capture at signup (guardian email + consent checkbox, timestamped); no behavioural ads/tracking of minors; privacy-friendly analytics only.

## 6. Admin panel (backend flexibility — Uday's requirement)

- Create accounts directly.
- **Grant / revoke chapter entitlements for any account** (`admin_grant` rows with a `note`) — this is how teachers, pilot cohorts, and FOC consortiums get access. No teacher role exists.
- View purchases + payment events; trigger refund flow.
- **Examiner queue (new):** list of purchased `examiner_reviews` with the AI pre-marking shown; Neha adjusts per-point marks/comments and returns the paper. Queue depth + turnaround SLA visible.

## 7. CBSE practice-test engine (the launch differentiator — PAID tier only)

Per-chapter **CBSE-pattern papers**: same question typology and marking scheme as the board (objective/MCQ 1-mark, 2/3-mark short answers, 5-mark long answers, source-based and competency/case-based questions), timed attempts, typed answers. **Included with chapter purchase — not available on the free tier.** The landing page shows a static sample marked answer instead.

**Two marking tiers per paper (decided 2026-07-07):**
1. **AI marking — included.** Instant, per-point against the CBSE marking scheme, marker's notes, model answers, unlimited attempts. Calibrated by Neha's spot-check set; "request re-check" queues to admin.
2. **CBSE Examiner marking — paid add-on per paper** (price TBD; mocked ₹149). Neha reviews the submitted paper *starting from the AI pre-marking* (≈5 min/paper, not 20), adjusts marks, adds examiner feedback; returned in 48–72h. Every human-marked paper becomes AI calibration data. **Public positioning (2026-07-11): "the portal has onboarded a Senior CBSE Examiner (20 yrs)" — Neha is NOT named or shown; NO public capacity/slot messaging** (internal queue management only; pivot if volume grows — "a good problem to have").

- Attempt history, per-section mastery, percentile within cohort (once N ≥ 20).
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
| **S1 — Payments & paywall (private)** | Money works end-to-end | Schema (§2) + RLS · **open signup + guardian email + consent** · **Ch2 content server-side + `get-chapter`** · Razorpay one-time orders + webhook (₹199 launch / ₹499 list) · purchase screen + **ask-your-parent handoff** · admin panel (accounts, grants) · ToS/Privacy/Refund · landing page (open funnel) | Verified in test mode; NOT public yet (launch gated on test engine) |
| **S2 — Test engine → LAUNCH** | CBSE prep portal goes live | **Test engine (§7): paper player, AI marking, results/feedback** · **examiner-review add-on (purchase + Neha's queue)** · then **PUBLIC LAUNCH** · parent progress email (weekly) · email/password auth · session/device limits (2 devices) · analytics funnel (visit→signup→purchase) | Launch: open access, Ch1 free learning, ₹199 chapters w/ tests |
| **S3 — Growth** | Catalogue + loops | Ch3–5 content (BIGGER_PICTURE Phase D) · book-bundle SKU **if uptake supports it** · shareable score cards + gamification · CMS for Neha · more classes | Scale path |

**Effort:** S0+S1 ≈ a few focused weeks (heavy infra exists; the work is entitlements + content-server move + one-time payment flow + admin panel). The test engine (S2) is the biggest net-new build — content authoring (papers + marking schemes) is the long pole, not code. **Launch = end of S2's test-engine work** (~sprint 5–6 of the 7-sprint pipeline).

### 9.1 Sprint plan v2 (LOCKED 2026-07-12 — supersedes the sprint sketch above where they differ)

One sprint ≈ one focused build week + Uday's review. Everything on `dev`; Vercel preview per sprint; merge to `main` only on approval.

| # | Sprint | Builds | Exit test |
|---|---|---|---|
| **0** | **Personalised state** | Migrations: `student_progress`, `flashcard_state` (SM-2), `activity_logs` (chapter-aware, RLS). Zustand stores → offline-first sync. One-time migration of pilot students' localStorage progress (keep-highest merge). | Sign in on a second device → progress + flashcard schedule follow. Pilot students lose nothing. |
| **1** | **Access & admin** | Migrations: `products`, `purchases`, `entitlements`, `examiner_reviews`, `class_interest`, `parent_updates` (newsletter) + RLS + `has_access()`. Signup rework: guardian email (required) + DPDPA consent, student/parent toggle. Admin panel v1: create accounts, grant/revoke chapters, purchases view. Retire the Round-8 client allowlist (admin grants replace it). | Onboard a new cohort + grant Ch2 entirely from admin UI; a granted account sees Ch2 exactly like Ch1. |
| **2** | **Paywall + public face** | Ch2 content → `chapter_content` (server-side) + `get-chapter` Edge Function; client lazy-load + locked-chapter UI + purchase sheet + **ask-your-parent handoff** (WhatsApp/email to guardian w/ progress + checkout link). **Landing page (v8) built as the public React route** (`/` signed-out) + class-interest + newsletter captures. ToS/Privacy/Refund pages. Domain historylab.in wired (Vercel + Supabase auth + OAuth origins). | DevTools cannot read Ch2 without entitlement; landing live on historylab.in capturing emails. |
| **3** | **Money (test mode)** | `create-order` + `razorpay-webhook` (signature-verified, idempotent) + purchase/success/pending states + refund→revoke flow + account page (chapters, invoices, examiner orders). Full test-mode E2E. | Test-mode rupee → webhook → entitlement → content, zero manual steps; refund revokes. |
| **4** | **Test engine core** | Server-side `papers`/`questions` + `attempts`/`answers` schema; paper player (server timer, autosave, palette, submit); objective auto-marking; Test Centre + attempts history. **Paper authoring format + admin upload so Neha starts authoring THIS sprint** (her pace is the launch long pole). | A full Ch2 paper is attemptable end-to-end with objective marks; Neha has authored ≥1 paper in the format. |
| **5** | **Marking** | `mark-answer` Edge Function (Claude vs marking scheme, per-point), results/feedback UI (per-point ✓/✗, marker's notes, model answers, re-check queue), Neha calibration set + adjudication in admin. **Examiner add-on**: ₹149 purchase → `examiner_reviews` queue → Neha's AI-pre-marked review UI → returned paper w/ examiner badge. | AI marks match Neha's marking on the calibration set to agreed tolerance; one examiner review completes the full loop. |
| **6** | **Hardening → LAUNCH** | Email/password auth; 2-device session limits + new-device alerts; parent weekly email (provider: Resend/Postmark); analytics funnel (privacy-friendly); SEO/OG + landing prerender; live Razorpay keys; real testimonial quotes in. **PUBLIC LAUNCH.** | A stranger can find, sign up, study free Ch1, parent pays ₹199, student sits a marked paper — unassisted. |

**Post-launch immediate:** landing iteration round with Neha's parked feedback · hero-image debt (illustrated story-card headers + try-a-question hook in the app) · bundle SKU per uptake · score cards/gamification (S3).

**External gates (Uday/Neha, parallel):** Teknomatics Razorpay KYC (gates Sprint 3 live keys — start NOW) · GST readiness · domain DNS access (gates Sprint 2) · Neha's paper authoring from Sprint 4 + marking-calibration sessions in Sprint 5 · 2 real student quotes (Sprint 6).
**Access Claude needs:** Supabase project (CLI access token or Uday runs migrations), Razorpay test keys (Sprint 3), Vercel env vars, email-provider key (Sprint 6).

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

**Closed 2026-07-07 (round 4 — Neha's review; SUPERSEDES rounds 1–3 where they conflict):**
12. **OPEN ACCESS — invite-only is dead.** No gate, no waitlist, no invite codes at all. Rationale: all-India CBSE TAM (~2M+ Class 10/yr) over metro exclusivity; obscurity is already the gate at launch; the test engine's flywheels (percentiles, score sharing) need an open door. Accepted trade-off: this is a one-way door (can't gracefully re-gate).
13. **₹199 launch/early price, ₹499 list** (struck through). Neha's scale argument accepted: elasticity across mass CBSE ≫ the 2.5× buyers needed to match ₹499 revenue; the moat is the cohort, not the margin.
14. **Test engine is paid-only** — no practice tests in the free tier. Free Ch1 = learning modes. Landing shows a static sample marked answer (zero marking cost).
15. **Two-tier marking:** AI marking included with the chapter; **human "CBSE Examiner" marking = paid add-on per paper** (Uday's concept). Neha marks from the AI pre-marking in an admin queue; 48–72h SLA.
16. Product-review fixes #1 (guardian email at signup) and #2 (ask-your-parent handoff) are launch requirements.

**Closed 2026-07-11 (round 5 — Neha's positioning review):**
17. **Brand positions at the SUBJECT level, offer at the class level.** historylab.in = "the home of school History" (all levels, Neha's vision); the concrete offer stays "Live now: CBSE Class 10." No class number in the hero H1. Landing gets a **classes roadmap section** (Class 10 live → Class 9 next → Classes 6–8 coming) with per-class **"notify me" email capture** (`class_interest` table — demand list, not a gate).
18. **Expansion is level-first, not subject-first:** next catalogue steps after Ch3–5 are other classes' History (9, then 6–8) — supersedes BIGGER_PICTURE Phase E's subject expansion while the brand is historylab.in. Multi-subject remains a someday-option under a different brand.
19. Inner-page mockups approved "for now" by Neha; her final validation happens on the real built pages (Vercel preview during S1/S2).

**Closed 2026-07-11 (round 6 — landing/positioning, Uday + Neha):**
20. **The human examiner is THE differentiator and is positioned prominently page-wide** (hero credential, dedicated band, third pricing card) — reversing the earlier "demote to a strip" call. Framing: one marking story, two speeds — instant marking *calibrated by* the examiner; personal review *by* the examiner (₹149/paper).
21. **Anonymity:** Neha is not named/shown anywhere (she is a serving head history teacher). Public identity = **"Senior CBSE Examiner, 20 years' experience, onboarded by the portal."**
22. **No public capacity/slot messaging** — no counters, no "sold out" states. Internal queue management; pivot if volumes grow.
23. Landing layout = **v5/v6 band grammar** (Uday: "layout looks better"). Header/theme temperature clash flagged → v6 ships three header variants (white / all-warm / adaptive) for Uday+Neha to pick.

**Closed 2026-07-12 (round 7 — FREEZE, Uday):**
24. **Mockup gate CLOSED.** Landing = **v8 as-is** (white header; illustrated problem trio; ChatGPT iPad hero; examiner band; roadmap; 3-card pricing). All inner-page mockups (launch-01..10) frozen as the build reference. **Neha has further landing feedback — parked deliberately; the landing iterates again post-build** (it's a React page then; copy/layout changes are cheap). Theme variants (warm/adaptive) also parked.
25. **Development starts.** Sprint plan v2 in §9.1 below is the execution order.

**Still open / assumptions to confirm:**
- Examiner-marking add-on price (mocked ₹149/paper).
- **Hero-image debt (Uday's call, 2026-07-12):** landing v8 hero uses the ChatGPT-generated iPad image showing an *aspirational* story-card UI (illustrated header, "Try a question" hook, story-progress bar) that the app does not have yet. Treat that image as a **design brief**: the narrative view should gain illustrated section-header images + an inline "try a question" hook so the product matches its own landing page (candidate for Sprint 2 polish or S3).
- Parent weekly progress email: scoped to S2 post-launch (assumed).
- ₹199 flat for all chapters (vs varying by chapter size).
- When/whether shareable score cards ship (S3 assumed).

---

## 11. Risks

- **WTP untested** — ₹199 is still a hypothesis until real sales. Pilot feedback was on a free product.
- **Free-tier cost exposure is now bounded** (no AI marking on free tier), but open access + free Ch1 means hosting/support scale with signups — watch Supabase tier limits.
- **AI marking quality** — mis-marked board answers destroy trust fastest; requires Neha's calibration set + the re-check affordance. Examiner add-on partially self-corrects this (human review of the worst cases).
- **Examiner capacity** — Neha is a single human with a ceiling (~25–40 papers/week even AI-assisted). Per her call (2026-07-11) there is NO public slot/capacity messaging — so the queue must be watched internally and the 48–72h SLA protected by throttling marketing pushes, extending SLA comms, or onboarding a second examiner if volume grows.
- **Content leakage** — mitigated (not eliminated) by server-side gating.
- **Webhook reliability** — idempotent handler + periodic reconcile against Razorpay.
- **Minor-data compliance (DPDPA)** — launch blocker, not an afterthought.

---

### TL;DR
Open-access CBSE prep portal for all of India. Free Ch1 learning modes for everyone; **₹199 launch price (₹499 list) one-time per chapter** unlocks content + the board-pattern test engine with **AI marking included**; **human CBSE-Examiner marking is a paid add-on per paper** (Neha, AI-assisted, 48–72h). No subscriptions, no invite gate. Entitlements written only by the payment webhook or admin panel; premium content + papers live server-side behind `has_access`. Sequence: S0 progress-sync → S1 payments/paywall (private) → S2 test engine → **public launch** → parent reports/auth/limits → S3 catalogue/bundles/score cards.
