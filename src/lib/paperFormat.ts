// Sprint 4: parser for the paper authoring format (PAPER_AUTHORING_GUIDE.md).
// Neha authors papers as structured plain text (in Google Docs or anywhere);
// the admin Papers tab pastes it here, parses to the upsert_paper JSON, shows
// a preview + errors, and uploads. Answer keys never touch the repo — this
// runs in the admin's browser and posts straight to the Edge Function.
import { CONTENT_NS } from './contentIds'

export interface ParsedScheme {
  model_answer: string
  points?: { point: string; marks: number }[]
}

export interface ParsedQuestion {
  section_label: string
  qtype: 'mcq' | 'text'
  marks: number
  prompt: string
  source_id?: string
  options?: string[]
  correct_index?: number
  scheme?: ParsedScheme
  /** "Board technique" tip shown while answering (launch-07 mockup) */
  hint?: string
}

export interface ParsedPaper {
  id: string
  chapter_id: string
  title: string
  description?: string
  duration_minutes: number
  position?: number
  sources: { source_id: string; title?: string; body: string }[]
  questions: ParsedQuestion[]
}

export interface ParseOutcome {
  paper?: ParsedPaper
  errors: string[]
  warnings: string[]
}

const OPTION_RE = /^([a-f])\)\s+(.*)$/i
const QUESTION_RE = /^Q\.?\s*\[(\d+)\]\s*(?:SOURCE\s+([a-z0-9-]+)\s+)?(.*)$/i
const SECTION_RE = /^SECTION\s+([A-Z0-9]+)\s*$/i
const SOURCE_START_RE = /^SOURCE:\s*([a-z0-9-]+)\s*(?:\|\s*(.*))?$/i
const POINT_RE = /^[-•]\s*(.*?)\s*\((\d+(?:\.\d+)?)\)\s*$/

