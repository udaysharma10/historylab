// Sprint 2: premium chapter data no longer ships in the JS bundle. It is
// fetched (once per session) from the get-chapter Edge Function, which
// enforces has_access() server-side, and cached here for the synchronous
// getChapter.ts accessors. RequireChapterAccess awaits loadChapterBundle()
// before rendering any chapter route, so accessors can assume the cache.
import { supabase } from '../lib/supabase'
import { chapterKey } from '../lib/contentIds'
import type { Chapter, KeyDate, VocabWord, SourceBox, KeyPerson, NCERTQuestion } from '../types/chapter'
import type { Figure } from '../types/figure'
import type { Flashcard } from './ch1/flashcards'
import type { MapDefinition } from './ch1/maps'
import type {
  MCQActivity,
  FillBlankActivity,
  TrueFalseActivity,
  MatchActivity,
  TimelinePlaceActivity,
  MapIdentifyActivity,
  MapLabelActivity,
} from '../types/activity'

export interface ChapterBundle {
  chapter: Chapter
  keyDates: KeyDate[]
  vocabulary: VocabWord[]
  sources: SourceBox[]
  keyPeople: KeyPerson[]
  flashcards: Flashcard[]
  figures: Figure[]
  mapDefinitions: MapDefinition[]
  activities: {
    mcq: MCQActivity[]
    fillBlank: FillBlankActivity[]
    trueFalse: TrueFalseActivity[]
    match: MatchActivity[]
    timeline: TimelinePlaceActivity[]
    ncert: NCERTQuestion[]
    mapIdentify: MapIdentifyActivity[]
    mapLabel: MapLabelActivity[]
  }
}

export class ChapterAccessError extends Error {
  status: number
  constructor(status: number) {
    super(`get-chapter failed (${status})`)
    this.status = status
  }
}

const cache: Record<string, ChapterBundle> = {}
const pending: Record<string, Promise<ChapterBundle>> = {}

export function getCachedBundle(chapterSlug: string): ChapterBundle | undefined {
  return cache[chapterSlug]
}

export function loadChapterBundle(chapterSlug: string): Promise<ChapterBundle> {
  if (cache[chapterSlug]) return Promise.resolve(cache[chapterSlug])
  pending[chapterSlug] ??= (async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-chapter', {
        body: { chapter: chapterKey(chapterSlug) },
      })
      if (error) {
        const status =
          (error as { context?: { status?: number } }).context?.status ?? 500
        throw new ChapterAccessError(status)
      }
      cache[chapterSlug] = data as ChapterBundle
      return cache[chapterSlug]
    } finally {
      delete pending[chapterSlug]
    }
  })()
  return pending[chapterSlug]
}
