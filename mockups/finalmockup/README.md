# Final Mockups — LOCKED 2026-07-26 (decision #38)

The design language, altitude navigation and content flow are LOCKED. Phase 2 builds from these.

| File | Covers | Status |
|---|---|---|
| `nl-03-flow.html` | Chapter home (Overview) · Section page · Topic reader (card-by-card) — working hash-router demo of the three altitudes | **LOCKED** |
| `landing-v8.html` | Public landing page | **FROZEN** (since 2026-07-12) |

Canonical rules: `../../DESIGN_LANGUAGE_V2.md` (shell anatomy, tokens, laws) + plan §10 decisions #37 (sitemap) and #38 (lock).

Resolved by the lock, as rendered in nl-03:
- Hero: LIGHT chip hero on chapter home, DARK cinematic hero on section pages.
- Sequential section locking: NO — all sections open; "recommended next" via the stepper's `now` state.
- Gamification (XP/badges/goals): post-launch roadmap, not launch.
- Section quiz lives in the section sheet (Practice & Explore zone); rail carries Mock Test + Flashcards only.

Neha's remaining design notes are MINOR, deferred to page-by-page polish AFTER the build (her call, closing the loop).
Serve: `cd mockups && python3 -m http.server 8877` → http://localhost:8877/finalmockup/nl-03-flow.html
