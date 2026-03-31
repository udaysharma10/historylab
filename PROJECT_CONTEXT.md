# HistoryLab — Interactive NCERT History Learning App

## Overview
Interactive educational web app for Grade 10 CBSE students based on **NCERT History Chapter 1: "The Rise of Nationalism in Europe"** (India and the Contemporary World). Designed for Vedansh Sharma and his classmates — a multi-user online learning program with 6 learning modes.

## Who is this for
- **Vedansh Sharma** — Grade 10 CBSE student, son of Uday Sharma
- **Target audience**: Vedansh's entire class (multi-user, shared online)
- **Devices**: Laptop (primary), tablet, mobile — fully responsive
- **Goal**: Learn NCERT History interactively with narrative walkthroughs, quizzes, timelines, maps, flashcards, and exam practice

---

## Tech Stack
| Layer | Choice | Version |
|-------|--------|---------|
| Runtime | Node.js | v20.20.0 (via nvm) |
| Framework | React + TypeScript | React 19, TS 5 |
| Build | Vite | v8.0.3 |
| Styling | Tailwind CSS v4 | `@tailwindcss/vite` plugin |
| Animations | Framer Motion | Latest |
| State | Zustand + localStorage persist | Latest |
| Fonts | Playfair Display (headings), Source Sans 3 (body) | `@fontsource/*` |
| Sound | Web Audio API (synthesized tones) | Built-in, no files needed |
| Celebration | canvas-confetti | Latest |
| Routing | react-router-dom v7 | BrowserRouter |

### Important: Node Version
Default node is v16.20.2. **Must use Node 20** for Vite 8.
```bash
source "$HOME/.nvm/nvm.sh" && nvm use 20
# OR for background processes:
PATH="/Users/udaysharma/.nvm/versions/node/v20.20.0/bin:$PATH"
```

### Dev Server
```bash
cd /Users/udaysharma/Documents/Blostem/Claude_Projects/vedansh-history
PATH="/Users/udaysharma/.nvm/versions/node/v20.20.0/bin:$PATH" npm run dev -- --host
# Local:   http://localhost:5176/
# Network: http://192.168.1.32:5176/
```

---

