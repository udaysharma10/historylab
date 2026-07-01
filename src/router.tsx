import { createBrowserRouter, Navigate, Outlet, useParams } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { useAuthContext } from './components/auth'
import { canAccessChapter } from './lib/chapterAccess'
import { BookHome } from './modules/BookHome'
import { HomePage } from './modules/HomePage'
import { SectionModule } from './modules/SectionModule'
import { QuizMode } from './modules/QuizMode'
import { TimelineMode } from './modules/TimelineMode'
import { MapMode } from './modules/MapMode'
import { FigureMode } from './modules/FigureMode'
import { FlashcardMode } from './modules/FlashcardMode'
import { ExamPractice } from './modules/ExamPractice'
import { TeacherDashboard } from './modules/TeacherDashboard'

// Blocks direct URLs to chapters this user isn't allowed into (content ships in
// the bundle, so the BookHome card gate alone isn't enough for deep links).
function RequireChapterAccess() {
  const { chapterId } = useParams<{ chapterId: string }>()
  const { profile } = useAuthContext()
  if (!canAccessChapter(chapterId || '', profile.email)) {
    return <Navigate to="/" replace />
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
  {
    path: '/',
    element: <AppShell />,
    children: [
      // Book home — chapter selector
      { index: true, element: <BookHome /> },

      // Chapter-scoped routes (guarded by chapter access)
      {
        element: <RequireChapterAccess />,
        children: [
          { path: 'chapter/:chapterId', element: <HomePage /> },
          { path: 'chapter/:chapterId/section/:sectionId', element: <SectionModule /> },
          { path: 'chapter/:chapterId/section/:sectionId/quiz', element: <QuizMode /> },
          { path: 'chapter/:chapterId/timeline', element: <TimelineMode /> },
          { path: 'chapter/:chapterId/maps', element: <MapMode /> },
          { path: 'chapter/:chapterId/flashcards', element: <FlashcardMode /> },
          { path: 'chapter/:chapterId/figures', element: <FigureMode /> },
          { path: 'chapter/:chapterId/exam', element: <ExamPractice /> },
        ],
      },

      // Backward compat — old routes redirect to ch1
      { path: 'section/:sectionId', element: <RedirectToChapter /> },
      { path: 'section/:sectionId/quiz', element: <RedirectToChapterQuiz /> },
      { path: 'timeline', element: <Navigate to="/chapter/ch1/timeline" replace /> },
      { path: 'maps', element: <Navigate to="/chapter/ch1/maps" replace /> },
      { path: 'flashcards', element: <Navigate to="/chapter/ch1/flashcards" replace /> },
      { path: 'figures', element: <Navigate to="/chapter/ch1/figures" replace /> },
      { path: 'exam', element: <Navigate to="/chapter/ch1/exam" replace /> },

      // Dashboard
      { path: 'dashboard', element: <TeacherDashboard /> },
    ],
  },
])
