import { useState } from 'react'
import { motion } from 'framer-motion'

// Sprint 1 (plan §5): open signup captures a required guardian email and a
// timestamped DPDPA parental-consent confirmation. Roles are student/teacher
// (Neha's Sprint-4 review: Parent dropped — parents act through their kid's
// account; class/section capture dropped). For a teacher the guardian email
// is their own sign-in email; the role carries no privileges (admins are a
// server-side concept).
export interface ProfileFormData {
  name: string
  school: string
  role: 'student' | 'teacher'
  guardianEmail: string
  consentAt: string
}

interface ProfileSetupProps {
  initialName: string
  initialEmail: string
  avatarUrl: string | null
  onComplete: (data: ProfileFormData) => void
  onSignOut?: () => void
  saving?: boolean
  error?: string | null
}

const ROLES = [
  { value: 'student' as const, label: 'Student', icon: '🎓', desc: 'I\'m here to learn' },
  { value: 'teacher' as const, label: 'Teacher', icon: '📖', desc: 'I teach history' },
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ProfileSetup({ initialName, initialEmail, avatarUrl, onComplete, onSignOut, saving, error }: ProfileSetupProps) {
  const [name, setName] = useState(initialName)
  const [school, setSchool] = useState('')
  const [role, setRole] = useState<'student' | 'teacher' | ''>('')
  const [guardianEmail, setGuardianEmail] = useState('')
  const [consent, setConsent] = useState(false)

  // Teachers are adults — their own sign-in email is the contact address.
  const effectiveGuardianEmail = role === 'teacher' ? initialEmail : guardianEmail.trim()
  const guardianEmailValid = EMAIL_RE.test(effectiveGuardianEmail)

  const canSubmit =
    name.trim() &&
    school.trim() &&
    role &&
    guardianEmailValid &&
    consent

  const handleSubmit = () => {
    if (!canSubmit || !role) return
    onComplete({
      name: name.trim(),
      school: school.trim(),
      role,
      guardianEmail: effectiveGuardianEmail.toLowerCase(),
      consentAt: new Date().toISOString(),
    })
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #FBEFE7, #F1ECFA)' }}
    >
      <motion.div
        className="bg-white rounded-3xl p-8 shadow-card max-w-lg w-full my-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-hist-gold/30" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-hist-blue mx-auto mb-3 flex items-center justify-center text-white text-2xl font-display font-bold">
              {name ? name[0].toUpperCase() : '?'}
            </div>
          )}
          <h2 className="font-display text-2xl font-bold text-hist-dark">Who's studying?</h2>
          <p className="text-sm text-gray-500 mt-1">Takes 20 seconds — then straight into the chapter</p>
        </div>

        <div className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-hist-dark mb-1.5">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-hist-blue focus:outline-none font-body text-base"
              autoFocus
            />
          </div>

          {/* School */}
          <div>
            <label className="block text-sm font-semibold text-hist-dark mb-1.5">School Name</label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="e.g., DPS Gurugram"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-hist-blue focus:outline-none font-body text-base"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-hist-dark mb-2">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map((r) => (
                <motion.button
                  key={r.value}
                  className={`p-3 rounded-xl border-2 text-center transition-colors ${
                    role === r.value
                      ? 'border-hist-blue bg-hist-blue/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setRole(r.value)}
                >
                  <div className="text-2xl mb-1">{r.icon}</div>
                  <div className="font-display font-bold text-sm text-hist-dark">{r.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{r.desc}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Guardian email (students enter it; teachers use their own email) */}
          {role === 'student' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.2 }}
            >
              <label className="block text-sm font-semibold text-hist-dark mb-1.5">
                Parent / Guardian Email <span className="text-hist-red">*</span>
              </label>
              <input
                type="email"
                value={guardianEmail}
                onChange={(e) => setGuardianEmail(e.target.value)}
                placeholder="parent@example.com"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-hist-blue focus:outline-none font-body text-base"
              />
              <p className="text-xs text-gray-400 font-body mt-1.5">
                Used for progress updates, purchase receipts and account safety. Never shared.
              </p>
            </motion.div>
          )}

          {/* DPDPA consent */}
          {role && (
            <motion.label
              className="flex items-start gap-3 p-3.5 rounded-xl border-2 border-gray-200 cursor-pointer hover:border-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#DC835F]"
              />
              <span className="text-xs text-gray-500 font-body leading-relaxed">
                {role === 'student'
                  ? 'I confirm that my parent/guardian (at the email above) consents to my use of HistoryLab and to receiving account and progress emails.'
                  : 'I consent to using HistoryLab and to receiving account emails at my email address.'}
              </span>
            </motion.label>
          )}

          {/* Error message */}
          {error && (
            <div className="rounded-xl p-3 bg-red-50 border border-red-200 text-red-700 text-sm font-body">
              {error}
            </div>
          )}

          {/* Submit */}
          <motion.button
            className={`w-full font-display text-lg px-8 py-3.5 rounded-xl shadow-button btn-press text-white font-bold ${
              canSubmit ? 'bg-hist-gold' : 'bg-gray-300 cursor-not-allowed'
            }`}
            whileHover={canSubmit ? { scale: 1.02 } : {}}
            whileTap={canSubmit ? { scale: 0.98 } : {}}
            onClick={handleSubmit}
            disabled={!canSubmit || saving}
          >
            {saving ? 'Saving...' : 'Start Learning'}
          </motion.button>

          {/* Sign out link */}
          {onSignOut && (
            <button
              className="w-full text-center text-sm text-gray-400 hover:text-gray-600 font-body mt-2"
              onClick={onSignOut}
            >
              Sign out and use a different account
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