## Project Structure
```
vedansh-history/
├── public/
│   ├── images/                          # Textbook figures (PNG, extracted from NCERT PDF)
│   │   ├── fig-01-sorrieu.png          # Fig 1: Sorrieu's Dream (Section 1)
│   │   ├── fig-02-rebmann.png          # Fig 2: Rebmann almanac (Section 1)
│   │   ├── fig-03-europe-map.png       # Fig 3: Europe after Congress of Vienna (Section 1)
│   │   ├── fig-04-tree-liberty.png     # Fig 4: Tree of Liberty, Zweibrücken (Section 1)
│   │   ├── fig-05-napoleon-postman.png # Fig 5: Napoleon postman caricature (Section 1)
│   │   ├── fig-06-club-of-thinkers.png # Fig 6: Club of Thinkers caricature (Section 2)
│   │   ├── fig-07-mazzini-young-europe.png # Fig 7: Mazzini founding Young Europe (Section 2)
│   │   ├── fig-08-massacre-chios.png   # Fig 8: Delacroix Massacre at Chios (Section 3)
│   │   ├── fig-09-peasant-uprising.png # Fig 9: Peasants' uprising 1848 (Section 3)
│   │   ├── fig-10-frankfurt-parliament.png # Fig 10: Frankfurt parliament (Section 3)
│   │   ├── fig-11-german-empire-proclamation.png # Fig 11: German Empire at Versailles (Section 4)
│   │   ├── fig-12-germany-unification-map.png # Fig 12: Germany unification map (Section 4)
│   │   ├── fig-13-bismarck-caricature.png # Fig 13: Bismarck caricature (Section 4)
│   │   ├── fig-14a-italy-before.png    # Fig 14a: Italy before unification (Section 4)
│   │   ├── fig-14b-italy-after.png     # Fig 14b: Italy after unification (Section 4)
│   │   ├── fig-15-garibaldi-boot.png   # Fig 15: Garibaldi boot caricature (Section 4)
│   │   ├── fig-16-marianne-stamps.png  # Fig 16: Marianne stamps (Section 5)
│   │   ├── fig-17-germania-veit.png    # Fig 17: Germania by Philip Veit (Section 5)
│   │   ├── fig-18-fallen-germania.png  # Fig 18: Fallen Germania by Hübner (Section 5)
│   │   ├── fig-19-germania-rhine.png   # Fig 19: Germania guarding Rhine (Section 5)
│   │   ├── fig-20-british-empire-map.png # Fig 20: British Empire map (Section 6)
│   │   └── maps/                        # (reserved for future SVG maps)
├── src/
│   ├── main.tsx                         # Entry point
│   ├── App.tsx                          # RouterProvider wrapper
│   ├── router.tsx                       # Route definitions
│   ├── styles/
│   │   └── globals.css                  # Tailwind + @theme colors + custom animations
│   ├── types/
│   │   ├── chapter.ts                   # Chapter, Section, NarrativeCard, KeyDate, KeyPerson, etc.
│   │   ├── activity.ts                  # Discriminated union: 11 activity types
│   │   ├── figure.ts                    # Figure, Hotspot, FigureAnalysis
│   │   └── progress.ts                  # SectionProgress, Achievement, FlashcardState
│   ├── store/
│   │   ├── useProgressStore.ts          # Zustand: per-section progress, stars, subsection completion, narrative quiz stars
│   │   ├── useSettingsStore.ts          # Zustand: sound, font size, dark mode
│   │   └── useFlashcardStore.ts         # Zustand: SM-2 review state per card
│   ├── hooks/
│   │   ├── useSound.ts                  # Web Audio API synthesized sounds
│   │   └── useSwipe.ts                  # Touch swipe gesture detection
│   ├── engine/
│   │   ├── quizEngine.ts                # MCQ/fill-blank/T-F validation, fuzzy matching
│   │   ├── matchEngine.ts              # Match-the-following validation
│   │   ├── timelineEngine.ts           # Timeline placement validation (year tolerance)
│   │   ├── scoringEngine.ts            # Stars (1-3), XP, mastery calculation
│   │   └── spacedRepetition.ts         # SM-2 algorithm for flashcard scheduling
│   ├── data/                                  # ALL DATA FILES COMPLETE (Phase 2)
│   │   ├── chapter1.ts                  # Master chapter definition (imports all sections)
│   │   ├── sections/                    # 6 section narrative card files (~116 cards)
│   │   │   ├── section1-french-revolution.ts   # 4 subsections, 18 cards
│   │   │   ├── section2-making-nationalism.ts  # 5 subsections, 24 cards
│   │   │   ├── section3-age-of-revolutions.ts  # 5 subsections, 27 cards
│   │   │   ├── section4-germany-italy.ts       # 4 subsections, 22 cards
│   │   │   ├── section5-visualising-nation.ts  # 3 subsections, 14 cards
│   │   │   └── section6-nationalism-imperialism.ts # 3 subsections, 11 cards
│   │   ├── figures.ts                   # 20 figures + hotspots + FigureAnalysis (ALL images extracted)
│   │   ├── sources.ts                   # Source A, B, C
│   │   ├── vocabulary.ts                # 8 "New Words"
│   │   ├── keyDates.ts                  # 34 timeline events
│   │   ├── keyPeople.ts                 # 15 historical figures
│   │   ├── symbols.ts                   # Box 3: 7 allegory symbols
│   │   ├── flashcards.ts               # 100 flashcards (own Flashcard interface)
│   │   ├── maps.ts                     # 3 map definitions with clickable region coordinates (europe-1815, germany-unification, italy-before)
│   │   └── activities/                  # ~98 activities across all types
│   │       ├── quizActivities.ts        # 22 MCQ + 12 fill-blank + 15 T/F
│   │       ├── matchActivities.ts       # 10 match-the-following
│   │       ├── timelineActivities.ts    # 7 timeline placement
│   │       ├── mapActivities.ts         # 7 map-identify + 3 map-label
│   │       ├── imageAnalysis.ts         # 9 image analysis (24 sub-Qs)
│   │       ├── sourceAnalysis.ts        # 3 source comprehension (9 sub-Qs)
│   │       └── ncertQuestions.ts        # 10 NCERT exercise Qs + sample answers
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx             # Top bar with back nav, star counter, avatar
│   │   │   └── SectionHeader.tsx        # Section title, progress bar, star display
│   │   ├── common/
│   │   │   ├── StarRating.tsx           # Animated 1-3 star display
│   │   │   ├── CelebrationOverlay.tsx   # Confetti + stars + history-themed messages
│   │   │   ├── HintButton.tsx           # Progressive hint reveal system
│   │   │   └── ProgressRing.tsx         # Circular mastery ring (Beginner→Master)
│   │   ├── narrative/                   # BUILT (Phase 3)
│   │   │   ├── NarrativeCard.tsx        # Card renderer: text (drop cap), vocabulary (purple), source (amber), figure (with real NCERT image + hotspots + analysis)
│   │   │   ├── InlineQuizCard.tsx       # Embedded MCQ within narrative flow (blocks progress until answered)
│   │   │   └── SubsectionComplete.tsx   # Completion screen: stars, confetti, stats, next topic button
│   │   ├── timeline/                    # BUILT (Phase 5)
│   │   │   ├── TimelineExplorer.tsx     # Browse 34 events, decade grouping, section filter chips, expandable details, exam badges
│   │   │   ├── TimelineOrderCard.tsx    # Tap-to-order activity: place events in chronological order, undo/clear, per-event feedback, correct order reveal
│   │   │   └── index.ts                # Barrel export
│   │   ├── quiz/                        # BUILT (Phase 4)
│   │   │   ├── MCQCard.tsx             # Standalone MCQ with hints, exam badges, animated feedback
│   │   │   ├── FillBlankCard.tsx       # Inline ___ inputs, per-blank validation, correct answer reveal
│   │   │   ├── TrueFalseCard.tsx       # Large TRUE/FALSE buttons, wiggle animation on wrong
│   │   │   ├── MatchColumns.tsx        # Tap-to-pair left/right columns, color-coded connections
│   │   │   ├── QuizProgress.tsx        # Animated dot progress bar (green/red/current)
│   │   │   ├── QuizResults.tsx         # Score, stars, XP, exam readiness, confetti celebration
│   │   │   └── index.ts               # Barrel export
│   │   ├── map/                         # BUILT (Phase 6)
│   │   │   ├── InteractiveMap.tsx     # PNG map with %-based clickable region overlays, hover tooltips, color-coded highlights
│   │   │   ├── MapIdentifyCard.tsx    # "Find on the Map" activity: read question, tap correct region, hints, exam tips
│   │   │   ├── MapLabelCard.tsx       # "Label the Map" activity: tap label from pool → tap region to place, per-label feedback
│   │   │   ├── MapExplorer.tsx        # Browse 3 maps, tap regions to read descriptions, exam tips per map
│   │   │   └── index.ts              # Barrel export
│   │   ├── figure/                      # BUILT (Phase 7)
│   │   │   ├── FigureHotspotOverlay.tsx # PNG figure with pulsing hotspot dots at (x,y)%, tap to reveal label+description tooltip
│   │   │   ├── FigureAnalysisPanel.tsx  # Always-expanded: "What You See" (numbered), "What It Means" (bullets), Exam Tip (amber)
│   │   │   ├── FigureDetail.tsx         # Single figure deep-dive: header, hotspot overlay, tag pills, analysis panel, prev/next nav
│   │   │   ├── FigureGallery.tsx        # 2-col grid of 20 figures, section filter chips, type filter chips, thumbnails, exam badges
│   │   │   ├── ImageAnalysisCard.tsx    # Practice quiz: MCQ with instant feedback + free-text "Reveal Answer" (attempt-first)
│   │   │   └── index.ts                # Barrel export
│   │   ├── flashcard/                   # BUILT (Phase 8)
│   │   │   ├── FlashcardSingle.tsx    # 3D flip card: front (question) / back (answer), section color, tags, 3-button SM-2 rating (Didn't Know / Okay / Easy!)
│   │   │   └── index.ts              # Barrel export
│   │   ├── section/                       # BUILT (Phase 11-3)
│   │   │   ├── SectionTimeline.tsx    # Per-section interactive timeline: tappable year pills, expandable event details
│   │   │   └── SectionMaps.tsx        # Per-section interactive maps: clickable regions, exam tips, "Tap to explore"
│   │   └── source/                      # BUILT (Phase 8)
│   │       ├── SourceReader.tsx        # Parchment-styled source text display: quotation marks, author/year, numbered analysis points, exam tip
│   │       ├── SourceQuizCard.tsx      # Source comprehension quiz: MCQ + free-text, compact source excerpt, sub-question progress dots
│   │       └── index.ts              # Barrel export
│   ├── lib/
│   │   ├── supabase.ts                  # Supabase client init (env vars)
│   │   ├── adminEmails.ts              # Configurable admin teacher emails (auto-redirect to dashboard)
│   │   ├── activityLog.ts             # Log activity completions to Supabase
│   │   └── syncProgress.ts           # Debounced progress sync to Supabase
│   └── modules/
│       ├── HomePage.tsx                 # Dashboard: greeting, stats, 6 section cards, 5 mode icons (incl. Maps)
│       ├── TeacherDashboard.tsx         # Teacher analytics: overview cards, activity breakdown, student table
│       ├── ComingSoon.tsx               # Placeholder (no longer used — all routes now have real components)
│       ├── SectionModule.tsx            # BUILT: Section landing page — key points, subsection list with progress, "Practice Quiz" card, "Start/Continue Reading" CTA
│       ├── NarrativeMode.tsx            # BUILT: Card-by-card walkthrough — swipe/keyboard nav, segmented progress bar, card type labels, back-to-overview link
│       ├── QuizMode.tsx                 # BUILT: Quiz orchestrator — type picker → question flow → results with stars/XP
│       ├── TimelineMode.tsx             # BUILT: Timeline orchestrator — home (explore/practice), explorer (34 events), practice (7 ordering activities), results with stars/XP
│       ├── MapMode.tsx                  # BUILT: Map orchestrator — home (explore/identify/label), 3 maps, 10 activities, results with stars/XP
│       ├── FigureMode.tsx               # BUILT: Figure orchestrator — home (browse/practice/exam-important), gallery (20 figures, filters), detail (hotspots + analysis), practice (9 image analysis activities, 24 sub-Qs), results with stars/XP
│       ├── FlashcardMode.tsx            # BUILT (Phase 8): Flashcard orchestrator — home (stats + due/all/browse/section modes), browse (100 cards with section filters + mastery badges), practice (shuffled 20-card sessions with 3D flip + SM-2 rating), stats (session results + overall progress)
│       ├── ExamPractice.tsx             # BUILT (Phase 8): Exam prep orchestrator — home (read sources / source quiz / NCERT Qs), source-read (parchment reader with analysis), source-practice (9 comprehension Qs with stars/XP), ncert (10 expandable Q&A cards with key points + model answers), results
│       └── RevisionMode.tsx             # Quick key-points revision
```

