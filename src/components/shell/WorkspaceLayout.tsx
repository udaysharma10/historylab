import { Outlet, useLocation, useParams } from 'react-router-dom'
import { getChapter } from '../../data/getChapter'
import { getChapter as getBookChapter } from '../../data/books'
import { WorkspaceShell, type Crumb } from './WorkspaceShell'

const TOOL_LABELS: Record<string, string> = {
  timeline: 'Timeline',
  maps: 'Maps',
  flashcards: 'Flashcards',
  figures: 'Figures',
  exam: 'Exam Prep',
  tests: 'Mock Tests',
}

function chapterNumberOf(chapterId: string): number {
  const match = chapterId.match(/\d+/)
  return match ? parseInt(match[0], 10) : 1
}

// Route-level workspace wrapper: gives every workspace pane the shell with an
// auto-computed breadcrumb (max two segments — decision #37). Pages that need
// a custom rail (Overview, Section) graduate to composing WorkspaceShell
// directly during the Stage 2 port.
export function WorkspaceLayout() {
  const { chapterId, sectionId } = useParams<{ chapterId: string; sectionId: string }>()
  const { pathname } = useLocation()
  const cid = chapterId || 'ch1'
  const base = `/chapter/${cid}`
  const chapterNumber = chapterNumberOf(cid)

  // One crumb grammar everywhere (Uday 2026-07-27, supersedes the #37
  // two-segment cap): All Chapters › {chapter title} › {current page}.
  const chapterTitle = getBookChapter('history-10', cid)?.title ?? `Chapter ${chapterNumber}`
  const root: Crumb[] = [
    { label: 'All Chapters', to: '/' },
    { label: chapterTitle, to: base },
  ]

  let crumbs: Crumb[]
  if (sectionId) {
    const section = getChapter(cid)?.sections.find((s) => s.id === sectionId)
    crumbs = [...root, { label: section ? `Section ${section.number}` : 'Section' }]
  } else if (pathname === base) {
    crumbs = [{ label: 'All Chapters', to: '/' }, { label: chapterTitle }]
  } else {
    const rest = pathname.slice(base.length + 1)
    const segment = rest.split('/')[0]
    if (segment === 'tests' && rest.startsWith('tests/result')) {
      // Detail page under Mock Tests — the only tool route with real depth.
      crumbs = [...root, { label: 'Mock Tests', to: `${base}/tests` }, { label: 'Result' }]
    } else {
      crumbs = [...root, { label: TOOL_LABELS[segment] || 'Tools' }]
    }
  }

  return (
    <WorkspaceShell chapterId={cid} chapterNumber={chapterNumber} crumbs={crumbs}>
      <Outlet />
    </WorkspaceShell>
  )
}
