// Core data model types for chapter content

export interface Chapter {
  id: string
  title: string
  subtitle: string
  sections: Section[]
}

export interface Section {
  id: string
  number: number
  title: string
  color: string
  icon: string
  subsections: Subsection[]
  /** set by the server's preview trim on locked sections (subsections emptied) */
  topicCount?: number
  keyPoints: string[]
  figureIds: string[]
  sourceIds: string[]
  vocabularyIds: string[]
}

export interface Subsection {
  id: string
  title: string
  narrativeCards: NarrativeCard[]
}

export interface FlowStep {
  label: string
  detail: string
}

export interface TableData {
  headers: string[]
  rows: string[][]
}

export interface NarrativeCard {
  id: string
  title?: string
  text: string
  imageId?: string
  highlight?: string
  inlineQuiz?: InlineQuiz
  type?: 'text' | 'vocabulary' | 'source' | 'infobox' | 'figure' | 'exam-prep' | 'timeline-ref' | 'map-ref' | 'flowchart' | 'table'
  // For type === 'flowchart': ordered steps, each clickable to reveal its explanation
  steps?: FlowStep[]
  // For type === 'table'
  table?: TableData
}

export interface InlineQuiz {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface KeyDate {
  id: string
  year: number
  yearEnd?: number
  event: string
  detail: string
  sectionId: string
  importance: 'major' | 'minor'
}

export interface KeyPerson {
  id: string
  name: string
  years?: string
  nationality: string
  role: string
  sectionId: string
  keyFacts: string[]
  examRelevance: 'high' | 'medium' | 'low'
}

export interface VocabWord {
  id: string
  term: string
  definition: string
  sectionId: string
  example?: string
  examRelevance: 'high' | 'medium' | 'low'
}

export interface SourceBox {
  id: string
  label: string
  author: string
  title: string
  year?: string
  text: string
  sectionId: string
  analysis: string[]
}

export interface InfoBox {
  id: string
  title: string
  type: 'biography' | 'table' | 'feature'
  content: string
  sectionId: string
}

export interface SymbolData {
  symbol: string
  meaning: string
}

export interface NCERTQuestion {
  id: string
  type: 'write-in-brief' | 'discuss'
  number: number
  question: string
  subParts?: string[]
  keyPoints: string[]
  sampleAnswer: string
  marks: number
}