---

## Routes
| Path | Component | Status |
|------|-----------|--------|
| `/` | HomePage | **BUILT** |
| `/section/:sectionId` | SectionModule → NarrativeMode | **BUILT** (Phase 3) |
| `/section/:sectionId/quiz` | QuizMode | **BUILT** (Phase 4) |
| `/timeline` | TimelineMode | **BUILT** (Phase 5) |
| `/maps` | MapMode | **BUILT** (Phase 6) |
| `/figures` | FigureMode | **BUILT** (Phase 7) |
| `/flashcards` | FlashcardMode | **BUILT** (Phase 8) |
| `/exam` | ExamPractice | **BUILT** (Phase 8) |
| `/dashboard` | TeacherDashboard | **BUILT** (Phase 10-E, updated Phase 11-3) — admin-only (configured via `adminEmails.ts`), 3 tabs: All Users / Login History (date-wise) / Activity Breakdown |

---

## Design System

### Color Palette (defined in globals.css @theme)
| Token | Hex | Usage |
|-------|-----|-------|
| `hist-red` | #C0392B | Section 1 (French Revolution), errors |
| `hist-blue` | #2980B9 | Section 2 (Nationalism), primary action |
| `hist-gold` | #D4A017 | Stars, imperial theme, highlights |
| `hist-green` | #27AE60 | Section 4 (Germany/Italy), correct answers |
| `hist-purple` | #7D3C98 | Section 5 (Visualising), monarchy |
| `hist-orange` | #E67E22 | Section 3 (Revolutions), hints |
| `hist-teal` | #16A085 | Section 6 (Imperialism), geography |
| `hist-dark` | #2C3E50 | Text, headers |
| `bg-start` | #FDF6EC | Body gradient start (parchment warm) |
| `bg-end` | #F0E6D4 | Body gradient end (parchment cool) |

