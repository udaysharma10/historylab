# Design Language V2 — "The Workspace" (Phase 0 brief)

**Origin:** Neha's inspiration screenshot (2026-07-26, external AI tool) — direction accepted by Uday;
this brief translates it into rules for OUR product (one-time chapter purchase, mock-test
differentiator, mobile-heavy audience). Mockups: `mockups/nl-01-section-page.html` (like-for-like
with the inspiration) + `nl-02-chapter-home.html`. Supersedes the visual half of decision #34;
the structural laws below carry forward unchanged.

## 1. The shell (the big structural change)

Three columns on desktop, one persistent identity:

| Zone | Width | Role |
|---|---|---|
| **Sidebar** (left) | 232px | The chapter workspace switchboard — always visible, every mode one click away |
| **Main pane** | fluid | The current activity (overview, a section, a tool, a test) |
| **Rail** (right) | 300px | Orientation: progress + quick actions + downloads. Never primary content |

**Chapter = workspace.** The sidebar is chapter-scoped (like a "course"). Top of sidebar:
`‹ All Chapters` link + the current chapter pill.

### Sidebar items (v1 — only destinations that exist)
1. **🏠 Overview** — chapter home: hero, sections list, unlock band (preview)
2. **🎯 Mock Tests** — the Test Centre (paid differentiator gets a first-class slot)
3. **✏️ Practice** — untimed: section quizzes, source practice, NCERT questions (kills the old two-doors problem: sidebar vocabulary IS Practice vs Mock Tests)
4. **📅 Timeline** · **🗺️ Maps** · **🃏 Flashcards** · **🖼️ Figures** — tools
5. *(roadmap, greyed with "soon" only when we build them: My Progress, Notes)*
6. **Bottom card:** preview users → "Unlock this chapter · ₹199" (NEVER subscription-speak); paid users → ⭐ stars total

### How panes change (Uday's question)
- Clicking a sidebar item swaps the **main pane** (client-side route under `/chapter/:cid/...`), sidebar stays put, active item highlighted.
- A **section page is a child of Overview**: opened from the sections list, renders in the main pane with Overview still highlighted + breadcrumb inside the pane. Same for a paper inside Mock Tests.
- Full-screen immersive states (narrative reading, paper player) may hide the shell entirely — an exam room has no sidebar. Shell returns on exit.

### Mobile (≤768px — most students)
- Sidebar → **top app bar + slide-in drawer** (hamburger). Chapter pill in the bar.
- Rail → stacks **below** the main pane (progress card first).
- Same components, one column. No desktop-only features.

## 2. Banner images (Uday's question)
**Use the real NCERT artwork we already ship** (21 ch1 + 16 ch2 figures in `public/images/`) as
hero banners with a left-to-right cream fade mask (text sits on the solid side). S1 → Sorrieu's
dream (`fig-01-sorrieu`); chapter-level → the chapter's signature painting. Authentic, already
teacher-approved, zero cost, and the banner doubles as content. AI generation (available via MCP)
is the fallback for future chapters without strong art — Neha curates any generated piece.

## 3. Tokens
- **Type:** Fraunces (display) + Inter (UI) — unchanged, keeps landing continuity.
- **Ink:** deep plum-navy `#2E2A3B`; body `#6E6478`; muted `#A1969F`.
- **Accent:** punchier orange `#E8551F` (inspiration's energy), soft `#FDEAE0`; CTA fill `#C05F35` stays for payments.
- **Test identity:** violet `#7E72C2` family — unchanged, everywhere "test yourself" appears.
- **Surfaces:** cream page `#FBF3EC→#F6EFF7` gradient, white cards, radius 16, soft plum shadows.
- **States:** done green `#5C9368`; locked = greyscale + 🔒; topic rows get 3px colored left border.

## 4. Laws that survive the language (non-negotiable)
1. **One-fact-once** — the rail ring is THE chapter progress; no duplicate bars/chips (the inspiration shows ring + 9/9 + Completed — we render the fact once).
2. **Honest completion** — quiz completes a section; copy names the missing unit ("4 of 5 · quiz left").
3. **Mock Tests visibility** — sidebar slot + rail card; never buried in tools again.
4. **"MCQ marks"**, never "objective". No self-marking (decision #32). No subscription wording.
5. **Paywall surfaces** (decision #27/28, purchase sheet) restyle but keep their structure & copy rules.
6. Preview users: locked sections/tools visible-but-locked (discovery), unlock card in sidebar.

## 5. Rollout
- **Phase 1 (now):** nl-01 + nl-02 mockups, desktop + 390px renders → Neha compares against her inspiration → deliberate → lock language.
- **Phase 2:** build shell components + tokens once; port section page + chapter home.
- **Phase 3:** propagate to quiz, Test Centre, player, results mechanically. Landing seam review before public launch.
- **Parked (roadmap, need content/build):** Notes PDF per chapter, My Progress page, quote-band curation per section (cheap — Neha supplies one quote per section).
