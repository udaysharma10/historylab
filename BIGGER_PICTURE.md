# StudyLab — Bigger Picture & Product Roadmap
## From Single Chapter App to Multi-Class NCERT Learning Platform

**Created**: 2026-03-31
**Vision**: Transform HistoryLab (single chapter) into a full NCERT interactive learning platform covering multiple classes, subjects, and books — with freemium monetization.

---

## What We've Built

A **proven learning methodology** — not just an app:
- Storytelling narrative with inline quiz gates
- Spaced repetition flashcards (SM-2)
- Interactive maps with clickable regions
- Visual timelines with expandable events
- Figure analysis with hotspots and exam tips
- Multi-format assessments (MCQ, fill-blank, T/F, match, assertion-reason, source-based, figure-based)
- Teacher/admin dashboard with login tracking and per-section progress

All components are **reusable**. The pedagogy is **validated**. The content structure is **templated**.

---

## Content Hierarchy

```
Platform (StudyLab)
  └── Class (6, 7, 8, 9, 10)
       └── Subject (Social Science, Science, Mathematics, English...)
            └── Book (History, Geography, Political Science, Economics...)
                 └── Chapter (Rise of Nationalism, Nationalism in India...)
                      └── Section (French Revolution, Making of Nationalism...)
```

### CBSE Class 10 Social Science — Full Scope

| Book | NCERT Title | Chapters |
|------|-------------|----------|
| **History** | India and the Contemporary World-II | 5 chapters |
| **Geography** | Contemporary India-II | 7 chapters |
| **Political Science** | Democratic Politics-II | 8 chapters |
| **Economics** | Understanding Economic Development | 5 chapters |
| **Total** | | **25 chapters** |

### History Book Contents (India and the Contemporary World-II)

| # | Chapter | Section | Pages | Status |
|---|---------|---------|-------|--------|
| 1 | The Rise of Nationalism in Europe | Section I: Events & Processes | 3-28 | **BUILT** (Ch1 — free) |
| 2 | Nationalism in India | Section I: Events & Processes | 29-52 | **BUILT** (Ch2) |
| 3 | The Making of a Global World | Section II: Livelihoods & Economies | 53-78 | Planned |
| 4 | The Age of Industrialisation | Section II: Livelihoods & Economies | 79-104 | Planned |
| 5 | Print Culture and the Modern World | Section III: Everyday Life & Culture | 105-? | Planned |

---

## Monetization Strategy

### Freemium + Annual Subscription

| Tier | Access | Price |
|------|--------|-------|
| **Free** | Chapter 1 of every book (full access — all modes, all features) | Free forever |
| **Plus** | All chapters, all books, one class | Rs 499/year or Rs 99/month |
| **Pro** | All chapters, all books, all classes (6-10) | Rs 999/year or Rs 199/month |

### Why Free = Chapter 1
- Student experiences full quality, not a crippled demo
- Parents see value before paying
- Chapter 1 is foundational — builds trust
- Viral loop: "try Chapter 1 free" shared with classmates

### Why Annual Billing
- Academic year aligns with annual subscription
- Higher LTV, lower churn
- Parents buy at start of year (April) or before exams (January)

### Future Revenue Streams
- **School licenses**: Rs 15,000-50,000/year per school (bulk access)
- **Teacher dashboard premium**: Class management, homework, analytics
- **Mock tests**: Full-length Board exam simulations (separate or bundled)

---

## Target URL Structure

### Current (Single Chapter)
```
/                     → HomePage (6 sections of Ch1 only)
/section/s1           → Section 1 of Ch1
/timeline             → Ch1 timeline
```

### Target (Multi-Class, Multi-Subject)
```
/                     → Landing page (class selector)
/class/10             → Class 10 home (subjects grid)
/class/10/history     → History book home (5 chapter cards)
/class/10/history/ch1 → Chapter 1 home (current SectionModule-style)
/class/10/history/ch1/section/s1      → Section narrative
/class/10/history/ch1/section/s1/quiz → Section quiz
/class/10/history/ch1/timeline        → Chapter timeline review
/class/10/history/ch1/flashcards      → Chapter flashcards
/class/10/history/ch1/exam            → Chapter exam prep
```

### Interim (Phase A — Multi-Chapter within History)
```
/                     → Book home (5 chapter cards)
/chapter/ch1          → Chapter 1 home (current section list)
/chapter/ch1/section/s1      → Section narrative
/chapter/ch1/section/s1/quiz → Section quiz
/chapter/ch1/timeline        → Chapter timeline review
/chapter/ch1/flashcards      → Chapter flashcards
/chapter/ch1/exam            → Chapter exam prep
```

---

## Data Structure

### Current
```
src/data/
  ├── chapter1.ts
  ├── sections/
  ├── activities/
  ├── figures.ts
  ├── flashcards.ts
  └── ...
```

