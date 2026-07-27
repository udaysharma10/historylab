import { useState, useEffect } from 'react'
import { createBrowserRouter, Navigate, Outlet, useParams } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { useAccess } from './components/auth/AccessProvider'
import { getCachedBundle, loadChapterBundle } from './data/chapterBundle'
import { WorkspaceLayout } from './components/shell/WorkspaceLayout'
import { BookHome } from './modules/BookHome'
import { HomePage } from './modules/HomePage'
import { SectionModule } from './modules/SectionModule'
import { TopicReader } from './modules/TopicReader'
import { QuizMode } from './modules/QuizMode'
import { TimelineMode } from './modules/TimelineMode'
import { MapMode } from './modules/MapMode'
import { FigureMode } from './modules/FigureMode'
import { FlashcardMode } from './modules/FlashcardMode'
import { ExamPractice } from './modules/ExamPractice'
import { TestCentre } from './modules/testcentre/TestCentre'
import { PaperPlayer } from './modules/testcentre/PaperPlayer'
import { AttemptResult } from './modules/testcentre/AttemptResult'
import { TeacherDashboard } from './modules/TeacherDashboard'
import { AdminPanel } from './modules/AdminPanel'
import { TermsPage, PrivacyPage, RefundPage } from './modules/legal/LegalPages'

// Blocks direct URLs to chapters this user isn't allowed into (content ships in
// the bundle, so the BookHome card gate alone isn't enough for deep links).
// Server-driven (entitlements) since Sprint 1 — cosmetic until Sprint 2 moves
// premium content behind the get-chapter Edge Function.
function RequireChapterAccess() {
  const { chapterId } = useParams<{ chapterId: string }>()
  const { loading, canOpenChapter } = useAccess()
  const slug = chapterId || ''
  const bundled = !!getCachedBundle(slug)
  const [bundleState, setBundleState] = useState<'loading' | 'ready' | 'error'>(
    bundled ? 'ready' : 'loading'
  )

  // ALL chapter content is fetched from the get-chapter Edge Function (the
  // real paywall — full chapter when entitled, free-preview section when not)
  // and cached for the session before the route renders.
  useEffect(() => {
    if (loading || bundled || !canOpenChapter(slug)) return
    let cancelled = false
    loadChapterBundle(slug)
      .then(() => !cancelled && setBundleState('ready'))
      .catch(() => !cancelled && setBundleState('error'))
    return () => {
      cancelled = true
    }
  }, [slug, loading, bundled, canOpenChapter])

  if (loading) return null // don't bounce deep links before entitlements load
  if (!canOpenChapter(slug) || bundleState === 'error') {
    return <Navigate to="/" replace />
  }
  if (bundleState !== 'ready') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-float">📜</div>
          <p className="text-gray-400 font-body text-sm">Opening your chapter…</p>
        </div>
      </div>
    )
  }
  return <Outlet />
}

// Backward compat redirects for old /section/:sectionId routes
function RedirectToChapter() {
  const { sectionId } = useParams()
  return <Navigate to={`/chapter/ch1/section/${sectionId}`} replace />
}
function RedirectToChapterQuiz() {
  const { sectionId } = useParams()
  return <Navigate to={`/chapter/ch1/section/${sectionId}/quiz`} replace />
}

export const router = createBrowserRouter([
  // Legal pages (also reachable signed-out via AuthGuard's public branch)
  { path: '/terms', element: <TermsPage /> },
  { path: '/privacy', element: <PrivacyPage /> },
  { path: '/refunds', element: <RefundPage /> },
  {
    path: '/',
    element: <AppShell />,
    children: [
      // Altitude 1 — the shelf (chapter selector)
      { index: true, element: <BookHome /> },

      // Backward compat — old routes redirect to ch1
      { path: 'section/:sectionId', element: <RedirectToChapter /> },
      { path: 'section/:sectionId/quiz', element: <RedirectToChapterQuiz /> },
      { path: 'timeline', element: <Navigate to="/chapter/ch1/timeline" replace /> },
      { path: 'maps', element: <Navigate to="/chapter/ch1/maps" replace /> },
      { path: 'flashcards', element: <Navigate to="/chapter/ch1/flashcards" replace /> },
      { path: 'figures', element: <Navigate to="/chapter/ch1/figures" replace /> },
      { path: 'exam', element: <Navigate to="/chapter/ch1/exam" replace /> },

      // Dashboard + admin
      { path: 'dashboard', element: <TeacherDashboard /> },
      { path: 'admin', element: <AdminPanel /> },
    ],
  },

  // Chapter-scoped routes (guarded) — V2 three-altitude layout (decision #37/#38):
  // workspace panes render inside WorkspaceLayout (sidebar + pane + rail);
  // immersive experiences (reader, quiz, paper player) render full-screen.
  {
    element: <RequireChapterAccess />,
    children: [
      // Overview + Section compose WorkspaceShell themselves (custom rails)
      { path: '/chapter/:chapterId', element: <HomePage /> },
      { path: '/chapter/:chapterId/section/:sectionId', element: <SectionModule /> },
      {
        element: <WorkspaceLayout />,
        children: [
          { path: '/chapter/:chapterId/timeline', element: <TimelineMode /> },
          { path: '/chapter/:chapterId/maps', element: <MapMode /> },
          { path: '/chapter/:chapterId/flashcards', element: <FlashcardMode /> },
          { path: '/chapter/:chapterId/figures', element: <FigureMode /> },
          { path: '/chapter/:chapterId/exam', element: <ExamPractice /> },
          { path: '/chapter/:chapterId/tests', element: <TestCentre /> },
          { path: '/chapter/:chapterId/tests/result/:attemptId', element: <AttemptResult /> },
        ],
      },
      // Altitude 3 — immersion, shell hidden
      {
        path: '/chapter/:chapterId/section/:sectionId/topic/:topicIndex',
        element: <TopicReader />,
      },
      { path: '/chapter/:chapterId/section/:sectionId/quiz', element: <QuizMode /> },
      { path: '/chapter/:chapterId/tests/:paperId/play', element: <PaperPlayer /> },
    ],
  },
])
