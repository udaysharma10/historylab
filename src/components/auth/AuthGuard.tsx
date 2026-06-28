import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useAuth } from '../../hooks/useAuth'
import type { Profile } from '../../hooks/useAuth'
import { LoginPage } from './LoginPage'
import { ProfileSetup } from './ProfileSetup'
import type { ProfileFormData } from './ProfileSetup'
import { isAdminTeacher } from '../../lib/adminEmails'

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
  const { user, profile, loading, signInWithGoogle, signOut, updateProfile } = useAuth()
  const [signingIn, setSigningIn] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const autoSetupDone = useRef(false)

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
        style={{ background: 'linear-gradient(135deg, #FBF5EE, #F4E8DA)' }}
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

  // Not signed in
  if (!user) {
    const handleSignIn = async () => {
      setSigningIn(true)
      try {
        await signInWithGoogle()
      } catch {
        setSigningIn(false)
      }
    }

    return <LoginPage onSignIn={handleSignIn} loading={signingIn} />
  }

  // Signed in but profile not completed
  if (!profile?.profile_completed) {
    // Admin teachers are auto-completed via useEffect above, show loading
    if (isAdminTeacher(user.email)) {
      return (
        <div className="min-h-dvh flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #FBF5EE, #F4E8DA)' }}
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
          class: data.class || null,
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
      {children}
    </AuthContext.Provider>
  )
}