### Typography
- **Display** (headings, buttons): `font-display` → Playfair Display (serif, scholarly)
- **Body** (text, labels): `font-body` → Source Sans 3 (readable, clean)

### Narrative Card Types (visual styles)
- **Text**: White card, drop cap first letter in section color, top accent bar gradient
- **Vocabulary**: Purple gradient background, large term heading, "Aa" badge, exam reminder
- **Source**: Amber/parchment gradient, large quotation mark, italic text, "Primary Source" badge
- **Figure**: Real NCERT image + title/artist/year + hotspot tags + expandable "Show Analysis" panel with "What It Means" + Exam Tip
- **Quiz (inline)**: Section-colored gradient quiz area, MCQ options, animated feedback, explanation reveal

### Custom Animations
- `animate-bounce-in` — scale 0→1.2→1
- `animate-wiggle` — rotation shake
- `animate-float` — gentle up/down hover
- `animate-pulse-glow` — green glow pulse
- `animate-star-pop` — star earning animation
- `animate-shimmer` — background shimmer effect
- `animate-fade-in-up` — opacity + translateY entrance
- `.btn-press` — translateY on :active for tactile feel

---

## Chapter Content: Rise of Nationalism in Europe

### 6 Sections
| # | Section | Route | Color | Status |
|---|---------|-------|-------|--------|
| 1 | The French Revolution & the Nation | `/section/s1` | hist-red | **Narrative + Quiz LIVE, images extracted** |
| 2 | Making of Nationalism in Europe | `/section/s2` | hist-blue | **Narrative + Quiz LIVE, images extracted** |
| 3 | Age of Revolutions: 1830-1848 | `/section/s3` | hist-orange | **Narrative + Quiz LIVE, images extracted** |
| 4 | Making of Germany & Italy | `/section/s4` | hist-green | **Narrative + Quiz LIVE, images extracted** |
| 5 | Visualising the Nation | `/section/s5` | hist-purple | **Narrative + Quiz LIVE, images extracted** |
| 6 | Nationalism & Imperialism | `/section/s6` | hist-teal | **Narrative + Quiz LIVE, images extracted** |

