import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuthContext } from '../components/auth'
import { isAdminTeacher } from '../lib/adminEmails'

interface SectionActivity {
  sectionId: string
  activities: number
  stars: number
  modes: string[]
}

interface UserRow {
  id: string
  name: string
  email: string
  school: string | null
  class: string | null
  role: string
  created_at: string
  profile_completed: boolean
  total_logins: number
  last_login: string | null
  total_stars: number
  activities_completed: number
  sections: SectionActivity[]
}

const SECTION_NAMES: Record<string, string> = {
  // Ch1 sections
  'ch1:s1': 'Ch1 S1 — French Revolution',
  'ch1:s2': 'Ch1 S2 — Making of Nationalism',
  'ch1:s3': 'Ch1 S3 — Age of Revolutions',
  'ch1:s4': 'Ch1 S4 — Germany & Italy',
  'ch1:s5': 'Ch1 S5 — Visualising the Nation',
  'ch1:s6': 'Ch1 S6 — Nationalism & Imperialism',
  // Ch2 sections
  'ch2:s1': 'Ch2 S1 — WWI, Khilafat & Non-Cooperation',
  'ch2:s2': 'Ch2 S2 — Differing Strands',
  'ch2:s3': 'Ch2 S3 — Civil Disobedience',
  'ch2:s4': 'Ch2 S4 — Collective Belonging',
}

const SECTION_COLORS: Record<string, string> = {
  'ch1:s1': '#C0392B', 'ch1:s2': '#2980B9', 'ch1:s3': '#E67E22',
  'ch1:s4': '#27AE60', 'ch1:s5': '#7D3C98', 'ch1:s6': '#16A085',
  'ch2:s1': '#C0392B', 'ch2:s2': '#2980B9', 'ch2:s3': '#E67E22', 'ch2:s4': '#7D3C98',
}

