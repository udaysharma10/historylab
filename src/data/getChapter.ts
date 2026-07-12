import type { Chapter, KeyDate, VocabWord, SourceBox, KeyPerson } from '../types/chapter'
import type { Figure } from '../types/figure'
import { chapter1 } from './ch1/chapter1'

// Ch1 data (bundled — free tier)
import { keyDates as ch1KeyDates } from './ch1/keyDates'
import { vocabulary as ch1Vocabulary } from './ch1/vocabulary'
import { sources as ch1Sources } from './ch1/sources'
import { keyPeople as ch1KeyPeople } from './ch1/keyPeople'
import { flashcards as ch1Flashcards } from './ch1/flashcards'
import { figures as ch1Figures } from './ch1/figures'
import { mapDefinitions as ch1Maps, getMapsBySection as ch1GetMapsBySection } from './ch1/maps'
import { mcqActivities as ch1Mcq, fillBlankActivities as ch1Fb, trueFalseActivities as ch1Tf } from './ch1/activities/quizActivities'
import { matchActivities as ch1Match } from './ch1/activities/matchActivities'
import { timelineActivities as ch1Timeline } from './ch1/activities/timelineActivities'
import { ncertQuestions as ch1Ncert } from './ch1/activities/ncertQuestions'
import { mapIdentifyActivities as ch1MapIdentify, mapLabelActivities as ch1MapLabel } from './ch1/activities/mapActivities'

// Premium chapters (ch2+) are NOT imported — their content lives server-side
// (chapter_content + get-chapter Edge Function, Sprint 2) and is served from
// the session cache below after RequireChapterAccess loads it.
import { getCachedBundle } from './chapterBundle'

export function getChapter(chapterId: string): Chapter | undefined {
  if (chapterId === 'ch1') return chapter1
  return getCachedBundle(chapterId)?.chapter
}

// Chapter-specific data accessors
export function getKeyDates(chapterId: string): KeyDate[] {
  if (chapterId === 'ch1') return ch1KeyDates
  return getCachedBundle(chapterId)?.keyDates ?? []
}

export function getVocabulary(chapterId: string): VocabWord[] {
  if (chapterId === 'ch1') return ch1Vocabulary
  return getCachedBundle(chapterId)?.vocabulary ?? []
}

export function getSources(chapterId: string): SourceBox[] {
  if (chapterId === 'ch1') return ch1Sources
  return getCachedBundle(chapterId)?.sources ?? []
}

export function getKeyPeople(chapterId: string): KeyPerson[] {
  if (chapterId === 'ch1') return ch1KeyPeople
  return getCachedBundle(chapterId)?.keyPeople ?? []
}

export function getFlashcards(chapterId: string) {
  if (chapterId === 'ch1') return ch1Flashcards
  return getCachedBundle(chapterId)?.flashcards ?? []
}

export function getFigures(chapterId: string): Figure[] {
  if (chapterId === 'ch1') return ch1Figures
  return getCachedBundle(chapterId)?.figures ?? []
}

export function getMapDefinitions(chapterId: string) {
  if (chapterId === 'ch1') return ch1Maps
  return getCachedBundle(chapterId)?.mapDefinitions ?? []
}

export function getMapsBySection(chapterId: string, sectionId: string) {
  if (chapterId === 'ch1') return ch1GetMapsBySection(sectionId)
  return (getCachedBundle(chapterId)?.mapDefinitions ?? []).filter(
    (m) => m.sectionId === sectionId
  )
}

export function getMcqActivities(chapterId: string) {
  if (chapterId === 'ch1') return ch1Mcq
  return getCachedBundle(chapterId)?.activities.mcq ?? []
}

export function getFillBlankActivities(chapterId: string) {
  if (chapterId === 'ch1') return ch1Fb
  return getCachedBundle(chapterId)?.activities.fillBlank ?? []
}

export function getTrueFalseActivities(chapterId: string) {
  if (chapterId === 'ch1') return ch1Tf
  return getCachedBundle(chapterId)?.activities.trueFalse ?? []
}

export function getMatchActivities(chapterId: string) {
  if (chapterId === 'ch1') return ch1Match
  return getCachedBundle(chapterId)?.activities.match ?? []
}

export function getTimelineActivities(chapterId: string) {
  if (chapterId === 'ch1') return ch1Timeline
  return getCachedBundle(chapterId)?.activities.timeline ?? []
}

export function getNcertQuestions(chapterId: string) {
  if (chapterId === 'ch1') return ch1Ncert
  return getCachedBundle(chapterId)?.activities.ncert ?? []
}

export function getMapIdentifyActivities(chapterId: string) {
  if (chapterId === 'ch1') return ch1MapIdentify
  return getCachedBundle(chapterId)?.activities.mapIdentify ?? []
}

export function getMapLabelActivities(chapterId: string) {
  if (chapterId === 'ch1') return ch1MapLabel
  return getCachedBundle(chapterId)?.activities.mapLabel ?? []
}

// Section color configs per chapter
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
