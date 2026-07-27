import type { Chapter, KeyDate, VocabWord, SourceBox, KeyPerson } from '../types/chapter'
import type { Figure } from '../types/figure'

// Since the free-tier revision (2026-07-12) NO chapter content ships in the
// JS bundle. Every chapter — including Ch1, whose Section 1 is the free
// preview — is fetched from the get-chapter Edge Function (the real paywall)
// and cached for the session. RequireChapterAccess awaits loadChapterBundle()
// before rendering any chapter route, so these accessors can assume the cache.
import { getCachedBundle } from './chapterBundle'

export function getChapter(chapterId: string): Chapter | undefined {
  return getCachedBundle(chapterId)?.chapter
}

/** Free-preview section id when the server served a preview, else null. */
export function getChapterPreview(chapterId: string): string | null {
  return getCachedBundle(chapterId)?.preview?.section ?? null
}

// Chapter-specific data accessors
export function getKeyDates(chapterId: string): KeyDate[] {
  return getCachedBundle(chapterId)?.keyDates ?? []
}

export function getVocabulary(chapterId: string): VocabWord[] {
  return getCachedBundle(chapterId)?.vocabulary ?? []
}

export function getSources(chapterId: string): SourceBox[] {
  return getCachedBundle(chapterId)?.sources ?? []
}

export function getKeyPeople(chapterId: string): KeyPerson[] {
  return getCachedBundle(chapterId)?.keyPeople ?? []
}

export function getFlashcards(chapterId: string) {
  return getCachedBundle(chapterId)?.flashcards ?? []
}

export function getFigures(chapterId: string): Figure[] {
  return getCachedBundle(chapterId)?.figures ?? []
}

export function getMapDefinitions(chapterId: string) {
  return getCachedBundle(chapterId)?.mapDefinitions ?? []
}

export function getMapById(chapterId: string, mapId: string) {
  return getMapDefinitions(chapterId).find((m) => m.id === mapId)
}

export function getMapsBySection(chapterId: string, sectionId: string) {
  return getMapDefinitions(chapterId).filter((m) => m.sectionId === sectionId)
}

export function getMcqActivities(chapterId: string) {
  return getCachedBundle(chapterId)?.activities.mcq ?? []
}

export function getFillBlankActivities(chapterId: string) {
  return getCachedBundle(chapterId)?.activities.fillBlank ?? []
}

export function getTrueFalseActivities(chapterId: string) {
  return getCachedBundle(chapterId)?.activities.trueFalse ?? []
}

export function getMatchActivities(chapterId: string) {
  return getCachedBundle(chapterId)?.activities.match ?? []
}

export function getTimelineActivities(chapterId: string) {
  return getCachedBundle(chapterId)?.activities.timeline ?? []
}

export function getNcertQuestions(chapterId: string) {
  return getCachedBundle(chapterId)?.activities.ncert ?? []
}

export function getMapIdentifyActivities(chapterId: string) {
  return getCachedBundle(chapterId)?.activities.mapIdentify ?? []
}

export function getMapLabelActivities(chapterId: string) {
  return getCachedBundle(chapterId)?.activities.mapLabel ?? []
}

export function getSourceAnalysisActivities(chapterId: string) {
  return getCachedBundle(chapterId)?.activities.sourceAnalysis ?? []
}

export function getImageAnalysisActivities(chapterId: string) {
  return getCachedBundle(chapterId)?.activities.imageAnalysis ?? []
}

// Section color configs per chapter (UI config, not content — stays bundled)
export const CHAPTER_SECTION_COLORS: Record<string, Record<string, string>> = {
  ch1: { s1: '#C36B53', s2: '#5571B5', s3: '#C2893E', s4: '#5C9368', s5: '#9B5C9A', s6: '#3F8E84' },
  ch2: { s1: '#C36B53', s2: '#5571B5', s3: '#C2893E', s4: '#9B5C9A' },
}

export const CHAPTER_SECTION_ICONS: Record<string, Record<string, string>> = {
  ch1: { s1: '🇫🇷', s2: '🏛️', s3: '🔥', s4: '🗺️', s5: '🎨', s6: '🌍' },
  ch2: { s1: '🔥', s2: '🤝', s3: '🧂', s4: '🎨' },
}

// Short section labels (used by the Figures gallery filters)
export const CHAPTER_SECTION_LABELS: Record<string, Record<string, string>> = {
  ch1: {
    s1: 'French Revolution',
    s2: 'Making of Nationalism',
    s3: 'Age of Revolutions',
    s4: 'Germany & Italy',
    s5: 'Visualising the Nation',
    s6: 'Nationalism & Imperialism',
  },
  ch2: {
    s1: 'WWI, Khilafat & Non-Cooperation',
    s2: 'Differing Strands',
    s3: 'Civil Disobedience',
    s4: 'Collective Belonging',
  },
}