### 6 Learning Modes
| Mode | Route | Description |
|------|-------|-------------|
| Narrative | per section | **BUILT** — Swipeable story cards with inline quizzes |
| Quiz | `/section/:sectionId/quiz` | **BUILT** — MCQ, fill-blank, true-false, match (59 activities wired) |
| Timeline | `/timeline` | **BUILT** — Explorer (34 events, filter by section) + Practice (7 tap-to-order activities with stars/XP) |
| Maps | `/maps` | **BUILT** — Explorer (3 maps, 16 clickable regions) + Identify practice (7 activities) + Label practice (3 activities) with stars/XP |
| Flashcards | `/flashcards` | **BUILT** — Home (due today/new/learning/mastered stats, 3 mode cards, practice-by-section grid) + Browse (100 cards with section filters, mastery badges) + Practice (shuffled 20-card sessions, 3D flip, SM-2 3-button rating) + Stats (session results, overall progress) |
| Figures | `/figures` | **BUILT** — Gallery (20 figures, section/type filters) + Detail (interactive hotspots, always-expanded analysis) + Practice (9 image analysis activities, 24 sub-Qs) with stars/XP |
| Exam Prep | `/exam` | **BUILT** — Read Sources (3 parchment-styled source readers with analysis) + Source Comprehension Quiz (3 activities, 9 sub-Qs, MCQ + free-text, stars/XP) + NCERT Exercise Questions (10 expandable cards with key points + attempt-first model answers, filter by Write in Brief / Discuss) |

### Content Inventory (from NCERT textbook)
- **20 Figures**: paintings, caricatures, maps, stamps, banners (all with exam-relevant analysis)
- **6 Source Boxes**: Ernst Renan (Source A), Friedrich List (Source B), Welcker/Otto-Peters (Source C), Bismarck "Blood and Iron" (Source D), Mazzini "Duties of Man" (Source E), Herder "Spirit of the People" (Source F)
- **3 Info Boxes**: Grimm Brothers (Box 1), Garibaldi (Box 2), Allegory Symbols (Box 3)
- **22 Vocabulary Words**: Absolutist, Utopian, Plebiscite, Sovereignty, Nation-state, Liberalism, Suffrage, Conservatism, Jacobin, Feudalism, Autocracy, Romanticism, Volksgeist, Feminist, Ideology, Ethnic, Junker, Realpolitik, Allegory, Imperialism, Slavs (expanded from 8 in Phase 11-2)
- **~35 Key Timeline Events**: 1789-1914
- **~15 Key Historical Figures**: Napoleon, Metternich, Mazzini, Bismarck, Cavour, Garibaldi, etc.
- **100 Flashcards**: SM-2 spaced repetition cards across all 6 sections
- **10 NCERT Exercise Questions**: 5 "Write in Brief" + 5 "Discuss" (with full sample answers)
- **~98 Activities**: 22 MCQ, 12 fill-blank, 15 true-false, 10 match, 7 timeline, 10 map, 9 image analysis, 3 source analysis
- **~134 Narrative Cards**: with inline quizzes, highlights, figure references, vocabulary and source cards (expanded in Phase 11-1 revamp: +18 story thread, WHY, and rewritten cards)