export function parsePaper(text: string): ParseOutcome {
  const errors: string[] = []
  const warnings: string[] = []
  const lines = text.replace(/\r\n/g, '\n').split('\n')

  const header: Record<string, string> = {}
  const sources: ParsedPaper['sources'] = []
  const questions: ParsedQuestion[] = []

  let i = 0
  let section = 'A'

  // Modes while walking a question body
  type QDraft = {
    line: number
    marks: number
    source_id?: string
    promptLines: string[]
    options: { text: string; correct: boolean }[]
    schemePoints: { point: string; marks: number }[]
    modelLines: string[]
    hintLines: string[]
    mode: 'prompt' | 'scheme' | 'model' | 'hint'
    section: string
  }
  let draft: QDraft | null = null

  const finishQuestion = () => {
    if (!draft) return
    const d = draft
    draft = null
    const prompt = d.promptLines.join('\n').trim()
    if (!prompt) {
      errors.push(`Line ${d.line}: question has no text`)
      return
    }
    if (d.options.length > 0) {
      if (d.options.length < 2 || d.options.length > 6) {
        errors.push(`Line ${d.line}: MCQ needs 2–6 options (found ${d.options.length})`)
        return
      }
      const correct = d.options.map((o, idx) => (o.correct ? idx : -1)).filter((x) => x >= 0)
      if (correct.length !== 1) {
        errors.push(
          `Line ${d.line}: mark exactly ONE option with a trailing * (found ${correct.length})`,
        )
        return
      }
      if (d.schemePoints.length || d.modelLines.length) {
        warnings.push(`Line ${d.line}: SCHEME/MODEL on an MCQ is ignored (auto-marked)`)
      }
      questions.push({
        section_label: d.section,
        qtype: 'mcq',
        marks: d.marks,
        prompt,
        source_id: d.source_id,
        options: d.options.map((o) => o.text),
        correct_index: correct[0],
        hint: d.hintLines.join('\n').trim() || undefined,
      })
    } else {
      const model = d.modelLines.join('\n').trim()
      if (!model) {
        errors.push(
          `Line ${d.line}: written question needs a MODEL: block (the marking-scheme answer)`,
        )
        return
      }
      const schemeMarks = d.schemePoints.reduce((s, p) => s + p.marks, 0)
      if (d.schemePoints.length && schemeMarks !== d.marks) {
        warnings.push(
          `Line ${d.line}: scheme points add to ${schemeMarks} but the question is [${d.marks}] marks`,
        )
      }
      questions.push({
        section_label: d.section,
        qtype: 'text',
        marks: d.marks,
        prompt,
        source_id: d.source_id,
        scheme: {
          model_answer: model,
          points: d.schemePoints.length ? d.schemePoints : undefined,
        },
        hint: d.hintLines.join('\n').trim() || undefined,
      })
    }
  }

  while (i < lines.length) {
    const raw = lines[i]
    const line = raw.trim()

    // Header block (before any question/section/source)
    const headerMatch = !draft && /^(PAPER|CHAPTER|TITLE|DESCRIPTION|DURATION|POSITION):\s*(.*)$/.exec(line)
    if (headerMatch && !SOURCE_START_RE.test(line)) {
      header[headerMatch[1]] = headerMatch[2].trim()
      i++
      continue
    }

    const sourceMatch = SOURCE_START_RE.exec(line)
    if (sourceMatch && !draft) {
      const source_id = sourceMatch[1].toLowerCase()
      const title = sourceMatch[2]?.trim() || undefined
      const bodyLines: string[] = []
      i++
      while (i < lines.length && !/^END\s*SOURCE\s*$/i.test(lines[i].trim())) {
        bodyLines.push(lines[i])
        i++
      }
      if (i >= lines.length) errors.push(`Source "${source_id}" is missing END SOURCE`)
      else i++ // skip END SOURCE
      const body = bodyLines.join('\n').trim()
      if (!body) errors.push(`Source "${source_id}" has an empty passage`)
      else sources.push({ source_id, title, body })
      continue
    }

    const sectionMatch = SECTION_RE.exec(line)
    if (sectionMatch) {
      finishQuestion()
      section = sectionMatch[1].toUpperCase()
      i++
      continue
    }

    const qMatch = QUESTION_RE.exec(line)
    if (qMatch) {
      finishQuestion()
      draft = {
        line: i + 1,
        marks: parseInt(qMatch[1], 10),
        source_id: qMatch[2]?.toLowerCase(),
        promptLines: qMatch[3] ? [qMatch[3]] : [],
        options: [],
        schemePoints: [],
        modelLines: [],
        hintLines: [],
        mode: 'prompt',
        section,
      }
      i++
      continue
    }

    if (draft) {
      const d: QDraft = draft
      const schemeStart = /^SCHEME:\s*(.*)$/i.exec(line)
      const modelStart = /^MODEL:\s*(.*)$/i.exec(line)
      const hintStart = /^HINT:\s*(.*)$/i.exec(line)
      if (hintStart) {
        d.mode = 'hint'
        if (hintStart[1]) d.hintLines.push(hintStart[1])
      } else if (schemeStart) {
        d.mode = 'scheme'
        if (schemeStart[1]) {
          const pointMatch = POINT_RE.exec(schemeStart[1])
          if (pointMatch) {
            d.schemePoints.push({ point: pointMatch[1], marks: parseFloat(pointMatch[2]) })
          }
        }
      } else if (modelStart) {
        d.mode = 'model'
        if (modelStart[1]) d.modelLines.push(modelStart[1])
      } else {
        const optMatch = OPTION_RE.exec(line)
        if (optMatch && d.mode === 'prompt') {
          const correct = /\*\s*$/.test(optMatch[2])
          d.options.push({
            text: optMatch[2].replace(/\s*\*\s*$/, '').trim(),
            correct,
          })
        } else if (d.mode === 'scheme') {
          const pointMatch = POINT_RE.exec(line)
          if (pointMatch) {
            d.schemePoints.push({ point: pointMatch[1], marks: parseFloat(pointMatch[2]) })
          } else if (line) {
            errors.push(
              `Line ${i + 1}: scheme points must look like "- point text (1)" — got "${line}"`,
            )
          }
        } else if (d.mode === 'model') {
          if (line || d.modelLines.length) d.modelLines.push(raw)
        } else if (d.mode === 'hint') {
          if (line) d.hintLines.push(raw)
        } else if (d.options.length === 0) {
          if (line || d.promptLines.length) d.promptLines.push(raw)
        } else if (line) {
          errors.push(`Line ${i + 1}: unexpected text after MCQ options — "${line}"`)
        }
      }
      i++
      continue
    }

    if (line) warnings.push(`Line ${i + 1}: ignored text outside any question — "${line.slice(0, 60)}"`)
    i++
  }
  finishQuestion()

  // Header validation
  if (!header.PAPER) errors.push('Missing "PAPER:" header (e.g. PAPER: ch2-p1)')
  if (!header.CHAPTER) errors.push('Missing "CHAPTER:" header (e.g. CHAPTER: ch2)')
  if (!header.TITLE) errors.push('Missing "TITLE:" header')
  const duration = parseInt(header.DURATION ?? '', 10)
  if (!duration || duration < 5 || duration > 180) {
    errors.push('DURATION must be minutes between 5 and 180 (e.g. DURATION: 60)')
  }
  if (questions.length === 0) errors.push('No questions found — start each with "Q. [marks]"')

  // source references
  const sourceIds = new Set(sources.map((s) => s.source_id))
  for (const [idx, q] of questions.entries()) {
    if (q.source_id && !sourceIds.has(q.source_id)) {
      errors.push(`Question ${idx + 1} references SOURCE ${q.source_id} which is not defined`)
    }
  }
  for (const s of sources) {
    if (!questions.some((q) => q.source_id === s.source_id)) {
      warnings.push(`Source "${s.source_id}" is defined but no question uses it`)
    }
  }

  if (errors.length) return { errors, warnings }

  // Namespace paper/chapter ids the same way as chapter content (c10-hist-…).
  const chapterRaw = header.CHAPTER.toLowerCase()
  const chapter_id = chapterRaw.startsWith(CONTENT_NS) ? chapterRaw : `${CONTENT_NS}-${chapterRaw}`
  const paperRaw = header.PAPER.toLowerCase()
  const id = paperRaw.startsWith(CONTENT_NS) ? paperRaw : `${CONTENT_NS}-${paperRaw}`

  return {
    errors,
    warnings,
    paper: {
      id,
      chapter_id,
      title: header.TITLE,
      description: header.DESCRIPTION || undefined,
      duration_minutes: duration,
      position: header.POSITION ? parseInt(header.POSITION, 10) : undefined,
      sources,
      questions,
    },
  }
}
