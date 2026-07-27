import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { getChapter, getChapterPreview, CHAPTER_SECTION_COLORS } from '../data/getChapter'
import { NarrativeMode } from './NarrativeMode'

// Altitude 3 — the topic reader route (decision #37): topics have URLs so the
// resume band can deep-link and the browser back button walks up one level.
// URL uses a 1-based index (/topic/3 = third topic) to match how students
// see topics numbered. The card-by-card flow inside NarrativeMode is
// unchanged (decision #38 — Neha's call).
export function TopicReader() {
  const { chapterId, sectionId, topicIndex } = useParams<{
    chapterId: string
    sectionId: string
    topicIndex: string
  }>()
  const navigate = useNavigate()
  const cid = chapterId || 'ch1'
  const sectionPath = `/chapter/${cid}/section/${sectionId}`

  // Preview users: locked sections bounce to the chapter home (same rule as
  // the section page — the server withholds the content anyway).
  const previewSection = getChapterPreview(cid)
  if (previewSection && sectionId !== previewSection) {
    return <Navigate to={`/chapter/${cid}`} replace />
  }

  const section = getChapter(cid)?.sections.find((s) => s.id === sectionId)
  const parsed = parseInt(topicIndex || '', 10)
  const index = Number.isNaN(parsed) ? -1 : parsed - 1

  if (!section || index < 0 || index >= section.subsections.length) {
    return <Navigate to={section ? sectionPath : `/chapter/${cid}`} replace />
  }

  const color = (CHAPTER_SECTION_COLORS[cid] || {})[section.id] || '#3E3548'
  const subsection = section.subsections[index]

  return (
    <NarrativeMode
      key={subsection.id}
      subsection={subsection}
      sectionColor={color}
      sectionTitle={`Section ${section.number} · ${section.title}`}
      subsectionIndex={index}
      totalSubsections={section.subsections.length}
      onComplete={() => {
        // Completion is recorded inside NarrativeMode (progress store)
      }}
      onNextSubsection={() => {
        if (index < section.subsections.length - 1) {
          navigate(`${sectionPath}/topic/${index + 2}`)
        } else {
          navigate(sectionPath)
        }
      }}
      onBackToSection={() => navigate(sectionPath)}
    />
  )
}
