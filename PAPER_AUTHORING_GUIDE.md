# Paper Authoring Guide — HistoryLab Test Centre

**Who this is for:** the paper author (our Senior CBSE Examiner). Write the paper as plain
text in Google Docs / Word / Notes — anywhere. When it's ready, it gets pasted into
**Admin → Papers → Upload a paper** on historylab.in, previewed, and published with one click.

The format is designed so you write almost exactly the way a question paper reads.

---

## 1. The header (top of the document)

```
PAPER: ch2-p1
CHAPTER: ch2
TITLE: Nationalism in India — Practice Paper 1
DESCRIPTION: Full board-pattern paper covering all five sections
DURATION: 60
```

- **PAPER** — a short id: chapter + paper number (`ch2-p1`, `ch2-p2`, `ch1-p1`…). Re-uploading
  with the same id **replaces** that paper (that's how you fix typos).
- **CHAPTER** — which chapter it belongs to (`ch1`, `ch2`).
- **DURATION** — minutes on the clock. The timer is enforced server-side.
- DESCRIPTION is optional. `POSITION: 2` (optional) controls ordering when a chapter has
  several papers.

## 2. Sections

Write `SECTION A`, `SECTION B` … on their own line. Every question after it belongs to that
section until the next `SECTION` line. Use the CBSE pattern: A = objective, B = 2-mark,
C = 3-mark, D = 5-mark, E = source/case-based.

## 3. Questions

Every question starts with `Q.` followed by its marks in square brackets:

### MCQ (auto-marked instantly)

```
Q. [1] In which year did the Jallianwala Bagh massacre take place?
a) 1918
b) 1919 *
c) 1920
d) 1921
```

Mark the correct option with a `*` at the end of its line. 2–6 options, exactly one `*`.
Assertion–Reason questions are just MCQs — put A and R in the question text.

### Written answers (2/3/5 marks)

```
Q. [3] Why did Gandhiji decide to withdraw the Non-Cooperation Movement?
SCHEME:
- Chauri Chaura (Feb 1922): the movement turned violent when a crowd burnt a police station (1)
- Gandhiji felt satyagrahis needed proper training before mass struggle (1)
- He believed non-violence could not yet be maintained by the masses (1)
MODEL:
Gandhiji withdrew the Non-Cooperation Movement in February 1922 after the Chauri Chaura
incident, where an agitated crowd set fire to a police station, killing policemen. He felt
the movement was turning violent and that satyagrahis were not yet ready for mass struggle.
```

- **HINT:** (optional, before SCHEME) — a one-or-two-line "Board technique" tip shown to the
  student *while answering* (e.g. `HINT: 3 marks = 3 distinct points, one per line.`). Never
  put the answer in the hint — it's writing technique only.
- **SCHEME:** — the point-wise marking scheme, one point per line as `- point text (marks)`.
  This is exactly what the AI marker (and you, in examiner reviews) award marks against.
  The points should add up to the question's marks.
- **MODEL:** — the model answer a student sees after submitting. Everything until the next
  `Q.`/`SECTION` line is part of it. **MODEL is required** for every written question.

## 4. Source-based questions (Section E)

Define the passage once, before the questions:

```
SOURCE: src-1 | The Movement in the Towns
The movement started with middle-class participation in the cities. Thousands of students
left government-controlled schools and colleges, headmasters and teachers resigned...
END SOURCE
```

Then reference it in each sub-question — each sub-question is its own `Q.` line:

```
Q. [1] SOURCE src-1 Which movement is the passage describing?
a) Civil Disobedience Movement
b) Non-Cooperation Movement *
c) Quit India Movement
d) Khilafat Movement

Q. [2] SOURCE src-1 Explain why the movement slowed down in the cities.
SCHEME:
- Khadi was more expensive than mill cloth; the poor could not afford it (1)
- No alternative Indian institutions to replace British ones (1)
MODEL:
The movement in the cities slowed down because khadi cloth was more expensive...
```

The passage is shown above every question that references it.

## 5. Checklist before upload

- [ ] Header has PAPER, CHAPTER, TITLE, DURATION
- [ ] Every MCQ has exactly one `*`
- [ ] Every written question has SCHEME points (adding to its marks) and a MODEL answer
- [ ] Source ids referenced by questions are defined with `SOURCE: … END SOURCE`
- [ ] Marks per section follow the CBSE pattern you intend

The upload screen's **Parse & preview** shows exact line numbers for anything that needs
fixing, and papers always land as **drafts** — students see nothing until you press Publish.

---

*Uploads replace the paper's questions. If students have already attempted the paper, their
scores stay but their saved answer sheets for it are cleared — the upload screen warns first.*
