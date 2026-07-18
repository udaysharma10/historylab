import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

export interface Profile {
  id: string
  name: string
  email: string
  avatar_url: string | null
  role: 'student' | 'teacher' | 'parent'
  school: string | null
  class: string | null
  guardian_email: string | null
  guardian_consent_at: string | null
  profile_completed: boolean
  created_at: string
}

interface AuthState {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
  })

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (error) {
      console.error('fetchProfile failed:', error)
    }
    return data as Profile | null
  }, [])

  useEffect(() => {
    let settled = false

    const applySession = async (session: Session | null) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id)
        setState({ user: session.user, profile, session, loading: false })
      } else {
        setState({ user: null, profile: null, session: null, loading: false })
      }
    }

    // getSession() can deadlock on supabase-js's internal auth lock (known
    // issue: any supabase call made synchronously inside an onAuthStateChange
    // callback holds the lock the initial getSession is waiting for). All
    // callback work below is deferred out of the lock context, and if the
    // initial check still stalls we fall back to the session persisted in
    // localStorage instead of bouncing a logged-in user to the landing page.
    const timeout = setTimeout(() => {
      if (settled) return
      settled = true
      console.warn('Auth session check timed out — using persisted session fallback')
      try {
        const ref = new URL(import.meta.env.VITE_SUPABASE_URL).hostname.split('.')[0]
        const raw = localStorage.getItem(`sb-${ref}-auth-token`)
        const stored = raw ? (JSON.parse(raw) as Session) : null
        if (stored?.user && (stored.expires_at ?? 0) * 1000 > Date.now()) {
          applySession(stored)
          return
        }
      } catch {
        // fall through to signed-out
      }
      setState({ user: null, profile: null, session: null, loading: false })
    }, 5000)

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      applySession(session)
    }).catch(() => {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      setState({ user: null, profile: null, session: null, loading: false })
    })

    // Listen for auth changes. NEVER run supabase calls synchronously in this
    // callback — it executes while the auth lock is held (deadlock). Defer.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setTimeout(() => {
          settled = true
          clearTimeout(timeout)
          applySession(session)

          if (event === 'SIGNED_IN' && session?.user) {
            const device = /Mobile|Android|iPhone/i.test(navigator.userAgent)
              ? 'mobile'
              : /Tablet|iPad/i.test(navigator.userAgent)
                ? 'tablet'
                : 'desktop'
            supabase.from('login_sessions').insert({
              user_id: session.user.id,
              device,
              user_agent: navigator.userAgent,
            }).then(() => {})
          }
        }, 0)
      }
    )

    return () => {
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [fetchProfile])

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          prompt: 'select_account',  // Force Google account picker every time
        },
      },
    })
    if (error) throw error
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    // Clear Supabase auth keys only (not all localStorage — progress data lives there too)
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('sb-')) localStorage.removeItem(key)
    })
  }, [])

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!state.user) return

    const { error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', state.user.id)

    if (error) {
      console.error('Profile update failed:', error)
      throw error
    }

    // Refresh profile — retry a few times in case of propagation delay
    let profile = await fetchProfile(state.user.id)
    if (profile && !profile.profile_completed && updates.profile_completed) {
      // Update didn't propagate yet — wait and retry
      await new Promise(r => setTimeout(r, 500))
      profile = await fetchProfile(state.user.id)
    }

    setState((prev) => ({ ...prev, profile }))
  }, [state.user, fetchProfile])

  return {
    user: state.user,
    profile: state.profile,
    session: state.session,
    loading: state.loading,
    signInWithGoogle,
    signOut,
    updateProfile,
  }
}
