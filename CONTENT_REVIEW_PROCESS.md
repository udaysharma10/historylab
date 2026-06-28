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
