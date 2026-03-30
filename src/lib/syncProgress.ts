import { supabase } from './supabase'

let debounceTimer: ReturnType<typeof setTimeout> | null = null

export async function saveProgressToSupabase(sectionId: string, progressData: unknown) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  // Debounce: wait 1s after last change before saving
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    await supabase.from('student_progress').upsert({
      user_id: user.id,
      section_id: sectionId,
      progress_data: progressData,
      updated_at: new Date().toISOString(),
    })
  }, 1000)
}

export async function loadProgressFromSupabase(): Promise<Record<string, unknown> | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('student_progress')
    .select('section_id, progress_data')
    .eq('user_id', user.id)

  if (!data || data.length === 0) return null

  const result: Record<string, unknown> = {}
  data.forEach((row) => {
    result[row.section_id] = row.progress_data
  })
  return result
}
