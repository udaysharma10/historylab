// Tiny dependency-free bridge between the Zustand stores (which mark keys
// dirty on every mutation) and the sync engine (which flushes them to
// Supabase). The queue is persisted so offline changes survive a reload.
//
// Dirty-key formats:
//   meta                          totals + streak (cross-chapter)
//   sec:<chapterSlug>:<sectionId>
//   sub:<chapterSlug>:<subsectionId>
//   quiz:<chapterSlug>:<quizId>
//   fc:<chapterSlug>:<cardId>

const QUEUE_KEY = 'historylab-dirty-v1'
const DEBOUNCE_MS = 1500

let flusher: (() => void) | null = null
let timer: ReturnType<typeof setTimeout> | null = null
let queue: Set<string> | null = null

function loadQueue(): Set<string> {
  if (queue) return queue
  try {
    queue = new Set(JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]'))
  } catch {
    queue = new Set()
  }
  return queue
}

function persistQueue() {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify([...loadQueue()]))
  } catch {
    // storage full/unavailable — queue lives in memory for this session
  }
}

export function markDirty(...keys: string[]) {
  const q = loadQueue()
  keys.forEach((k) => q.add(k))
  persistQueue()
  scheduleFlush()
}

export function scheduleFlush() {
  if (!flusher) return
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    timer = null
    flusher?.()
  }, DEBOUNCE_MS)
}

export function setFlusher(f: (() => void) | null) {
  flusher = f
  if (f && loadQueue().size > 0) scheduleFlush()
}

/** Snapshot the queue for a flush attempt. Keys are NOT removed here. */
export function peekQueue(): string[] {
  return [...loadQueue()]
}

/** Remove keys after a successful flush. */
export function clearKeys(keys: string[]) {
  const q = loadQueue()
  keys.forEach((k) => q.delete(k))
  persistQueue()
}

export function clearQueue() {
  queue = new Set()
  persistQueue()
}
