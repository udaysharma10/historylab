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
