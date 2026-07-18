// Sprint 4: typed client for the test-engine Edge Function — the single
// server authority for papers, attempts, autosave, and marking (plan §7, §12.1).
// The client never sees answer keys until an attempt is submitted.
import { supabase } from './supabase'

export interface PaperMeta {
  id: string
  chapter_id: string
  title: string
  description: string | null
  total_marks: number
  objective_marks: number
  question_count: number
  duration_minutes: number
  position: number
  status: 'draft' | 'published'
}

export interface AttemptMeta {
  id: string
  paper_id: string
  status: 'in_progress' | 'submitted'
  started_at: string
  deadline: string
  submitted_at: string | null
  auto_submitted: boolean
  objective_awarded: number | null
  objective_max: number | null
}

export interface PlayerQuestion {
  id: string
  position: number
  section_label: string
  qtype: 'mcq' | 'text'
  marks: number
  prompt: string
  source_id: string | null
  options: string[] | null
}

export interface ResultQuestion extends PlayerQuestion {
  correct_index: number | null
  scheme: {
    model_answer?: string
    points?: { point: string; marks: number }[]
  } | null
}

export interface PaperSource {
  source_id: string
  title: string | null
  body: string
}

export type AnswerResponse = { choice: number } | { text: string }

export interface SavedAnswer {
  question_id: string
  response: AnswerResponse
}

export interface ResultAnswer extends SavedAnswer {
  is_correct: boolean | null
  marks_awarded: number | null
  marking: unknown
}

export interface ListResult {
  papers: PaperMeta[]
  attempts: AttemptMeta[]
  entitled: boolean
}

export interface StartResult {
  attempt: { id: string; status: string; started_at: string; deadline: string }
  server_now: string
  paper: Pick<PaperMeta, 'id' | 'chapter_id' | 'title' | 'description' | 'total_marks' | 'duration_minutes'>
  questions: PlayerQuestion[]
  sources: PaperSource[]
  saved: SavedAnswer[]
}

export interface AttemptResult {
  attempt: {
    id: string
    status: string
    started_at: string
    submitted_at: string
    auto_submitted: boolean
    objective_awarded: number
    objective_max: number
  }
  paper: Pick<PaperMeta, 'id' | 'chapter_id' | 'title' | 'total_marks' | 'objective_marks' | 'duration_minutes'>
  questions: ResultQuestion[]
  sources: PaperSource[]
  answers: ResultAnswer[]
}

export class TestEngineError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function call<T>(body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke('test-engine', { body })
  if (error) {
    // Surface the server's error body (matches the razorpay.ts pattern).
    let message = error.message ?? 'request failed'
    let status = 500
    const ctx = (error as { context?: Response }).context
    if (ctx instanceof Response) {
      status = ctx.status
      try {
        const parsed = await ctx.clone().json()
        if (parsed?.error) message = parsed.error
      } catch {
        // keep the generic message
      }
    }
    throw new TestEngineError(message, status)
  }
  if (data?.error) throw new TestEngineError(data.error, 400)
  return data as T
}

export const testEngine = {
  list: (chapter: string) => call<ListResult>({ action: 'list', chapter }),
  start: (paperId: string) => call<StartResult>({ action: 'start', paper_id: paperId }),
  save: (attemptId: string, answers: SavedAnswer[]) =>
    call<{ ok: true; saved: number; server_now: string }>({
      action: 'save',
      attempt_id: attemptId,
      answers,
    }),
  submit: (attemptId: string) =>
    call<{ ok: true; attempt: AttemptMeta }>({ action: 'submit', attempt_id: attemptId }),
  result: (attemptId: string) => call<AttemptResult>({ action: 'result', attempt_id: attemptId }),

  // admin
  upsertPaper: (paper: unknown) =>
    call<{ ok: true; paper_id: string; status: string; total_marks: number; objective_marks: number; question_count: number }>(
      { action: 'upsert_paper', paper },
    ),
  setStatus: (paperId: string, status: 'draft' | 'published') =>
    call<{ ok: true }>({ action: 'set_status', paper_id: paperId, status }),
  deletePaper: (paperId: string) =>
    call<{ ok: true }>({ action: 'delete_paper', paper_id: paperId }),
  adminList: () =>
    call<{ papers: PaperMeta[]; attempt_counts: Record<string, number> }>({ action: 'admin_list' }),
  getPaperAdmin: (paperId: string) =>
    call<{ paper: PaperMeta; questions: ResultQuestion[]; sources: PaperSource[] }>(
      { action: 'get_paper', paper_id: paperId },
    ),
}