interface LoginDateEntry {
  date: string
  count: number
  users: string[]
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
  const [users, setUsers] = useState<UserRow[]>([])
  const [loginDates, setLoginDates] = useState<LoginDateEntry[]>([])
  const [activityBreakdown, setActivityBreakdown] = useState<ActivityBreakdown[]>([])
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState<'7d' | '30d' | 'all'>('30d')
  const [tab, setTab] = useState<'users' | 'logins' | 'activity'>('users')
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null)

  const isAdmin = isAdminTeacher(profile.email)

  // Redirect non-admin users — only admin teachers can see the dashboard
  useEffect(() => {
    if (!isAdmin) {
      navigate('/')
    }
  }, [isAdmin, navigate])

  useEffect(() => {
    if (!isAdmin) return

    async function fetchData() {
      setLoading(true)

      // Admin teachers see ALL users, school-scoped teachers see their school only
      let profileQuery = supabase.from('profiles').select('*')
      if (!isAdmin) {
        profileQuery = profileQuery.eq('school', profile.school)
      }
      const { data: profiles } = await profileQuery

      if (!profiles || profiles.length === 0) {
        setUsers([])
        setLoading(false)
        return
      }

      const allUserIds = profiles.map(p => p.id)

      // Fetch login sessions for all users
      const { data: loginSessions } = await supabase
        .from('login_sessions')
        .select('user_id, logged_in_at')
        .in('user_id', allUserIds.length > 0 ? allUserIds : ['none'])

      // Fetch activity logs for all users (include chapter_id + section_id)
      const { data: activityLogs } = await supabase
        .from('activity_logs')
        .select('user_id, mode, chapter_id, section_id, stars_earned, completed_at')
        .in('user_id', allUserIds.length > 0 ? allUserIds : ['none'])

      // Build user rows (ALL users, not just students)
      const rows: UserRow[] = profiles.map(p => {
        const logins = (loginSessions || []).filter(l => l.user_id === p.id)
        const activities = (activityLogs || []).filter(a => a.user_id === p.id)
        const lastLogin = logins.length > 0
          ? logins.sort((a, b) => b.logged_in_at.localeCompare(a.logged_in_at))[0].logged_in_at
          : null

        // Build per-chapter-section breakdown
        const sectionMap: Record<string, { activities: number; stars: number; modes: Set<string> }> = {}
        activities.forEach((a: { chapter_id?: string | null; section_id?: string | null; stars_earned?: number | null; mode?: string }) => {
          const chId = a.chapter_id || 'ch1'
          const sid = a.section_id || 'unknown'
          const key = `${chId}:${sid}`
          if (!sectionMap[key]) sectionMap[key] = { activities: 0, stars: 0, modes: new Set() }
          sectionMap[key].activities++
          sectionMap[key].stars += a.stars_earned || 0
          if (a.mode) sectionMap[key].modes.add(a.mode)
        })
        const sections: SectionActivity[] = Object.entries(sectionMap)
          .filter(([key]) => !key.endsWith(':unknown'))
          .map(([key, data]) => ({
            sectionId: key, // format: "ch1:s1" or "ch2:s3"
            activities: data.activities,
            stars: data.stars,
            modes: Array.from(data.modes),
          }))
          .sort((a, b) => a.sectionId.localeCompare(b.sectionId))

        return {
          id: p.id,
          name: p.name || '(No name)',
          email: p.email || '—',
          school: p.school,
          class: p.class,
          role: p.role || 'student',
          created_at: p.created_at,
          profile_completed: p.profile_completed ?? false,
          total_logins: logins.length,
          last_login: lastLogin,
          total_stars: activities.reduce((sum: number, a: { stars_earned: number | null }) => sum + (a.stars_earned || 0), 0),
          activities_completed: activities.length,
          sections,
        }
      })

      // Sort by created_at descending (most recent first)
      rows.sort((a, b) => b.created_at.localeCompare(a.created_at))
      setUsers(rows)

      // Build date-wise login data
      const dateMap: Record<string, { count: number; users: Set<string> }> = {}
      ;(loginSessions || []).forEach(session => {
        const date = session.logged_in_at.slice(0, 10) // YYYY-MM-DD
        if (!dateMap[date]) dateMap[date] = { count: 0, users: new Set() }
        dateMap[date].count++
        const user = profiles.find(p => p.id === session.user_id)
        if (user) dateMap[date].users.add(user.name || user.email || session.user_id)
      })
      const dateEntries: LoginDateEntry[] = Object.entries(dateMap)
        .map(([date, data]) => ({ date, count: data.count, users: Array.from(data.users) }))
        .sort((a, b) => b.date.localeCompare(a.date))
      setLoginDates(dateEntries)

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
  }, [profile.school, profile.role, isAdmin])

  // Stats
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const students = useMemo(() => users.filter(u => u.role === 'student'), [users])

  const activeToday = useMemo(() =>
    users.filter(u => u.last_login && u.last_login >= todayStart).length
  , [users, todayStart])

  const activeThisWeek = useMemo(() =>
    users.filter(u => u.last_login && u.last_login >= weekAgo).length
  , [users, weekAgo])

  const totalStarsAll = useMemo(() =>
    users.reduce((sum, u) => sum + u.total_stars, 0)
  , [users])

  const totalActivities = useMemo(() =>
    users.reduce((sum, u) => sum + u.activities_completed, 0)
  , [users])

  // Time filter for tables
  const filteredUsers = useMemo(() => {
    if (timeFilter === 'all') return users
    const cutoff = timeFilter === '7d' ? weekAgo : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
    return users.filter(u => u.last_login && u.last_login >= cutoff)
  }, [users, timeFilter, weekAgo, now])

  const filteredLoginDates = useMemo(() => {
    if (timeFilter === 'all') return loginDates
    const cutoff = timeFilter === '7d'
      ? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
      : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    return loginDates.filter(d => d.date >= cutoff)
  }, [loginDates, timeFilter, now])

  if (!isAdmin) return null

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
          {isAdmin ? 'All users (Admin view)' : `${profile.school}`} — {users.length} user{users.length !== 1 ? 's' : ''} registered ({students.length} student{students.length !== 1 ? 's' : ''})
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: users.length, icon: '👥', color: '#2980B9' },
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

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        {[
          { key: 'users' as const, label: 'All Users', icon: '👥' },
          { key: 'logins' as const, label: 'Login History', icon: '📅' },
          { key: 'activity' as const, label: 'Activity Breakdown', icon: '📊' },
        ].map(t => (
          <button
            key={t.key}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 ${
              tab === t.key ? 'bg-white text-hist-dark shadow-sm' : 'text-gray-500'
            }`}
            onClick={() => setTab(t.key)}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* Time Filter */}
      <div className="flex justify-end">
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

      {/* === TAB: All Users === */}
      {tab === 'users' && (
        <motion.div
          className="bg-white rounded-2xl shadow-card overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="p-6 pb-3">
            <h2 className="font-display text-lg font-bold text-hist-dark">
              {timeFilter === 'all' ? 'All Registered Users' : `Users Active in Last ${timeFilter === '7d' ? '7 Days' : '30 Days'}`}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {timeFilter === 'all' ? users.length : filteredUsers.length} user{(timeFilter === 'all' ? users.length : filteredUsers.length) !== 1 ? 's' : ''}
            </p>
          </div>

          {(timeFilter === 'all' ? users : filteredUsers).length === 0 ? (
            <div className="px-6 pb-6 text-center text-gray-400 text-sm py-8">
              No users found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-6 py-3 font-display font-bold text-hist-dark text-xs uppercase tracking-wide">#</th>
                    <th className="text-left px-3 py-3 font-display font-bold text-hist-dark text-xs uppercase tracking-wide">User</th>
                    <th className="text-left px-3 py-3 font-display font-bold text-hist-dark text-xs uppercase tracking-wide">Role</th>
                    <th className="text-left px-3 py-3 font-display font-bold text-hist-dark text-xs uppercase tracking-wide">School</th>
                    <th className="text-center px-3 py-3 font-display font-bold text-hist-dark text-xs uppercase tracking-wide">Logins</th>
                    <th className="text-center px-3 py-3 font-display font-bold text-hist-dark text-xs uppercase tracking-wide">Activities</th>
                    <th className="text-center px-3 py-3 font-display font-bold text-hist-dark text-xs uppercase tracking-wide">Stars</th>
                    <th className="text-left px-3 py-3 font-display font-bold text-hist-dark text-xs uppercase tracking-wide">Joined</th>
                    <th className="text-left px-3 py-3 font-display font-bold text-hist-dark text-xs uppercase tracking-wide">Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {(timeFilter === 'all' ? users : filteredUsers).map((user, i) => {
                  const isExpanded = expandedUserId === user.id
                  return (
                    <React.Fragment key={user.id}>
                      <tr
                        className={`border-b border-gray-50 cursor-pointer transition-colors ${isExpanded ? 'bg-blue-50/40' : 'hover:bg-gray-50/50'}`}
                        onClick={() => setExpandedUserId(isExpanded ? null : user.id)}
                      >
                        <td className="px-6 py-3 text-gray-400 font-body">{i + 1}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1">
                            <div className="font-semibold text-hist-dark font-body">{user.name}</div>
                            <svg
                              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"
                              className={`shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            >
                              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <div className="text-xs text-gray-400">{user.email}</div>
                        </td>
                        <td className="px-3 py-3">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            user.role === 'teacher' ? 'bg-purple-100 text-purple-700'
                              : user.role === 'parent' ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-gray-600 font-body text-xs">{user.school || '—'}</td>
                        <td className="px-3 py-3 text-center font-bold text-hist-dark font-body">{user.total_logins}</td>
                        <td className="px-3 py-3 text-center font-bold text-hist-dark font-body">{user.activities_completed}</td>
                        <td className="px-3 py-3 text-center">
                          <span className="inline-flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span className="font-bold text-hist-dark font-body">{user.total_stars}</span>
                          </span>
                        </td>
                        <td className="px-3 py-3 text-gray-500 font-body text-xs">
                          {formatDate(user.created_at)}
                        </td>
                        <td className="px-3 py-3 text-gray-500 font-body text-xs">
                          {user.last_login ? formatRelativeTime(user.last_login) : 'Never'}
                        </td>
                      </tr>
                      {/* Expanded section breakdown */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={9} className="px-6 py-4 bg-gray-50/60">
                            {user.sections.length === 0 ? (
                              <p className="text-sm text-gray-400 font-body text-center py-2">
                                No section activity recorded yet
                              </p>
                            ) : (
                              <div>
                                <p className="font-display font-bold text-xs text-gray-500 uppercase tracking-wider mb-3">
                                  Section Progress for {user.name}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                  {Object.keys(SECTION_NAMES).map(sid => {
                                    const section = user.sections.find(s => s.sectionId === sid)
                                    const color = SECTION_COLORS[sid] || '#999'
                                    return (
                                      <div
                                        key={sid}
                                        className="rounded-lg p-3 border"
                                        style={{
                                          borderColor: section ? `${color}40` : '#E5E7EB',
                                          backgroundColor: section ? `${color}06` : '#FAFAFA',
                                        }}
                                      >
                                        <div className="flex items-center justify-between mb-1">
                                          <span
                                            className="font-display font-bold text-xs"
                                            style={{ color: section ? color : '#9CA3AF' }}
                                          >
                                            {SECTION_NAMES[sid] || sid}
                                          </span>
                                          {section ? (
                                            <span className="text-green-500 text-xs font-bold">Active</span>
                                          ) : (
                                            <span className="text-gray-300 text-xs">Not started</span>
                                          )}
                                        </div>
                                        {section && (
                                          <div className="flex items-center gap-3 text-xs font-body text-gray-600 mt-1">
                                            <span>{section.activities} activities</span>
                                            <span className="inline-flex items-center gap-0.5">
                                              <span className="text-yellow-500">★</span> {section.stars}
                                            </span>
                                            <span className="text-gray-400">
                                              {section.modes.map(m => MODE_LABELS[m] || m).join(', ')}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}

      {/* === TAB: Login History (Date-wise) === */}
      {tab === 'logins' && (
        <motion.div
          className="bg-white rounded-2xl shadow-card overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="p-6 pb-3">
            <h2 className="font-display text-lg font-bold text-hist-dark">Login History — Date Wise</h2>
            <p className="text-xs text-gray-400 mt-1">
              {filteredLoginDates.reduce((sum, d) => sum + d.count, 0)} total logins across {filteredLoginDates.length} day{filteredLoginDates.length !== 1 ? 's' : ''}
            </p>
          </div>

          {filteredLoginDates.length === 0 ? (
            <div className="px-6 pb-6 text-center text-gray-400 text-sm py-8">
              No login data in this period
            </div>
          ) : (
            <div className="px-6 pb-6 space-y-3">
              {filteredLoginDates.map((entry) => {
                const maxCount = filteredLoginDates[0]?.count || 1
                const pct = Math.min(100, Math.round((entry.count / maxCount) * 100))
                const dayName = new Date(entry.date + 'T00:00:00').toLocaleDateString('en-IN', {
                  weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
                })

                return (
                  <div key={entry.date} className="flex items-center gap-3">
                    <div className="w-36 sm:w-44 text-sm font-body text-hist-dark shrink-0">
                      {dayName}
                    </div>
                    <div className="flex-1 h-7 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full flex items-center justify-end pr-2.5"
                        style={{ backgroundColor: '#2980B9' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(pct, 15)}%` }}
                        transition={{ duration: 0.6 }}
                      >
                        <span className="text-white text-xs font-bold">{entry.count}</span>
                      </motion.div>
                    </div>
                    <div className="w-32 sm:w-48 text-xs text-gray-400 font-body truncate shrink-0" title={entry.users.join(', ')}>
                      {entry.users.slice(0, 3).join(', ')}{entry.users.length > 3 ? ` +${entry.users.length - 3}` : ''}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Per-user login count summary */}
          <div className="border-t border-gray-100 p-6">
            <h3 className="font-display text-base font-bold text-hist-dark mb-3">Login Count per User</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-3 py-2 font-display font-bold text-hist-dark text-xs uppercase">User</th>
                    <th className="text-center px-3 py-2 font-display font-bold text-hist-dark text-xs uppercase">Total Logins</th>
                    <th className="text-left px-3 py-2 font-display font-bold text-hist-dark text-xs uppercase">Last Login</th>
                    <th className="text-left px-3 py-2 font-display font-bold text-hist-dark text-xs uppercase">First Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {[...users]
                    .sort((a, b) => b.total_logins - a.total_logins)
                    .map(user => (
                    <tr key={user.id} className="border-b border-gray-50">
                      <td className="px-3 py-2">
                        <span className="font-semibold text-hist-dark font-body">{user.name}</span>
                        <span className="text-xs text-gray-400 ml-2">({user.role})</span>
                      </td>
                      <td className="px-3 py-2 text-center font-bold text-hist-dark font-body">{user.total_logins}</td>
                      <td className="px-3 py-2 text-gray-500 font-body text-xs">
                        {user.last_login ? formatRelativeTime(user.last_login) : 'Never'}
                      </td>
                      <td className="px-3 py-2 text-gray-500 font-body text-xs">
                        {formatDate(user.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* === TAB: Activity Breakdown === */}
      {tab === 'activity' && (
        <motion.div
          className="bg-white rounded-2xl shadow-card overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="p-6">
            <h2 className="font-display text-lg font-bold text-hist-dark mb-4">Activity Breakdown</h2>
            {activityBreakdown.length === 0 ? (
              <div className="text-center text-gray-400 text-sm py-8">
                No activities completed yet
              </div>
            ) : (
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
            )}
            <div className="text-xs text-gray-400 mt-3">{totalActivities} total activities completed</div>
          </div>
        </motion.div>
      )}
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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}
