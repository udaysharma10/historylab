# HistoryLab — Session Handover (read this first)

**Last updated:** 2026-06-28 (Round 6) · **Branch:** `dev` · **Live:** https://historylab-kappa.vercel.app/ · **Latest main commit:** `f4cc6d5`
**Repo:** `github.com/udaysharma10/historylab` · **Local:** `/Users/udaysharma/Documents/Blostem/Claude_Projects/vedansh-history`

This is a Grade-10 CBSE History self-learning web app (NCERT "India and the Contemporary World"). Ch1 = Rise of Nationalism in Europe, Ch2 = Nationalism in India. See `PROJECT_CONTEXT.md` for full architecture, `CONTENT_REVIEW_PROCESS.md` for the review log.

**Reviewers:** Neha (CBSE History teacher — content accuracy + pedagogy) and Uday (product/UX). Working model: **section by section, two hats — (1) history/NCERT accuracy, (2) self-learning experience design** (no teacher in the room, so every card must carry its own scaffolding).

---

## THREE TRACKS

### 1. CONTENT TRACK (active — with Neha) — fixing content issues first, before theme/UX
Neha reviews **one section at a time**; we fix, deploy, she re-reviews.

**Status:** Neha has reviewed **Ch1 S1** + flagged a flowchart bug. Ch1 figure hotspots fully re-verified.
- ✅ Tightened S1 intro **13 → 9 cards**; fixed Sorrieu (fig-1) hotspots + tooltip-clipping bug.
- ✅ **ALL Ch1 figure hotspots re-verified at full resolution** (Round 4, commit `3c31ff6`). Notable fixes: fig-13 Bismarck/deputies were **swapped**; fig-20 Britannia was mid-ocean → **bottom-centre**; fig-10 women's gallery → **upper-left**; fig-4 German inscription → **white placard under the Tree of Liberty** (confirmed, no longer a guess); plus figs 3,7,8,11,12,15,17,18,19. Method: full-res PIL grid overlay (`scratchpad/annotate.py` — recreate, doesn't persist).
- ✅ **Fixed a systemic rendering bug** (commit `c2090b3`): a card with BOTH a rich body (flowchart/table/figure) AND an `inlineQuiz` showed ONLY the quiz — the steps/table/image were never rendered (this was Neha's "tap each step below — where?" bug). `NarrativeMode` now renders the full card body AND the quiz beneath it for non-text cards; `InlineQuizCard` hides its text block when empty. Also merged the two stranded intro text cards into their flowchart/table cards (S1 French measures, S2 Habsburg).

**OPEN — content track:**
- ✅ **ALL Ch2 figure hotspots re-verified at full resolution** (commit `f976c07`). Fixes: fig-7 Gandhi was on the wrong marcher; fig-10 Gandhi/Nehru/Azad all shifted (Gandhi's dot was on Nehru); fig-12 Bharat Mata symbols moved onto the actual hands/objects; fig-14a lion was on her dress; fig-13 onto the held image; fig-11 unity symbols → temple roundel; fig-3 soldier onto the soldier. (Ch2 field order: `label, description, x, y`.)
- **fig-6 (Allahabad Congress leaders) FLAGGED `NEEDS NEHA`** in code: grainy group photo, individual identities (Patel/Nehru/Bose) can't be verified from the image and current coords contradict the "extreme left/right" caption. Left unchanged pending Neha's authoritative key (don't guess — risk of mislabelling leaders).
- ✅ **Ch2 MCQ answer positions rebalanced** (commit `5f97cbd`) — inline quizzes + Practice-Quiz bank were "always B" (40/42 at option B); now 11 A / 10 B / 10 C / 11 D (options reordered, answer text preserved). Ch1 was already balanced. **Rebalance method:** `scratchpad/rebalance.py` (swaps two option literals + updates `correctIndex`; doesn't persist — recreate if needed). If you ADD Ch2 MCQs later, re-check the distribution.
- ✅ **Neha S1 round 2** (commit `e0e2136`): removed the **fig-1 "United States & Switzerland" hotspot** (not in NCERT — only that dot, nothing else); fixed the **Europe-1815 interactive map** dots that sat on water (Prussia, Spain, Ottoman) → moved their region centres onto land in `src/data/ch1/maps.ts`. NOTE: map dots = **centre of the `{x,y,width,height}` box** (`x+w/2, y+h/2`), `InteractiveMap.tsx`. The fig-3 *figure* Ottoman hotspot is at a similar low spot — nudge it too if Neha asks (left for now).
- Neha has **not** reviewed S2–S6 (Ch1) or any Ch2 content card-by-card yet. Ch1 S1 is the only section reviewed; she is moving forward to broader review now.
- The `FigureHotspotOverlay.tsx` tooltip flips **above** the dot when `spot.y >= 58` and clamps horizontally (so dots up to ~92 are fine).

**Neha's structural rulings — DO NOT RELITIGATE:**
1. Keep **flowcharts** even for parallel-list content (students grasp/remember them better).
2. Keep **tap-to-reveal + per-card highlights** (do not design down to passive students).
3. Tighten Sorrieu intro — ✅ done.

### 2. UI THEME TRACK (✅ DONE — "Cool Peach & Lavender" C2 live, commit `8edc6f7`)
Fraunces (display) + Inter (body) via `@fontsource-variable/*`. Current palette = **C2 (peach-led)**; the earlier navy "mature" theme was replaced after Uday found it too dark.
- **Theme tokens** (`src/styles/globals.css` `@theme`): deep plum ink `#3E3548`, **peach lead accent `#DC835F`** (brand "Lab", CTAs, ring), dusty lavender secondary `#7E72C2`, **peach→lavender bg `#FBEFE7→#F1ECFA`**, muted jewel section colours (`#C36B53 #5571B5 #C2893E #5C9368 #9B5C9A #3F8E84`), plum-tinted shadows; stars kept warm gold `#C99A3A`.
- **Section badges are SOFT TINTED chips** (`color+'1A'` wash, not solid fills) — the key "less heavy" move. HomePage has no top accent bar; ring is peach→lavender.
- All hardcoded old hexes migrated app-wide, including the **duplicated per-mode `SECTION_COLORS` maps** (figures/sources/flashcards/timeline/maps/exam) + `CHAPTER_SECTION_COLORS`. If you re-theme again, update those too.
- Mockup exploration in `mockups/home-refined*.html` (A warm-cream, B cool-gallery, C/C1/C2/C3 lavender-peach). **C2 is the shipped one.**
- Fixed: the breadcrumb was overlapping the hero (removed a negative margin).
- **Known pre-existing issue (NOT from theme work):** horizontal overflow at ~390px phone width. App is iPad-first; separate mobile-IA task.

### 3. UX / IA TRACK (PARKED — resume after content)
- ✅ Done: "Learning Modes" → **"Study Tools"**; section "Start Reading" top CTA; **Study Tools confirmed showing all 5 tiles** on Ch1.
- ✅ **Breadcrumb navigation** (commit `f4cc6d5`): the header back arrow is `navigate(-1)` (history-based), so Section→Quiz→back stranded Neha with no way to the chapter menu. Added breadcrumbs (`All Chapters · Chapter N · Section [· Quiz]`, with Chapter/Section as links) on **SectionModule** + **QuizMode**. Also fixed QuizMode "back to section" to the chapter-aware route `/chapter/:cid/section/:sid` (was hitting the `/section/:sid` redirect). **TODO if wanted:** extend the same breadcrumb to the 5 study-tool screens (Timeline/Maps/Figures/Flashcards/Exam) for full consistency.
- ✅ **Flashcard fixes** (`bfd3ff3` + `c09fe08`): (1) rating buttons were clipped on long answers — the flip card's two faces are `absolute inset-0` so they didn't grow a fixed-height container; `FlashcardSingle` now measures both faces (ResizeObserver) and sizes to the taller. (2) Card blended into the bg — added `border border-hist-line` + `shadow-card-hover`. **Flashcard modality = SM-2 spaced repetition** (`engine/spacedRepetition.ts`, persisted to localStorage `vedansh-history-flashcards`); "Review Due" is schedule-driven, "Practice All" = random 20, "Practice by Section" = filtered. Uday confirmed: **keep the modality as-is.**
- **Open:** "Topics" list still mixes "Practice Quiz" in with lesson topics; **mobile (~390px) horizontal overflow** (pre-existing, see Theme track); full screen-by-screen IA pass.

### INFRA / DEPLOY
- ✅ **`vercel.json` SPA rewrite** (commit `5533824`): deep links / refreshes (e.g. `/chapter/ch1/section/s1`) were 404ing on Vercel (no fallback to `index.html`); catch-all rewrite fixes it and lets AuthGuard handle expiry → login.
- **Custom domain `historylab.in` (PENDING UDAY — not code):** add in Vercel → Settings → Domains; DNS at registrar = A `@`→`76.76.21.21`, CNAME `www`→`cname.vercel-dns.com`. **Must also whitelist the new domain** in Supabase Auth (Site URL + Redirect URLs) and Google OAuth (authorized origins + the supabase `/auth/v1/callback` redirect) or login breaks. No repo changes needed.

---

## KEY METHODS & TOOLING (recreate as needed — scratchpad scripts do NOT persist)

**Clean figure extraction (canonical):**
```
pdfimages -png -p "<NCERT PDF>" out/img      # filenames: img-<page>-<obj>.png
# Keep the content images; SKIP template layers: 2480x3508 gray + 1894x1894 (QR) + tiny smasks.
# Match each image to its figure by NCERT PAGE NUMBER (figure->page map: pdftotext per page, grep '^Fig\.')
```
NCERT PDFs: `Claude_Projects/History/NCERT_Rise of Nationalism in Europe.pdf` and `.../Nationalism in India.pdf`.
(The old `pdftoppm` page-render+crop method baked page text/QR into figures — that was the root cause of "misaligned dots".)

**Hotspots:** `{x,y}` = **percent of the displayed image**. **Ch1** field order = `x, y, label`; **Ch2** = `label, description, x, y`. After ANY image swap, re-check coords (aspect-ratio changes shift them — that's how the fig-1 Christ/Shattered regression happened).

**Hotspot verification:** overlay a 10% coordinate grid + the current dots on each figure image with PIL, view it, read corrected positions. **Render at full size (~700–1000px wide per figure), not a tiny contact-sheet thumbnail.** Tooltip flips above when `spot.y >= 58`, so dots up to ~92 are fine.

**Local screenshots of the auth-gated app:**
1. Start dev server: `PATH="/Users/udaysharma/.nvm/versions/node/v20.20.0/bin:$PATH" npx vite --port 5180 --host`
2. Temporarily add a DEV-only bypass at the top of `AuthGuard.tsx` (gated to `import.meta.env.DEV`, activated by `?devpreview=1`), then **REMOVE it before committing**:
   ```tsx
   if (import.meta.env.DEV && new URLSearchParams(window.location.search).get('devpreview') === '1') {
     const mockProfile = { id:'dev', name:'Vedansh', email:'dev@example.com', avatar_url:null, role:'student', school:'Dev', class:'10', profile_completed:true, created_at:'' } as Profile
     return <AuthContext.Provider value={{ profile: mockProfile, signOut: async()=>{} }}>{children}</AuthContext.Provider>
   }
   ```
3. Screenshot: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=6000 --window-size=1280,2000 --screenshot=out.png "http://localhost:5180/chapter/ch1?devpreview=1"`
   (mobile: `--window-size=390,2400`). Routes: `/`, `/chapter/ch1`, `/chapter/ch1/section/s1`, `/chapter/ch1/{timeline,maps,figures,flashcards,exam}`. Narrative reading view is internal state (not URL-addressable). Node 20 required.

**Build / deploy:**
```
PATH="/Users/udaysharma/.nvm/versions/node/v20.20.0/bin:$PATH" npm run build   # tsc + vite
# Deploy: on dev -> commit -> git checkout main && git merge dev && git push origin main && git checkout dev
```
Commit co-author: `Co-Authored-By: Claude <noreply@anthropic.com>`.

---

## KEY FILES
- Content: `src/data/ch1/sections/section{1-6}-*.ts`, `src/data/ch2/sections/section{1-4}-*.ts`
- Figures (images + hotspots + analysis): `src/data/ch1/figures.ts`, `src/data/ch2/figures.ts`; images in `public/images/` (ch1) and `public/images/ch2/`
- Narrative card renderer (text/vocab/source/figure/exam-prep/timeline-ref/map-ref/**flowchart**/**table**): `src/components/narrative/NarrativeCard.tsx`
- Hotspot overlay (tooltip flip logic): `src/components/figure/FigureHotspotOverlay.tsx`
- Map markers: `src/components/map/InteractiveMap.tsx`
- Chapter home (Study Tools): `src/modules/HomePage.tsx` · Section page: `src/modules/SectionModule.tsx`
- Theme mockups: `mockups/*.html` (implemented). Theme tokens live in `src/styles/globals.css` `@theme`.
- Card types: `src/types/chapter.ts` (`FlowStep`, `TableData`, `NarrativeCard.steps`, `.table`)
- Reading view + quiz gating: `src/modules/NarrativeMode.tsx` (renders card body + inline quiz); `src/components/narrative/InlineQuizCard.tsx`. **Cards with both a rich body and a quiz now render both — don't revert to the quiz-only swap.**

## CONTENT WORK ALREADY SHIPPED (Neha review Batches 1–8 + figure round)
See `CONTENT_REVIEW_PROCESS.md` for the full log. Summary: NCERT-aligned headings, vocab-before-use, flowcharts (French measures, Napoleonic Code, Zollverein, Treaty of Vienna, Germany/Italy/Britain unification, German 1848 demands, Frankfurt, Satyagraha, 3 satyagrahas), tables (Habsburg, society, NCM participants), Marianne symbols, Greek-war/Balkans exam cards, MCQ answer rebalance; Ch2 WWI-to-chapter-start + Rowlatt reframe + martial law + Jallianwala/Dyer figures; ALL 35 figures re-extracted clean + hotspots remapped; "Study Tools" relabel; section "Start Reading" CTA reorder.