### Figure Images (extracted from NCERT PDF)
Source PDF: `/Users/udaysharma/Documents/Blostem/Claude_Projects/History/NCERT_Rise of Nationalism in Europe.pdf`

**Extraction method**: `pdftoppm -png -r 300` → `sips -c` crop → `sips -Z 1200` resize

| Figure | File | Page | Status |
|--------|------|------|--------|
| Fig 1: Sorrieu's Dream | `fig-01-sorrieu.png` | p3 | **Extracted** |
| Fig 2: Rebmann almanac | `fig-02-rebmann.png` | p5 | **Extracted** |
| Fig 3: Europe 1815 map | `fig-03-europe-map.png` | p6 | **Extracted** |
| Fig 4: Tree of Liberty | `fig-04-tree-liberty.png` | p7 | **Extracted** |
| Fig 5: Napoleon postman | `fig-05-napoleon-postman.png` | p7 | **Extracted** |
| Fig 6: Club of Thinkers | `fig-06-club-of-thinkers.png` | p11 | **Extracted** |
| Fig 7: Mazzini Young Europe | `fig-07-mazzini-young-europe.png` | p12 | **Extracted** |
| Fig 8: Massacre at Chios | `fig-08-massacre-chios.png` | p14 | **Extracted** |
| Fig 9: Peasants' uprising | `fig-09-peasant-uprising.png` | p16 | **Extracted** |
| Fig 10: Frankfurt parliament | `fig-10-frankfurt-parliament.png` | p18 | **Extracted** |
| Fig 11: German Empire | `fig-11-german-empire-proclamation.png` | p19 | **Extracted** |
| Fig 12: Germany unification map | `fig-12-germany-unification-map.png` | p20 | **Extracted** |
| Fig 13: Bismarck caricature | `fig-13-bismarck-caricature.png` | p20 | **Extracted** |
| Fig 14a: Italy before | `fig-14a-italy-before.png` | p21 | **Extracted** |
| Fig 14b: Italy after | `fig-14b-italy-after.png` | p21 | **Extracted** |
| Fig 15: Garibaldi boot | `fig-15-garibaldi-boot.png` | p22 | **Extracted** |
| Fig 16: Marianne stamps | `fig-16-marianne-stamps.png` | p23 | **Extracted** |
| Fig 17: Germania (Veit) | `fig-17-germania-veit.png` | p23 | **Extracted** |
| Fig 18: Fallen Germania | `fig-18-fallen-germania.png` | p24 | **Extracted** |
| Fig 19: Germania Rhine | `fig-19-germania-rhine.png` | p25 | **Extracted** |
| Fig 20: British Empire map | `fig-20-british-empire-map.png` | p27 | **Extracted** |

---

## Gamification

### Stars (per activity)
- **3 stars**: No mistakes, no hints
- **2 stars**: 1-2 mistakes OR 1 hint used
- **1 star**: Completed with help

### Section Mastery (circular progress ring)
- **Beginner** (0-25%): Grey
- **Learning** (25-50%): Bronze
- **Confident** (50-80%): Silver
- **Master** (80-100%): Gold with sparkle

### Achievements
- Time Traveler, Map Master, Source Scholar, Art Critic, Vocab Champion, History Detective, Exam Ready, Perfect Section

### Celebration
- CelebrationOverlay with confetti + stars
- History-themed messages: "Brilliant historian!", "You know your dates!", "Nation-building expert!"

---

