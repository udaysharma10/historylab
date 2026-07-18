import { useState, useEffect, useCallback } from 'react'
import { testEngine, type PaperMeta } from '../../lib/testEngine'
import { parsePaper, type ParsedPaper } from '../../lib/paperFormat'

// Sprint 4 (plan §6): admin paper authoring — paste Neha's structured-text
// paper, parse + preview client-side, upload via the test-engine function
// (service role writes; answer keys never touch the repo or client tables).
export function PapersAdmin() {
  const [papers, setPapers] = useState<PaperMeta[]>([])
  const [attemptCounts, setAttemptCounts] = useState<Record<string, number>>({})
  const [text, setText] = useState('')
  const [parsed, setParsed] = useState<ParsedPaper | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [warnings, setWarnings] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')

  const load = useCallback(() => {
    testEngine
      .adminList()
      .then((res) => {
        setPapers(res.papers)
        setAttemptCounts(res.attempt_counts)
      })
      .catch((e) => setStatus(`Could not load papers: ${e.message}`))
  }, [])

  useEffect(load, [load])

  const handleParse = () => {
    setStatus('')
    const outcome = parsePaper(text)
    setErrors(outcome.errors)
    setWarnings(outcome.warnings)
    setParsed(outcome.paper ?? null)
  }

  const handleUpload = async () => {
    if (!parsed) return
    const existing = papers.find((p) => p.id === parsed.id)
    const attempts = existing ? (attemptCounts[existing.id] ?? 0) : 0
    if (
      attempts > 0 &&
      !window.confirm(
        `"${existing?.title}" already has ${attempts} attempt(s). Re-uploading replaces all questions and CLEARS past answer sheets for this paper (scores on attempts are kept). Continue?`,
      )
    ) {
      return
    }
    setBusy(true)
    setStatus('')
    try {
      const res = await testEngine.upsertPaper(parsed)
      setStatus(
        `✅ Uploaded "${parsed.title}" — ${res.question_count} questions, ${res.total_marks} marks (${res.objective_marks} objective). Status: ${res.status}.`,
      )
      setParsed(null)
      setText('')
      setErrors([])
      setWarnings([])
      load()
    } catch (e) {
      setStatus(`❌ Upload failed: ${(e as Error).message}`)
    } finally {
      setBusy(false)
    }
  }

  const togglePublish = async (paper: PaperMeta) => {
    setBusy(true)
    try {
      await testEngine.setStatus(paper.id, paper.status === 'published' ? 'draft' : 'published')
      load()
    } catch (e) {
      setStatus(`❌ ${(e as Error).message}`)
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async (paper: PaperMeta) => {
    const attempts = attemptCounts[paper.id] ?? 0
    if (
      !window.confirm(
        `Delete "${paper.title}"? This removes the paper, its questions${
          attempts > 0 ? ` and ${attempts} student attempt(s)` : ''
        } permanently.`,
      )
    ) {
      return
    }
    setBusy(true)
    try {
      await testEngine.deletePaper(paper.id)
      load()
    } catch (e) {
      setStatus(`❌ ${(e as Error).message}`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Existing papers */}
      <div className="bg-white rounded-2xl border border-hist-line shadow-card p-5">
        <h3 className="font-display font-bold text-hist-dark mb-3">Papers</h3>
        {papers.length === 0 && (
          <p className="font-body text-sm text-gray-400">No papers yet — upload the first one below.</p>
        )}
        <div className="space-y-2">
          {papers.map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-2 border border-hist-line rounded-xl px-3 py-2.5"
            >
              <div>
                <div className="font-body font-semibold text-sm text-hist-dark">
                  {p.title}{' '}
                  <span
                    className={`text-[10px] font-bold uppercase rounded-full px-2 py-0.5 ml-1 ${
                      p.status === 'published'
                        ? 'bg-hist-green/15 text-hist-green'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
                <div className="font-body text-xs text-gray-400">
                  {p.id} · {p.question_count} Qs · {p.total_marks} marks · {p.duration_minutes} min
                  · {attemptCounts[p.id] ?? 0} attempts
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className={`font-display font-bold text-xs rounded-lg px-3 py-1.5 btn-press disabled:opacity-50 ${
                    p.status === 'published'
                      ? 'bg-gray-100 text-gray-500'
                      : 'bg-hist-green text-white'
                  }`}
                  disabled={busy}
                  onClick={() => togglePublish(p)}
                >
                  {p.status === 'published' ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  className="font-display font-bold text-xs text-red-500 bg-red-50 rounded-lg px-3 py-1.5 btn-press disabled:opacity-50"
                  disabled={busy}
                  onClick={() => handleDelete(p)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload */}
      <div className="bg-white rounded-2xl border border-hist-line shadow-card p-5">
        <h3 className="font-display font-bold text-hist-dark mb-1">Upload a paper</h3>
        <p className="font-body text-xs text-gray-500 mb-3">
          Paste the paper in the authoring format (see <code>PAPER_AUTHORING_GUIDE.md</code>).
          Parse first to preview; new papers land as <b>drafts</b> — publish when ready.
        </p>
        <textarea
          className="w-full min-h-[260px] font-mono text-xs border-2 border-hist-line focus:border-hist-blue rounded-xl px-3 py-2.5 outline-none resize-y"
          placeholder={
            'PAPER: ch2-p2\nCHAPTER: ch2\nTITLE: Nationalism in India — Practice Paper 2\nDURATION: 60\n\nSECTION A\n\nQ. [1] In which year did the Jallianwala Bagh massacre take place?\na) 1918\nb) 1919 *\nc) 1920\nd) 1921\n…'
          }
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setParsed(null)
          }}
        />
        <div className="flex gap-2 mt-3">
          <button
            className="font-display font-bold text-white bg-hist-blue rounded-xl px-4 py-2 text-sm btn-press disabled:opacity-50"
            disabled={!text.trim() || busy}
            onClick={handleParse}
          >
            Parse & preview
          </button>
          {parsed && (
            <button
              className="font-display font-bold text-white rounded-xl px-4 py-2 text-sm btn-press disabled:opacity-50"
              style={{ backgroundColor: '#C05F35' }}
              disabled={busy}
              onClick={handleUpload}
            >
              {busy ? 'Uploading…' : `Upload "${parsed.title}"`}
            </button>
          )}
        </div>

        {errors.length > 0 && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <div className="font-display font-bold text-sm text-red-600 mb-1">Fix these first:</div>
            <ul className="font-body text-xs text-red-600 space-y-0.5">
              {errors.map((e, i) => (
                <li key={i}>• {e}</li>
              ))}
            </ul>
          </div>
        )}
        {warnings.length > 0 && (
          <div className="mt-3 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
            <div className="font-display font-bold text-sm text-orange-600 mb-1">Warnings:</div>
            <ul className="font-body text-xs text-orange-600 space-y-0.5">
              {warnings.map((w, i) => (
                <li key={i}>• {w}</li>
              ))}
            </ul>
          </div>
        )}
        {parsed && (
          <div className="mt-3 bg-hist-green/5 border border-hist-green/20 rounded-xl px-4 py-3">
            <div className="font-display font-bold text-sm text-hist-dark mb-1">
              ✅ {parsed.title}
            </div>
            <div className="font-body text-xs text-gray-600">
              {parsed.id} → {parsed.chapter_id} · {parsed.questions.length} questions ·{' '}
              {parsed.questions.reduce((s, q) => s + q.marks, 0)} marks (
              {parsed.questions.filter((q) => q.qtype === 'mcq').reduce((s, q) => s + q.marks, 0)}{' '}
              objective) · {parsed.duration_minutes} min · {parsed.sources.length} source passage(s)
            </div>
            <div className="font-body text-xs text-gray-500 mt-1">
              Sections:{' '}
              {[...new Set(parsed.questions.map((q) => q.section_label))]
                .map(
                  (s) =>
                    `${s} (${parsed.questions.filter((q) => q.section_label === s).length})`,
                )
                .join(' · ')}
            </div>
          </div>
        )}
        {status && <p className="font-body text-sm text-hist-dark mt-3">{status}</p>}
      </div>
    </div>
  )
}
