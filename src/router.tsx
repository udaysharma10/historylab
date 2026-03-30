import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { HomePage } from './modules/HomePage'
import { SectionModule } from './modules/SectionModule'
import { QuizMode } from './modules/QuizMode'
import { TimelineMode } from './modules/TimelineMode'
import { MapMode } from './modules/MapMode'
import { FigureMode } from './modules/FigureMode'
import { FlashcardMode } from './modules/FlashcardMode'
import { ExamPractice } from './modules/ExamPractice'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'section/:sectionId', element: <SectionModule /> },
      { path: 'section/:sectionId/quiz', element: <QuizMode /> },
      { path: 'timeline', element: <TimelineMode /> },
      { path: 'maps', element: <MapMode /> },
      { path: 'flashcards', element: <FlashcardMode /> },
      { path: 'figures', element: <FigureMode /> },
      { path: 'exam', element: <ExamPractice /> },
    ],
  },
])