## Teaching Methodology
See `TEACHING_GUIDELINES.md` for the complete content and pedagogy reference:
- **Voice**: Teacher voice, not textbook. Direct address, bold key terms, short sentences.
- **WHY**: Every concept must explain the mechanism, not just the event.
- **Story**: One narrative arc across 6 sections (Hope → Failure → Co-option → Manipulation → Destruction). Sorrieu as recurring motif.
- **Assessment**: Bloom's taxonomy balance (target 10% Evaluate level). All CBSE formats including Assertion-Reason.
- **Methodology**: Attempt-first pedagogy, inline quiz gates, SM-2 spaced repetition, multi-modal learning, section = complete lesson.
- **5 Rules**: Sound like a teacher | Every concept needs a WHY | One story six chapters | Test understanding not memory | Each section is a complete lesson

---

## Key Architecture Decisions

1. **Separate project** from aarav-shin-shapes — different audience (Grade 10 vs Grade 4), different domain (history vs math)
2. **No backend for POC**: All state in localStorage via Zustand persist. Future: profile selector for multi-user
3. **Static data in TypeScript**: NCERT content is fixed, TS gives type-safety, no CMS needed
4. **PNG maps with region overlays**: NCERT map images used as backgrounds with percentage-based clickable rectangular regions — simpler than SVG, works well for study aids
5. **SM-2 spaced repetition**: Proven algorithm (same as Anki) for flashcard scheduling
6. **Discriminated union activities**: Same pattern as shin-shapes puzzles — type-safe rendering by activity.type
7. **CBSE infographic coverage**: Every figure, caricature, map, source box, "New Words" box, and info box is extracted and taught. CBSE exams test this content heavily.
8. **Attempt-first pedagogy**: Same pattern as shin-shapes — child attempts problem first, gets hints/reveal as reward or scaffolding
9. **No Three.js**: No 3D content needed, lighter bundle than shin-shapes
10. **Scholarly theme**: Playfair Display + parchment palette instead of kid-friendly Fredoka + pastels

---

## Source Material
- NCERT PDF: `/Users/udaysharma/Documents/Blostem/Claude_Projects/History/NCERT_Rise of Nationalism in Europe.pdf`
- 28 pages, Chapter 1 of "India and the Contemporary World" (Section I: Events and Processes)

---

## Phase Status

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Foundation (scaffold, types, stores, common components, AppShell, HomePage) | **DONE** |
| 2 | Data Layer (section narrative cards, figures, vocabulary, dates, people, flashcards, activities, NCERT questions) | **DONE** |
| 3 | Narrative Mode (NarrativeCard, InlineQuizCard, SubsectionComplete, SectionModule, NarrativeMode, figure images for S1) | **DONE** |
| 3b | Extract remaining figure images (Figs 6-20) from NCERT PDF for Sections 2-6 — all 16 images extracted as PNG, max 1200px | **DONE** |
| 4 | Quiz Mode (MCQCard, FillBlankCard, TrueFalseCard, MatchColumns, QuizProgress, QuizResults, QuizMode orchestrator, route `/section/:sectionId/quiz`, Practice Quiz button in SectionModule) — 59 activities wired (22 MCQ, 12 fill-blank, 15 T/F, 10 match) | **DONE** |
| 5 | Timeline Mode (TimelineExplorer with 34 events + decade grouping + section filters, TimelineOrderCard tap-to-order with undo/clear/feedback, TimelineMode orchestrator with explore/practice/results phases, 7 activities wired, QuizResults reused with timeline-order label) | **DONE** |
| 6 | Interactive Maps (3 PNG maps with %-based clickable regions, InteractiveMap renderer, MapIdentifyCard tap-to-identify with hints, MapLabelCard tap-label-then-region with per-label feedback, MapExplorer browse mode, MapMode orchestrator with explore/identify/label/results phases, 10 activities wired (7 identify + 3 label), QuizResults reused with map-identify/map-label labels, route `/maps`, Maps button on HomePage) | **DONE** |
| 7 | Figure Analysis (FigureHotspotOverlay with pulsing dots + tooltips, FigureAnalysisPanel always-expanded with What You See/What It Means/Exam Tip, FigureDetail with prev/next nav + tag pills, FigureGallery 2-col grid with section+type filters, ImageAnalysisCard MCQ+free-text practice, FigureMode orchestrator with home/gallery/detail/practice/results phases, 9 image analysis activities wired (24 sub-Qs), QuizResults reused with image-analysis label, route `/figures`) | **DONE** |
| 8 | Source Analysis + Flashcards + Exam Practice (FlashcardSingle 3D flip card with SM-2 rating, FlashcardMode orchestrator with home/browse/practice/stats phases, SourceReader parchment-styled with analysis, SourceQuizCard MCQ+free-text comprehension, ExamPractice orchestrator with home/source-read/source-practice/ncert/results phases, 100 flashcards wired with spaced repetition, 3 source readers + 9 source comprehension Qs + 10 NCERT exercise Qs with model answers, QuizResults reused with source-comprehension label, routes `/flashcards` and `/exam`, perspective-1000 CSS utility for card flip) | **DONE** |
| 9 | Polish (responsive, keyboard nav, performance, dark mode) | Deferred |
| 11-1 | **Content Revamp Phase 1**: Story thread (openers/closers for all 6 sections), Sorrieu recurring motif (S1,S3-S6), WHY explanation cards (6 new), rewrite ~15 dry textbook-tone cards to teacher voice. ~18 new cards added, ~15 rewritten. See `REVAMP_PLAN.md` for full plan. | **DONE** |
| 11-2 | Content Revamp Phase 2: Vocabulary expansion (8→22 terms with examples), symbols (Marianne 5 symbols, Britannia 5 symbols, Germania progression 3 paintings, allegory explanation), sources (3→6: added Bismarck, Mazzini, Herder). See `REVAMP_PLAN.md`. | **DONE** |
| 11-3 | Content Revamp Phase 3: Integrated section experience — new `timeline-ref` and `map-ref` card types in narrative, 6 timeline + 5 map reference cards, SectionTimeline + SectionMaps interactive components on each section page (tappable year pills, clickable map regions), standalone modes relabeled as "Review" tools, Europe 1815 map coordinates fixed. See `REVAMP_PLAN.md`. | **DONE** |
| 11-4 | Content Revamp Phase 4: Assessment upgrades (cross-section synthesis, assertion-reason, MCQ distractors, remediation) | Pending |
| 10-A | Deploy to Vercel (static hosting, auto-deploy on push) | **DONE** |
| 10-B | Supabase setup (project, Google OAuth, database tables, RLS) | **DONE** |
| 10-C | Auth integration (login page, profile setup: name/school/role, auth guard) | **DONE** |
| 10-D | Progress sync + activity logging (replace localStorage, track usage) | **DONE** |
| 10-E | Teacher dashboard (student list, login counts, activity stats) | **DONE** |
| 10-F | Custom domain (optional) | Pending |

