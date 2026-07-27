// Canonical content ids in the database are namespaced class-subject-chapter
// (c10-hist-ch1) from the first migration — plan §9.1. Routes and in-app data
// keep the short slug (ch1); these helpers convert at the persistence boundary.
export const CONTENT_NS = 'c10-hist'

// Chapter id used for cross-chapter rows (the meta row in student_progress).
export const META_CHAPTER = 'global'

export function chapterKey(slugOrKey: string): string {
  if (slugOrKey === META_CHAPTER) return META_CHAPTER
  return slugOrKey.startsWith(`${CONTENT_NS}-`) ? slugOrKey : `${CONTENT_NS}-${slugOrKey}`
}

export function chapterSlug(key: string): string {
  return key.startsWith(`${CONTENT_NS}-`) ? key.slice(CONTENT_NS.length + 1) : key
}
