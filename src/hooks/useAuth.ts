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
    // Get initial session with timeout (Supabase can hang on corrupted tokens)
    let settled = false
    const timeout = setTimeout(() => {
      if (!settled) {
        console.warn('Auth session check timed out — showing login')
        settled = true
        setState({ user: null, profile: null, session: null, loading: false })
      }
    }, 5000)

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      if (session?.user) {
        const profile = await fetchProfile(session.user.id)
        setState({ user: session.user, profile, session, loading: false })
      } else {
        setState({ user: null, profile: null, session: null, loading: false })
      }
    }).catch(() => {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      setState({ user: null, profile: null, session: null, loading: false })
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const profile = await fetchProfile(session.user.id)
          setState({ user: session.user, profile, session, loading: false })

          // Log login session
          if (event === 'SIGNED_IN') {
            const device = /Mobile|Android|iPhone/i.test(navigator.userAgent)
              ? 'mobile'
              : /Tablet|iPad/i.test(navigator.userAgent)
                ? 'tablet'
                : 'desktop'

            await supabase.from('login_sessions').insert({
              user_id: session.user.id,
              device,
              user_agent: navigator.userAgent,
            })
          }
        } else {
          setState({ user: null, profile: null, session: null, loading: false })
        }
      }
    )

    return () => subscription.unsubscribe()
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
