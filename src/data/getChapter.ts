import type { Chapter, KeyDate, VocabWord, SourceBox, KeyPerson } from '../types/chapter'
import { chapter1 } from './ch1/chapter1'
import { chapter2 } from './ch2/chapter2'

// Chapter data
import { keyDates as ch1KeyDates } from './ch1/keyDates'
import { ch2KeyDates } from './ch2/keyDates'
import { vocabulary as ch1Vocabulary } from './ch1/vocabulary'
import { ch2Vocabulary } from './ch2/vocabulary'
import { sources as ch1Sources } from './ch1/sources'
import { ch2Sources } from './ch2/sources'
import { keyPeople as ch1KeyPeople } from './ch1/keyPeople'
import { ch2KeyPeople } from './ch2/keyPeople'
import { flashcards as ch1Flashcards } from './ch1/flashcards'
import { ch2Flashcards } from './ch2/flashcards'
import { figures as ch1Figures } from './ch1/figures'
import { ch2Figures } from './ch2/figures'
import { mapDefinitions as ch1Maps, getMapsBySection as ch1GetMapsBySection } from './ch1/maps'

// Ch1 activities
import { mcqActivities as ch1Mcq, fillBlankActivities as ch1Fb, trueFalseActivities as ch1Tf } from './ch1/activities/quizActivities'
import { matchActivities as ch1Match } from './ch1/activities/matchActivities'
import { timelineActivities as ch1Timeline } from './ch1/activities/timelineActivities'
import { ncertQuestions as ch1Ncert } from './ch1/activities/ncertQuestions'

// Ch2 activities
import { ch2McqActivities, ch2FillBlankActivities, ch2TrueFalseActivities } from './ch2/activities/quizActivities'
import { ch2MatchActivities } from './ch2/activities/matchActivities'
import { ch2NcertQuestions } from './ch2/activities/ncertQuestions'

const chapters: Record<string, Chapter> = {
  ch1: chapter1,
  ch2: chapter2,
}

export function getChapter(chapterId: string): Chapter | undefined {
  return chapters[chapterId]
}

// Chapter-specific data accessors
export function getKeyDates(chapterId: string): KeyDate[] {
  if (chapterId === 'ch2') return ch2KeyDates
  return ch1KeyDates
}

export function getVocabulary(chapterId: string): VocabWord[] {
  if (chapterId === 'ch2') return ch2Vocabulary
  return ch1Vocabulary
}

export function getSources(chapterId: string): SourceBox[] {
  if (chapterId === 'ch2') return ch2Sources
  return ch1Sources
}

export function getKeyPeople(chapterId: string): KeyPerson[] {
  if (chapterId === 'ch2') return ch2KeyPeople
  return ch1KeyPeople
}

export function getFlashcards(chapterId: string) {
  if (chapterId === 'ch2') return ch2Flashcards
  return ch1Flashcards
}

export function getFigures(chapterId: string) {
  if (chapterId === 'ch2') return ch2Figures
  return ch1Figures
}

export function getMapDefinitions(chapterId: string) {
  if (chapterId === 'ch2') return [] // Ch2 has no interactive maps yet
  return ch1Maps
}

export function getMapsBySection(chapterId: string, sectionId: string) {
  if (chapterId === 'ch2') return [] // Ch2 has no interactive maps yet
  return ch1GetMapsBySection(sectionId)
}

export function getMcqActivities(chapterId: string) {
  if (chapterId === 'ch2') return ch2McqActivities
  return ch1Mcq
}

export function getFillBlankActivities(chapterId: string) {
  if (chapterId === 'ch2') return ch2FillBlankActivities
  return ch1Fb
}

export function getTrueFalseActivities(chapterId: string) {
  if (chapterId === 'ch2') return ch2TrueFalseActivities
  return ch1Tf
}

export function getMatchActivities(chapterId: string) {
  if (chapterId === 'ch2') return ch2MatchActivities
  return ch1Match
}

export function getTimelineActivities(chapterId: string) {
  if (chapterId === 'ch2') return [] // Ch2 has no timeline ordering activities yet
  return ch1Timeline
}

export function getNcertQuestions(chapterId: string) {
  if (chapterId === 'ch2') return ch2NcertQuestions
  return ch1Ncert
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