### Target (Multi-Chapter)
```
src/data/
  ├── books.ts                    (book metadata, chapter list)
  ├── ch1/                        (current data, moved here)
  │   ├── chapter.ts
  │   ├── sections/
  │   ├── activities/
  │   ├── figures.ts
  │   ├── flashcards.ts
  │   ├── keyDates.ts
  │   ├── keyPeople.ts
  │   ├── vocabulary.ts
  │   ├── sources.ts
  │   ├── symbols.ts
  │   └── maps.ts
  ├── ch2/                        (Nationalism in India — next)
  │   ├── chapter.ts
  │   └── ...
  └── ch3/, ch4/, ch5/
```

---

## Access Control (Freemium Gate)

```typescript
function canAccessChapter(chapterNum: number, subscription: UserSubscription): boolean {
  if (chapterNum === 1) return true  // Chapter 1 always free
  return subscription.isActive
}
```

### Database Changes Needed (Phase C)
- `subscriptions` table: user_id, plan (free/plus/pro), start_date, end_date, payment_id, status
- `student_progress` → add chapter_id field
- `activity_logs` → add chapter_id field
- Payment: Razorpay integration

---

## Execution Roadmap

| Phase | Description | Scope | Status |
|-------|-------------|-------|--------|
| **A** | Multi-chapter architecture: restructure routes, data folders, book home page, chapter selector | Routes + data reorganization | **DONE** (2026-03-31) |
| **B** | Chapter 2: Nationalism in India — full content (4 sections, ~110 cards, 15 figures, 100 flashcards, 52 quiz activities, 10 match, 8 NCERT Qs) | Content creation | **DONE** (2026-03-31) |
| **C** | Freemium gate: Ch1 free, rest locked, Razorpay payment, subscription table | Auth + payment | Next |
| **D** | Remaining history chapters (3, 4, 5) | Content creation | After C |
| **E** | Other Class 10 books: Geography, Political Science, Economics | Content + subject adaptations | Future |
| **F** | Other classes (9, 8, 7, 6) | Scale | Future |

### Phase A Breakdown (Current Focus)
1. Create `books.ts` with book metadata and chapter list
2. Move `src/data/*` into `src/data/ch1/` subfolder
3. Create chapter-aware data loader
4. Add book home page showing 5 chapter cards (Ch1 = "Start", rest = "Coming Soon")
5. Update routes: `/` → book home, `/chapter/ch1` → chapter home (current HomePage content)
6. Update all component imports to use new data paths
7. Keep all existing functionality — zero feature regression

### Content Creation Template (for each new chapter)
From Ch1, we know each chapter needs:
- [ ] Chapter definition (sections, subsections, key points)
- [ ] Narrative cards (~100-130 per chapter) with story thread, WHY cards, Sorrieu-style motifs
- [ ] Figures with hotspots and analysis (extract from NCERT PDF)
- [ ] Vocabulary (15-25 terms per chapter)
- [ ] Key dates (15-35 events per chapter)
- [ ] Key people (10-20 figures per chapter)
- [ ] Sources (3-6 primary source texts)
- [ ] Flashcards (80-100 per chapter)
- [ ] Activities: MCQ (15-25), fill-blank (8-15), T/F (10-15), match (8-12)
- [ ] Timeline activities (5-8 ordering exercises)
- [ ] Map activities (if applicable)
- [ ] Image analysis activities (if applicable)
- [ ] Source comprehension activities
- [ ] NCERT exercise questions with model answers
- [ ] Assertion-reason questions (10-15)
- [ ] Cross-section synthesis questions (5-8)

---

## Subject-Specific Adaptations (Phase E, Future)

| Subject | Primary Mode | Key Adaptations |
|---------|-------------|-----------------|
| **History** | Storytelling narrative + timeline + figures | Story arc, primary sources, visual analysis |
| **Geography** | Map-heavy + data interpretation | More interactive maps, climate/resource data, graph reading |
| **Political Science** | Debate/discuss + case studies | Multiple perspectives, newspaper clippings, opinion analysis |
| **Economics** | Data + graphs + real-world application | Chart interpretation, calculation practice, current affairs links |

---

## Naming & Branding (Future Decision)

Current: **HistoryLab** — works for history but not for geography/economics.
Options:
- **StudyLab** — generic, scalable
- **NCERTLab** — clear positioning but may have trademark issues
- **BoardPrep** — exam-focused positioning
- **LearnVerse** — modern, broad

Decision deferred until Phase E (multi-subject expansion).

---

## Key Principles

1. **Quality over quantity** — one brilliant chapter > five mediocre ones
2. **Prove the template** — Ch2 should be buildable in 2-3 days using Ch1's components
3. **Free chapter must be impressive** — it's the sales pitch
4. **Annual subscription aligns with academic year** — parents buy in April or January
5. **Each chapter follows TEACHING_GUIDELINES.md** — same pedagogy everywhere
