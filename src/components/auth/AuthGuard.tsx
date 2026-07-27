import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useAuth } from '../../hooks/useAuth'
import type { Profile } from '../../hooks/useAuth'
import { ProfileSetup } from './ProfileSetup'
import { LandingPage } from '../../modules/landing/LandingPage'
import { TermsPage, PrivacyPage, RefundPage } from '../../modules/legal/LegalPages'
import type { ProfileFormData } from './ProfileSetup'
import { isAdminTeacher } from '../../lib/adminEmails'
import { startSync, stopSync } from '../../lib/progressSync'
import { AccessProvider } from './AccessProvider'

interface AuthContextValue {
  profile: Profile
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthGuard')
  return ctx
}

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, profile, loading, profileError, signInWithGoogle, signOut, updateProfile } = useAuth()
  const [signingIn, setSigningIn] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const autoSetupDone = useRef(false)

  // Cross-device progress sync: hydrate + keep-highest merge on sign-in,
  // debounced flush of local changes (lib/progressSync.ts).
  useEffect(() => {
    if (!user?.id) return
    startSync(user.id)
    return stopSync
  }, [user?.id])

  // Auto-complete profile for admin teacher emails
  useEffect(() => {
    if (!user || !profile || profile.profile_completed || autoSetupDone.current) return
    if (!isAdminTeacher(user.email)) return

    autoSetupDone.current = true
    updateProfile({
      name: profile.name || user.user_metadata?.full_name || 'Teacher',
      role: 'teacher',
      school: 'Admin',
      profile_completed: true,
    })
  }, [user, profile, updateProfile])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #FBEFE7, #F1ECFA)' }}
      >
        <div className="text-center">
          <div className="text-5xl mb-4 animate-float">📜</div>
          <h1 className="font-display text-2xl font-bold text-hist-dark">
            History<span className="text-hist-gold">Lab</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  // Not signed in → public site (Sprint 2): landing page + legal pages.
  // AuthGuard sits above the router, so plain pathname routing here.
  if (!user) {
    const handleSignIn = async () => {
      setSigningIn(true)
      try {
        await signInWithGoogle()
      } catch {
        setSigningIn(false)
      }
    }

    const path = window.location.pathname
    if (path === '/terms') return <TermsPage />
    if (path === '/privacy') return <PrivacyPage />
    if (path === '/refunds') return <RefundPage />
    return <LandingPage onSignIn={handleSignIn} signingIn={signingIn} />
  }

  // Signed in but the profile fetch failed (e.g. waking from device sleep) —
  // NEVER show the setup form here; that re-asks set-up users "Who's studying?".
  if (!profile && profileError) {
    return (
      <div className="min-h-dvh flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #FBEFE7, #F1ECFA)' }}
      >
        <div className="text-center">
          <div className="text-5xl mb-4">📡</div>
          <p className="text-gray-500 font-body mb-4">Couldn't reach HistoryLab — check your connection.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-xl font-bold text-white"
            style={{ background: '#DC835F' }}
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  // Signed in but profile not completed
  if (!profile?.profile_completed) {
    // Admin teachers are auto-completed via useEffect above, show loading
    if (isAdminTeacher(user.email)) {
      return (
        <div className="min-h-dvh flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #FBEFE7, #F1ECFA)' }}
        >
          <div className="text-center">
            <div className="text-5xl mb-4 animate-float">👩‍🏫</div>
            <p className="text-gray-500 font-body">Setting up teacher account...</p>
          </div>
        </div>
      )
    }

    const handleProfileComplete = async (data: ProfileFormData) => {
      setSavingProfile(true)
      setSaveError(null)
      try {
        await updateProfile({
          name: data.name,
          school: data.school,
          role: data.role,
          guardian_email: data.guardianEmail,
          guardian_consent_at: data.consentAt,
          profile_completed: true,
        })
      } catch (err) {
        console.error('Profile save error:', err)
        setSaveError('Failed to save profile. Please try again.')
        setSavingProfile(false)
      }
    }

    return (
      <ProfileSetup
        initialName={profile?.name || user.user_metadata?.full_name || ''}
        initialEmail={user.email || ''}
        avatarUrl={profile?.avatar_url || user.user_metadata?.avatar_url || null}
        onComplete={handleProfileComplete}
        onSignOut={signOut}
        saving={savingProfile}
        error={saveError}
      />
    )
  }

  // Fully authenticated
  return (
    <AuthContext.Provider value={{ profile, signOut }}>
      <AccessProvider>{children}</AccessProvider>
    </AuthContext.Provider>
  )
}
