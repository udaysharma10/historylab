import { supabase } from './supabase'

interface ActivityLogEntry {
  mode: string
  chapter_id?: string
  section_id?: string | null
  activity_type?: string | null
  stars_earned?: number
  score_percent?: number
  total_questions?: number
  correct_answers?: number
  hints_used?: number
  time_spent_seconds?: number
}

export async function logActivity(entry: ActivityLogEntry) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('activity_logs').insert({
    user_id: user.id,
    chapter_id: entry.chapter_id || 'ch1',
    ...entry,
  })
}