---

## Hosting & Infrastructure

### Live URL
- **Vercel**: `https://historylab-kappa.vercel.app/`
- **GitHub**: `https://github.com/udaysharma10/historylab` (branch: `main`)
- **Auto-deploy**: Every push to `main` triggers a Vercel deploy

### Development Workflow
- **`dev` branch**: All new development and testing happens here first
- **`main` branch**: Production only — merged from `dev` when approved
- **Local dev server**: `PATH="/Users/udaysharma/.nvm/versions/node/v20.20.0/bin:$PATH" npx vite --host` → `http://localhost:5173/`
- **Deploy flow**: `git checkout main && git merge dev && git push origin main` → Vercel auto-deploys → `git checkout dev`
- **Never push directly to `main`** without explicit approval

### Backend (Phase 10-B onwards)
- **Supabase** (BaaS): Auth + PostgreSQL + REST API
- **Region**: Mumbai (ref: zqryzlkvieljadntlomz)
- **Auth**: Google OAuth + profile setup (name, school, role: Student/Teacher/Parent)
- **Admin teacher emails**: Configured in `src/lib/adminEmails.ts` — skip profile setup, auto-redirect to `/dashboard`
  - Currently: `uday@teknomatics.com` only
- **Teacher Dashboard**: `/dashboard` — admin-only (via `adminEmails.ts`), 3 tabs: All Users (expandable per-section progress), Login History (date-wise), Activity Breakdown
- **RLS Policies**: Fixed infinite recursion with `is_admin_teacher()` and `is_teacher_at_school()` security definer functions (see `supabase-admin-fix.sql`)
- **Activity logging**: All completions logged to `activity_logs` table
- **Progress sync**: Zustand state synced to `student_progress` table (debounced 1s), localStorage as offline fallback
- **Auth UX**: Google OAuth with `prompt: 'select_account'` (forces account picker), sign-out clears localStorage, ProfileSetup shows errors + sign-out link
- **Detailed plan**: See `PLAN_AUTH_AND_ANALYTICS.md`
