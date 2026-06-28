# HistoryLab — Session Handover (read this first)

**Last updated:** 2026-06-28 · **Branch:** `dev` · **Live:** https://historylab-kappa.vercel.app/ · **Latest main commit:** `cab337e`
**Repo:** `github.com/udaysharma10/historylab` · **Local:** `/Users/udaysharma/Documents/Blostem/Claude_Projects/vedansh-history`

This is a Grade-10 CBSE History self-learning web app (NCERT "India and the Contemporary World"). Ch1 = Rise of Nationalism in Europe, Ch2 = Nationalism in India. See `PROJECT_CONTEXT.md` for full architecture, `CONTENT_REVIEW_PROCESS.md` for the review log.

**Reviewers:** Neha (CBSE History teacher — content accuracy + pedagogy) and Uday (product/UX). Working model: **section by section, two hats — (1) history/NCERT accuracy, (2) self-learning experience design** (no teacher in the room, so every card must carry its own scaffolding).

---

## THREE TRACKS

### 1. CONTENT TRACK (active — with Neha) — fixing content issues first, before theme/UX
Neha reviews **one section at a time**; we fix, deploy, she re-reviews.

**Status:** Only **Ch1 S1 ("Introduction: Sorrieu's Vision")** reviewed so far.
- ✅ Tightened S1 intro **13 → 9 cards** (merged hook+1848, Meet-Sorrieu into the figure card, Who-Marches + Nations-didn't-exist; dropped redundant "Why Sorrieu" card, its quiz moved to the Utopian vocab card). All exam content + vocab-before-use order preserved.
- ✅ Fixed Sorrieu (fig-1) hotspots (Christ, Shattered) + the tooltip-clipping bug.

**OPEN — hotspot accuracy (do this next):**
- A **global popup-clipping bug** was fixed in `FigureHotspotOverlay.tsx`: the tooltip now flips **above** the dot when `spot.y >= 58` and clamps horizontally (was always below → clipped for low dots).
- Neha has flagged mis-placed dots on figs **1, 2, 4, 5** (now fixed). **fig-4 "German inscription" (h4-4) is a BEST-GUESS at (82,40) — Neha must confirm or we remove that single dot.**
- **RECOMMENDED NEXT ACTION:** proactively **re-verify EVERY remaining figure's hotspots at FULL resolution** (all Ch1 figs 3,6–20 + all Ch2) — don't wait for Neha to catch each. **Critical: verify at full image resolution, NOT small thumbnails** (thumbnail checks missed the errors Neha caught).
- Neha has **not** reviewed S2–S6 (Ch1) or any Ch2 content card-by-card yet.

**Neha's structural rulings — DO NOT RELITIGATE:**
1. Keep **flowcharts** even for parallel-list content (students grasp/remember them better).
2. Keep **tap-to-reveal + per-card highlights** (do not design down to passive students).
3. Tighten Sorrieu intro — ✅ done.

### 2. UI THEME TRACK (PARKED — resume after content)
Uday found the current parchment+Playfair theme "boring"; wants CutiePaw's warmth but **mature, not cute**.
- Mockups in `mockups/`: `home-cutiepaw-theme.html` (too cute — rejected), **`home-mature.html` + `section-mature.html`** (refined: **Fraunces** serif wordmark, warm cream `#FBF5EE→#F4E8DA`, navy `#2A2750` text, **gold `#C0911F` + indigo `#5B5BD6`** accents, dropped pink/coral, kept the 6 section colours).
- CutiePaw palette source: `/Users/udaysharma/Documents/cutiepaw/apps/web/tailwind.config.ts` (navy `#2D2A5C` + peach family + indigo/pink accents, Pacifico).
- **Open before locking:** confirm wordmark font (Fraunces vs Spectral/Newsreader), gold shade, background warmth. Then apply locked theme to the real app. NOT applied to app code yet.

### 3. UX / IA TRACK (PARKED — resume after content)
- ✅ Done: chapter-level "Learning Modes" → **"Study Tools"** (plain tile names); section page **"Start Reading" moved to a prominent top CTA**.
- **Open:** verify chapter-home "Study Tools" tile count (Ch1 should show 5: Timeline/Maps/Figures/Flashcards/Exam — a screenshot looked like only ~2 rendered; confirm on live); "Topics" list mixes "Practice Quiz" in with lesson topics; full screen-by-screen IA + **mobile** pass (use the screenshot method below).

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
- Theme mockups: `mockups/*.html`
- Card types: `src/types/chapter.ts` (`FlowStep`, `TableData`, `NarrativeCard.steps`, `.table`)

## CONTENT WORK ALREADY SHIPPED (Neha review Batches 1–8 + figure round)
See `CONTENT_REVIEW_PROCESS.md` for the full log. Summary: NCERT-aligned headings, vocab-before-use, flowcharts (French measures, Napoleonic Code, Zollverein, Treaty of Vienna, Germany/Italy/Britain unification, German 1848 demands, Frankfurt, Satyagraha, 3 satyagrahas), tables (Habsburg, society, NCM participants), Marianne symbols, Greek-war/Balkans exam cards, MCQ answer rebalance; Ch2 WWI-to-chapter-start + Rowlatt reframe + martial law + Jallianwala/Dyer figures; ALL 35 figures re-extracted clean + hotspots remapped; "Study Tools" relabel; section "Start Reading" CTA reorder.
