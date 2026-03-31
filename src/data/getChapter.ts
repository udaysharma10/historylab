import type { Chapter } from '../types/chapter'
import { chapter1 } from './ch1/chapter1'
import { chapter2 } from './ch2/chapter2'

const chapters: Record<string, Chapter> = {
  ch1: chapter1,
  ch2: chapter2,
}

export function getChapter(chapterId: string): Chapter | undefined {
  return chapters[chapterId]
}

// Section color configs per chapter
export const CHAPTER_SECTION_COLORS: Record<string, Record<string, string>> = {
  ch1: { s1: '#C0392B', s2: '#2980B9', s3: '#E67E22', s4: '#27AE60', s5: '#7D3C98', s6: '#16A085' },
  ch2: { s1: '#C0392B', s2: '#2980B9', s3: '#E67E22', s4: '#7D3C98' },
}

export const CHAPTER_SECTION_ICONS: Record<string, Record<string, string>> = {
  ch1: { s1: '🇫🇷', s2: '🏛️', s3: '🔥', s4: '🗺️', s5: '🎨', s6: '🌍' },
  ch2: { s1: '🔥', s2: '🤝', s3: '🧂', s4: '🎨' },
}
