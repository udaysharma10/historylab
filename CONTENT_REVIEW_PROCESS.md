# HistoryLab — Content Review & Iterative Improvement Process

**Created**: 2026-03-31
**Reviewer**: Neha Sharma (CBSE History Teacher)
**Implementer**: Claude (via Uday)
**Tracking**: Google Sheet (shared with all parties)

---

## Process Overview

```
Neha reviews section → Adds feedback rows to Sheet → Uday shares with Claude →
Claude implements batch → Marks rows Done → Neha re-reviews → Next iteration
```

### Iteration Cycle
1. **Neha reviews** one section at a time (don't try to review everything at once)
2. **Adds feedback** to the Google Sheet — one row per issue
3. **Uday triggers implementation** — shares the sheet or pastes the feedback
4. **Claude implements** all pending items for that section in one batch
5. **Status updated** to "Done" with notes
6. **Neha re-reviews** the implemented changes — may add new rows
7. **Repeat** until section is approved

### Priorities
- **Critical**: Factually wrong, confusing, or missing exam-critical content — fix immediately
- **High**: Wrong flow order, vocabulary timing, emphasis missing — fix in current batch
- **Medium**: Tone improvements, additional examples, better framing — fix in next batch
- **Low**: Nice-to-have, stylistic preferences — fix when convenient

---

## Google Sheet Structure

### Sheet 1: "Content Review"
This is the main review sheet — one row per feedback item.

| Column | Header | Description | Example Values |
|--------|--------|-------------|----------------|
| A | **Review ID** | Auto-increment (R001, R002...) | R001 |
| B | **Date** | When feedback was added | 2026-03-31 |
| C | **Reviewer** | Who gave the feedback | Neha |
| D | **Chapter** | Which chapter | Ch1 / Ch2 |
| E | **Section** | Which section number | S1 / S2 / S3... |
| F | **Subsection** | Which subsection (if known) | "Introduction: Sorrieu's Vision" |
| G | **Card Title or Position** | Which card — by title or position number | "Card 4 - Shattered Symbols" or "3rd card after vocabulary" |
| H | **Issue Type** | Category of feedback | See Issue Types below |
| I | **Current Content** | What it says/does now (paste or describe) | "Absolutist vocabulary appears after it's used" |
| J | **Expected / Should Be** | What Neha wants it to say/do | "Move Absolutist vocab BEFORE the card mentioning absolutist institutions" |
| K | **CBSE Exam Relevance** | Is this tested in Board exams? | "Yes — Absolutist is a 1-mark definition question" |
| L | **Priority** | How urgent | Critical / High / Medium / Low |
| M | **Status** | Implementation state | Pending / In Progress / Done / Won't Fix |
| N | **Implementation Notes** | Claude's notes after fixing | "Moved vocab card from position 6 to position 4" |
| O | **Batch** | Which implementation batch | Batch 1 / Batch 2... |

### Issue Types (Column H)
| Code | Meaning | Example |
|------|---------|---------|
| `vocab-timing` | Vocabulary card appears after the term is used | Absolutist defined after "absolutist institutions" mentioned |
| `flow-order` | Cards are in wrong sequence | Context card should come before the event card |
| `content-wrong` | Factual error or incorrect information | Wrong date, wrong name, wrong event description |
| `content-missing` | Important content is missing | No mention of a key event, figure, or concept |
| `emphasis-missing` | Key exam point not highlighted enough | A frequently tested fact is buried in text |
| `emphasis-excess` | Too much emphasis on minor point | Low-priority detail gets a full card |
| `tone-textbook` | Reads like a textbook, not a teacher | Passive voice, formal academic language |
| `tone-oversimplified` | Too dumbed down, loses nuance | Important complexity removed |
| `exam-tip-needed` | Needs an explicit exam preparation tip | "This is asked every year" type guidance |
| `exam-tip-wrong` | Exam tip is incorrect or misleading | Wrong marks allocation or question type |
| `quiz-issue` | Inline quiz has wrong answer, bad options, or poor timing | Distractor is implausible, answer is debatable |
| `figure-issue` | Figure analysis is wrong, incomplete, or misleading | Hotspot description doesn't match image |
| `add-card` | New card needed | A concept needs its own card, not a passing mention |
| `remove-card` | Card should be removed | Redundant or off-topic content |
| `split-card` | Card is too long, should be two cards | Wall of text that should be broken up |
| `merge-cards` | Two cards should be combined | Two tiny cards that work better as one |
| `highlight-wrong` | The "Remember This" box has wrong content | Key takeaway doesn't match the card |
| `connection-missing` | Missing link to another section or chapter | Should reference Ch1 concept or earlier section |

### Sheet 2: "Section Sign-Off"
Track which sections are reviewed and approved.

| Column | Header |
|--------|--------|
| A | **Chapter** |
| B | **Section** |
| C | **Total Cards** |
| D | **Review Status** | Not Started / In Review / Changes Requested / Approved |
| E | **Reviewer** |
| F | **Last Reviewed Date** |
| G | **Open Issues** | Count of Pending items from Sheet 1 |
| H | **Notes** |

### Sheet 3: "Vocabulary Audit"
Dedicated sheet for tracking vocabulary placement — Neha's #1 concern.

| Column | Header |
|--------|--------|
| A | **Chapter** |
| B | **Term** |
| C | **First Used In** | Card where the term first appears in narrative text |
| D | **Defined In** | Card where the vocabulary definition appears |
| E | **Correct Order?** | Yes = definition comes before/at first use. No = definition comes after. |
| F | **Action Needed** | Move vocab card / Add inline definition / OK as is |
| G | **Status** |

### Sheet 4: "Cross-Chapter Consistency"
Track connections between chapters.

| Column | Header |
|--------|--------|
| A | **Topic** |
| B | **Ch1 Reference** | Where in Ch1 this topic appears |
| C | **Ch2 Reference** | Where in Ch2 this topic appears |
| D | **Connection Made?** | Is there an explicit cross-reference card? |
| E | **Action Needed** |

---

## How Neha Should Fill the Sheet

### Do's
- **One issue per row** — don't combine multiple problems in one row
- **Quote the actual text** in "Current Content" — helps me find the exact card
- **Be specific** about what should change — "move X before Y" is better than "fix the order"
- **Mark CBSE relevance** — helps me prioritize (exam-tested content gets fixed first)
- **Review one section at a time** — finish S1 before moving to S2

### Don'ts
- Don't worry about card IDs or code — card title or position number is enough
- Don't try to rewrite the card yourself — just describe what's wrong and what you want
- Don't hold back feedback — even "tone feels off" is valid, I can figure out how to fix it
- Don't review Section 2 until Section 1 is approved — prevents rework

---

## Implementation Batches

When Uday shares feedback, I implement in batches:

**Batch scope**: All pending items for ONE section (e.g., all Ch1 S1 feedback)

**Batch process**:
1. Read all pending rows for the section
2. Plan changes (some feedback items may conflict — I'll flag these)
3. Implement all changes in the section file
4. Update highlight boxes if needed
5. Update inline quiz placement if needed
6. Build check (TypeScript + Vite)
7. Mark all rows as "Done" with implementation notes
8. Commit on dev branch
9. Uday reviews locally → approves → merge to main

**Batch size**: Aim for one section per batch. If a section has 30+ feedback items, may split into two batches.

---

## Quality Checklist (for each batch)

Before marking a batch complete:
- [ ] All "Critical" and "High" items addressed
- [ ] Vocabulary appears BEFORE first use (check Sheet 3)
- [ ] No card is more than 6-7 lines of text
- [ ] Every concept has a WHY
- [ ] Inline quizzes test understanding, not just recall
- [ ] Highlight boxes contain exam-relevant takeaways
- [ ] Story thread openers/closers still make sense after reordering
- [ ] TypeScript builds clean
- [ ] Tested locally in dev

---

## Implementation Log

### Round 1 — Neha's feedback (Ch1 Google Sheet `History/HistoryLab_Feedback.xlsx` + Ch2 email), implemented on `dev`

**Foundation:** Added two reusable narrative card types — `flowchart` (numbered boxes; tap a step to pop open its explanation) and `table` (rendered HTML table). Made narrative **figure cards interactive** (clickable `+` hotspots on the image + clickable legend tags, reusing `FigureHotspotOverlay`). Gave `InteractiveMap` **precise centre-pin markers** instead of vague rectangles.

| Batch | Scope | Commit |
|-------|-------|--------|
| 1 | **Ch1 S1** — NCERT heading ("The French Revolution and the Idea of the Nation"), clickable Sorrieu hotspots, vocab (Absolutist/Utopian) moved before first use, Sovereignty vocab (removed "King owned France"), French collective-belonging **measures flowchart**, Napoleon restructure (who-was-Napoleon story, Napoleonic Code own heading + reforms flowchart, liberator→oppressor WHY, Jacobin-clubs figure moved to French-Rev unit), precise map markers | `aff16bf` |
| 2 | **Ch1 S2** — fragmented-Europe map ref, Habsburg **table**, society-structure **table**, Liberalism split into Political/Social/Economic (suffrage integrated), Zollverein **flowchart**, Treaty of Vienna 5-marker **flowchart** | `7c5a79f` |
| 3 | **Ch1 S3** — July-1830 heading+connect, Greek-war 3-marker exam card, "mystical" & "pauperism" explained, Silesian-weavers story (4 points), German middle-class **demands flowchart**, Frankfurt **rise/fall flowchart** | `90c9981` |
| 4 | **Ch1 S4/S5/S6** — Germany/Italy/Britain **unification flowcharts** (5-markers), Marianne symbols flowchart (red cap/tricolour/**cockade**), **re-extracted fig-16 Marianne stamp** (was cut/unclear), Balkans→WWI 5-marker | `239569b` |
| 5 | **Ch1 quiz** — rebalanced MCQ answer positions (was almost all option B / option A never correct → now 7/4/6/5 across A/B/C/D) | `908c322` |
| 6 | **Ch2 Unit 1** — WWI impact moved to chapter start (new subsection) + NCERT-framed Rowlatt (rising nationalism → repression, not "post-war relief"), Satyagraha simplified as NCERT **idea flowchart**, **3-satyagraha flowchart** (Champaran/Kheda/Ahmedabad), Martial Law vocab | `2e76ad1` |
| 7 | **Ch2 Unit 2/3** — NCM-participants recap converted from broken raw-markdown to a real **table**; Dandi-march facts as separate points | `2e067ca` |
| 8 | **Ch2 Unit 4** — already had figures on `dev`; fixed mismatched Tilak-on-flag-card bug, added correctly-captioned Tilak print | `f632005` |

**Jallianwala Bagh photo (resolved):** NCERT Ch2 PDF has no such figure, so two genuinely public-domain Wikimedia images were sourced — the **Jallianwala Bagh in 1919** (fig-15) and a **General Dyer** press photo (fig-16) — and wired into the buildup/massacre cards.

### Round 2 — Figure & UX correctness (Neha + Uday live review)

Trigger: Neha flagged the interactive hotspot dots on the Sorrieu print as "all mismatched." Investigation found a **systemic** issue: most figure files in **both** chapters were page-region captures with NCERT body text / Discuss-Activity boxes / captions / the page QR baked in, so hotspot %-coords could never align and the images looked cluttered.

| Item | What was done | Commits |
|------|---------------|---------|
| Figure images | **Re-extracted all 35 figures clean** from the NCERT PDFs via `pdfimages` (embedded originals; matched to figures by page number) | `a1b9b55`, `03a22fb`, `a23b225` |
| Hotspots | **Remapped + grid-verified ~97 hotspots** (Ch1 64 + Ch2 33) against the clean frames | `0c0d0ee`, `a23b225` |
| UX | Chapter-level **"Learning Modes" → "Study Tools"** (plain tile names); section page **"Start Reading" moved to a prominent top CTA** | `a1b9b55`, `dc2c84e` |

**Rulings from Neha this round (do NOT relitigate):** keep flowcharts even for parallel-list content (students grasp/remember them better); keep tap-to-reveal + per-card highlights (don't design down to passive students); tighten the Sorrieu intro (still to do in content track).

**Next: full UI/UX track (with Uday).** Open items: verify chapter-home Study-Tools tile count (Ch1 should show 5); "Topics" list mixes Practice Quiz with lesson topics; screen-by-screen IA + mobile review. Plus Neha resumes the content track card-by-card (starting with tightening Sorrieu S1).

### Round 3 — S1 content review (Neha, card-by-card)

Neha reviewed **Ch1 S1 only** and flagged: (a) the Sorrieu intro was still 13 slides (the missed "tighten" structural call), and (b) figure hotspot dots still mis-placed + popups clipping beneath the image frame.

| Item | Fix | Commit |
|------|-----|--------|
| Sorrieu intro length | Tightened **13 → 9 cards** (merges; vocab + exam content preserved) | `6fdb92c` |
| fig-1 Christ/Shattered dots | Recalibrated against the swapped (embedded) image — the image swap had changed the aspect ratio | `6fdb92c` |
| Tooltip clipping (all figures) | `FigureHotspotOverlay`: popup flips **above** the dot when `spot.y >= 58`, clamps horizontally | `cab337e` |
| Mis-placed dots figs 1/2/4/5 | Repositioned vs the real images (Shattered→bottom rubble; Fig2 inscription→right-panel text; Fig4 tree→pole, inscription→right banner [BEST-GUESS]; Fig5 letters→flying scrolls) | `cab337e` |

**Process miss owned:** of Neha's 3 structural calls, the one action ("tighten Sorrieu") was verbally acknowledged but never entered the todo list, and a "fix dots first" detour buried it. Fixed by recording outstanding content items in memory + this log + `HANDOFF.md`.

**OPEN for next session:** (1) proactively re-verify ALL remaining figure hotspots **at full resolution** (thumbnail checks were too coarse and missed these); (2) Neha to confirm/replace the fig-4 "German inscription" best-guess dot; (3) Neha has not yet reviewed Ch1 S2–S6 or any Ch2 content card-by-card. **See `HANDOFF.md` (repo root) — the canonical read-first state for the next session.**

### Round 7 — Ch2 figures invisible (Neha, 2026-06-30)

Neha approved Ch2 *content* but flagged: **"not a single NCERT picture is shown, and there is no map work — and this chapter has a 2-mark map question in the board exam."**

**Root cause (integration, not content):** Ch2's 17 figures + hotspots were authored and correct in `src/data/ch2/figures.ts`, but the rendering components (`NarrativeCard`, `FigureMode`, `FigureGallery`) were never migrated off the **ch1-only** static `data/figures` array onto the chapter-aware `getChapter.ts` accessors — so every Ch2 figure card resolved to `undefined` and rendered text only. The Figures Study-Tools tile was also gated to ch1. Maps were never built for ch2 at all.

| Piece | Scope | Status |
|-------|-------|--------|
| A — Ch2 figures render | Chapter-aware `getFigures(chapterId)` in `NarrativeCard`/`FigureMode`/`FigureGallery`; `'print'` added to `FigureType`; `caption` optional; `CHAPTER_SECTION_LABELS`; Figures tile un-gated for ch2; Practice card hidden for ch2 (no activities yet). **Verified in running app** (Ch2 figures + gallery thumbnails render). | DONE (on `dev`, pending Uday review) |
| A2 — Ch2 study-tools parity | After Uday flagged Ch2 had only Flashcards: made `TimelineMode`/`TimelineExplorer` and `ExamPractice` chapter-aware (same `getChapter` accessor pattern), un-gated **Timeline** + **Exam Prep** tiles for ch2. Ch2 Timeline browses 20 key dates (1915–1942); Exam Prep = 5 primary sources + 8 NCERT board Qs. Sub-features lacking ch2 activities hidden gracefully (timeline ordering, source-comprehension quiz). **Verified in running app.** | DONE (on `dev`, pending Uday review) |
| B — Ch2 map work | India map image + `ch2/maps.ts` + chapter-aware `MapMode` + Maps tile un-gate + identify/label practice for the 2-mark board question. The only remaining Study-Tools tile for ch2. | OPEN — next |

**Process lesson:** Ch2 figure QA was done at the data/coordinate layer (PIL grid overlays on the *image files*), never in the *rendered chapter*. A correct-coordinate image that never renders looks identical to a working one when you only inspect the data. **Verify each chapter in the running app, per chapter.**

### Round 7 — Ch2 teacher review (Claude, history-teacher hat, 2026-06-30)

At Uday's request, read all 4 Ch2 sections end-to-end as a history teacher. **Verdict: content is genuinely strong** — NCERT-faithful, no factual errors found, excellent pedagogy (WHY cards, satyagraha/three-satyagrahas flowcharts, the differing-strands table, exam-prep cards with model answers + mark splits, timelines, cross-chapter synthesis with Ch1). The weakness is **visual integration, not the writing.**

| Finding | Detail | Status |
|---------|--------|--------|
| **S2 has no inline figures** | "Differing Strands" — the most exam-heavy section — teaches via text + one table only. `ch2-fig-4` (Boycott of Foreign Cloth) and `ch2-fig-5` (Chauri Chaura), both tagged s2, sit **unused in the gallery**. | OPEN — wire fig-4/fig-5 into S2 |
| **Simon Commission figure mismatch** | Simon card (1928) shows `ch2-fig-6` "Congress Leaders at Allahabad, **1931**" — unrelated, later photo (fig-6 also flagged `NEEDS NEHA`). | OPEN — swap/drop |
| **`ch2-fig-2` (South Africa march) unused** | Gallery-only; fits the satyagraha-origins cards in S1. | OPEN — fold into S1 |
| **figureIds metadata drift** | `chapter2.ts` S1 `figureIds` lists fig-2/fig-4 but omits fig-15/fig-16 (used inline). Cosmetic — rendering uses card `imageId`. | OPEN — tidy |

Integration density: **Ch1 19/21 figures inline vs Ch2 13/17** (S1:4, S2:0, S3:4, S4:5). Items above are pedagogical improvements (add/swap existing `imageId`s) — **not yet implemented; pending Uday/Neha go-ahead** so Neha reviews a fixed version. Also fixed this round: the **"Next Topic" navigation bug** (SubsectionComplete didn't advance — `<NarrativeMode>` needed a `key` to remount per topic; commit `8694462`).
