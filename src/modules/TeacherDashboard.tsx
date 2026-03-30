import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuthContext } from '../components/auth'

interface StudentRow {
  id: string
  name: string
  email: string
  school: string | null
  class: string | null
  role: string
  created_at: string
  total_logins: number
  last_login: string | null
  total_stars: number
  activities_completed: number
}

interface ActivityBreakdown {
  mode: string
  count: number
}

const MODE_LABELS: Record<string, string> = {
  quiz: 'Quiz',
  narrative: 'Reading',
  timeline: 'Timeline',
  maps: 'Maps',
  figures: 'Figures',
  exam: 'Exam Prep',
  flashcards: 'Flashcards',
}

const MODE_COLORS: Record<string, string> = {
  quiz: '#2980B9',
  narrative: '#C0392B',
  timeline: '#E67E22',
  maps: '#16A085',
  figures: '#7D3C98',
  exam: '#C0392B',
  flashcards: '#27AE60',
}

export function TeacherDashboard() {
  const navigate = useNavigate()
  const { profile } = useAuthContext()
  const [students, setStudents] = useState<StudentRow[]>([])
  const [activityBreakdown, setActivityBreakdown] = useState<ActivityBreakdown[]>([])
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState<'7d' | '30d' | 'all'>('30d')

  // Redirect non-teachers
  useEffect(() => {
    if (profile.role !== 'teacher') {
      navigate('/')
    }
  }, [profile.role, navigate])

  useEffect(() => {
    if (profile.role !== 'teacher') return

    async function fetchData() {
      setLoading(true)

      // Fetch all profiles in same school
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('school', profile.school)

      if (!profiles) {
        setLoading(false)
        return
      }

      const studentProfiles = profiles.filter(p => p.role === 'student')
      const userIds = studentProfiles.map(p => p.id)

      // Fetch login sessions
      const { data: loginSessions } = await supabase
        .from('login_sessions')
        .select('user_id, logged_in_at')
        .in('user_id', userIds.length > 0 ? userIds : ['none'])

      // Fetch activity logs
      const { data: activityLogs } = await supabase
        .from('activity_logs')
        .select('user_id, mode, stars_earned, completed_at')
        .in('user_id', userIds.length > 0 ? userIds : ['none'])

      // Build student rows
      const rows: StudentRow[] = studentProfiles.map(p => {
        const logins = (loginSessions || []).filter(l => l.user_id === p.id)
        const activities = (activityLogs || []).filter(a => a.user_id === p.id)
        const lastLogin = logins.length > 0
          ? logins.sort((a, b) => b.logged_in_at.localeCompare(a.logged_in_at))[0].logged_in_at
          : null

        return {
          id: p.id,
          name: p.name,
          email: p.email,
          school: p.school,
          class: p.class,
          role: p.role,
          created_at: p.created_at,
          total_logins: logins.length,
          last_login: lastLogin,
          total_stars: activities.reduce((sum: number, a: { stars_earned: number | null }) => sum + (a.stars_earned || 0), 0),
          activities_completed: activities.length,
        }
      })

      // Sort by total stars descending (leaderboard style)
      rows.sort((a, b) => b.total_stars - a.total_stars)
      setStudents(rows)

      // Activity breakdown by mode
      const modeCount: Record<string, number> = {}
      ;(activityLogs || []).forEach(a => {
        modeCount[a.mode] = (modeCount[a.mode] || 0) + 1
      })
      setActivityBreakdown(
        Object.entries(modeCount)
          .map(([mode, count]) => ({ mode, count }))
          .sort((a, b) => b.count - a.count)
      )

      setLoading(false)
    }

    fetchData()
  }, [profile.school, profile.role])

  // Stats
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const activeToday = useMemo(() =>
    students.filter(s => s.last_login && s.last_login >= todayStart).length
  , [students, todayStart])

  const activeThisWeek = useMemo(() =>
    students.filter(s => s.last_login && s.last_login >= weekAgo).length
  , [students, weekAgo])

  const totalStarsAll = useMemo(() =>
    students.reduce((sum, s) => sum + s.total_stars, 0)
  , [students])

  const totalActivities = useMemo(() =>
    students.reduce((sum, s) => sum + s.activities_completed, 0)
  , [students])

  // Time filter for student table
  const filteredStudents = useMemo(() => {
    if (timeFilter === 'all') return students
    const cutoff = timeFilter === '7d' ? weekAgo : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
    return students.filter(s => s.last_login && s.last_login >= cutoff)
  }, [students, timeFilter, weekAgo, now])

  if (profile.role !== 'teacher') return null

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-float">📊</div>
          <p className="text-gray-500 font-body">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-hist-dark">Teacher Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          {profile.school} — {students.length} student{students.length !== 1 ? 's' : ''} registered
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: students.length, icon: '🎓', color: '#2980B9' },
          { label: 'Active Today', value: activeToday, icon: '📱', color: '#27AE60' },
          { label: 'Active This Week', value: activeThisWeek, icon: '📅', color: '#E67E22' },
          { label: 'Total Stars Earned', value: totalStarsAll, icon: '⭐', color: '#D4A017' },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            className="bg-white rounded-2xl p-5 shadow-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="text-2xl mb-2">{card.icon}</div>
            <div className="text-3xl font-display font-bold" style={{ color: card.color }}>{card.value}</div>
            <div className="text-xs text-gray-400 mt-1 font-body">{card.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Activity Breakdown */}
      {activityBreakdown.length > 0 && (
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-display text-lg font-bold text-hist-dark mb-4">Activity Breakdown</h2>
          <div className="space-y-3">
            {activityBreakdown.map((item) => {
              const maxCount = activityBreakdown[0]?.count || 1
              const pct = Math.round((item.count / maxCount) * 100)
              return (
                <div key={item.mode} className="flex items-center gap-3">
                  <div className="w-24 text-sm font-semibold text-hist-dark font-body">
                    {MODE_LABELS[item.mode] || item.mode}
                  </div>
                  <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full flex items-center justify-end pr-2"
                      style={{ backgroundColor: MODE_COLORS[item.mode] || '#999' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8 }}
                    >
                      <span className="text-white text-xs font-bold">{item.count}</span>
                    </motion.div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="text-xs text-gray-400 mt-3">{totalActivities} total activities completed</div>
        </motion.div>
      )}

      {/* Student Table */}
      <motion.div
        className="bg-white rounded-2xl shadow-card overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="p-6 pb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-hist-dark">Student Activity</h2>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: '7d' as const, label: '7 days' },
              { key: '30d' as const, label: '30 days' },
              { key: 'all' as const, label: 'All time' },
            ].map(f => (
              <button
                key={f.key}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  timeFilter === f.key ? 'bg-white text-hist-dark shadow-sm' : 'text-gray-500'
                }`}
                onClick={() => setTimeFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="px-6 pb-6 text-center text-gray-400 text-sm py-8">
            No student activity in this period
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 font-display font-bold text-hist-dark text-xs uppercase tracking-wide">#</th>
                  <th className="text-left px-3 py-3 font-display font-bold text-hist-dark text-xs uppercase tracking-wide">Student</th>
                  <th className="text-left px-3 py-3 font-display font-bold text-hist-dark text-xs uppercase tracking-wide">Class</th>
                  <th className="text-center px-3 py-3 font-display font-bold text-hist-dark text-xs uppercase tracking-wide">Logins</th>
                  <th className="text-center px-3 py-3 font-display font-bold text-hist-dark text-xs uppercase tracking-wide">Activities</th>
                  <th className="text-center px-3 py-3 font-display font-bold text-hist-dark text-xs uppercase tracking-wide">Stars</th>
                  <th className="text-left px-3 py-3 font-display font-bold text-hist-dark text-xs uppercase tracking-wide">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, i) => (
                  <tr key={student.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-6 py-3 text-gray-400 font-body">{i + 1}</td>
                    <td className="px-3 py-3">
                      <div className="font-semibold text-hist-dark font-body">{student.name}</div>
                      <div className="text-xs text-gray-400">{student.email}</div>
                    </td>
                    <td className="px-3 py-3 text-gray-600 font-body">{student.class || '—'}</td>
                    <td className="px-3 py-3 text-center font-bold text-hist-dark font-body">{student.total_logins}</td>
                    <td className="px-3 py-3 text-center font-bold text-hist-dark font-body">{student.activities_completed}</td>
                    <td className="px-3 py-3 text-center">
                      <span className="inline-flex items-center gap-1">
                        <svg width="14" height="14" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#F1C40F" stroke="#E6A900" strokeWidth="0.5" />
                        </svg>
                        <span className="font-bold text-hist-dark font-body">{student.total_stars}</span>
                      </span>
                    </td>
                    <td className="px-3 py-3 text-gray-500 font-body text-xs">
                      {student.last_login
                        ? formatRelativeTime(student.last_login)
                        : 'Never'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}

function formatRelativeTime(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}
