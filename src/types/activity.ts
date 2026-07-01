// Discriminated union types for all activity/quiz types

export type Difficulty = 'easy' | 'medium' | 'hard'
export type ExamRelevance = 'high' | 'medium' | 'low'

export interface BaseActivity {
  id: string
  sectionId: string
  difficulty: Difficulty
  examRelevance: ExamRelevance
  tags: string[]
}

export interface MCQActivity extends BaseActivity {
  type: 'mcq'
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  figureRef?: string
  hints: string[]
}

export interface FillBlankActivity extends BaseActivity {
  type: 'fill-blank'
  sentence: string
  blanks: { position: number; answer: string; alternatives: string[] }[]
  hints: string[]
}

export interface TrueFalseActivity extends BaseActivity {
  type: 'true-false'
  statement: string
  isTrue: boolean
  explanation: string
}

export interface MatchActivity extends BaseActivity {
  type: 'match-following'
  title: string
  leftColumn: { id: string; text: string }[]
  rightColumn: { id: string; text: string }[]
  correctPairs: [string, string][]
}

export interface TimelinePlaceActivity extends BaseActivity {
  type: 'timeline-place'
  instruction: string
  events: { id: string; label: string; year: number; description: string }[]
}

export interface MapIdentifyActivity extends BaseActivity {
  type: 'map-identify'
  mapId: string
  question: string
  correctRegionId: string
  hints: string[]
}

export interface MapLabelActivity extends BaseActivity {
  type: 'map-label'
  mapId: string
  instruction: string
  labels: { id: string; text: string; correctRegionId: string }[]
}

export interface ImageAnalysisActivity extends BaseActivity {
  type: 'image-analysis'
  figureId: string
  // For MCQ sub-questions, correctIndex is the authoritative correct option.
  // (Do NOT infer the answer by substring-matching the model answer text.)
  questions: { question: string; answer: string; options?: string[]; correctIndex?: number }[]
}

export interface SourceComprehensionActivity extends BaseActivity {
  type: 'source-comprehension'
  sourceId: string
  // For MCQ sub-questions, correctIndex is the authoritative correct option.
  // (Do NOT infer the answer by substring-matching the model answer text.)
  questions: { question: string; answer: string; options?: string[]; correctIndex?: number }[]
}

export interface ShortAnswerActivity extends BaseActivity {
  type: 'short-answer'
  question: string
  keyPoints: string[]
  sampleAnswer: string
  marks: number
}

export interface LongAnswerActivity extends BaseActivity {
  type: 'long-answer'
  question: string
  keyPoints: string[]
  sampleAnswer: string
  marks: number
}

export type Activity =
  | MCQActivity
  | FillBlankActivity
  | TrueFalseActivity
  | MatchActivity
  | TimelinePlaceActivity
  | MapIdentifyActivity
  | MapLabelActivity
  | ImageAnalysisActivity
  | SourceComprehensionActivity
  | ShortAnswerActivity
  | LongAnswerActivity
