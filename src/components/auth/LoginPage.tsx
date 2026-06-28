import { motion } from 'framer-motion'

interface LoginPageProps {
  onSignIn: () => void
  loading?: boolean
}

export function LoginPage({ onSignIn, loading }: LoginPageProps) {
  return (
    <div className="min-h-dvh flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #FBEFE7, #F1ECFA)' }}
    >
      <motion.div
        className="bg-white rounded-3xl p-8 shadow-card max-w-md w-full text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        {/* Logo */}
        <motion.div
          className="text-6xl mb-4"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          📜
        </motion.div>

        <h1 className="font-display text-3xl font-bold text-hist-dark mb-1">
          History<span className="text-hist-gold">Lab</span>
        </h1>
        <p className="text-gray-500 mb-2 font-body">
          The Rise of Nationalism in Europe
        </p>
        <p className="text-sm text-gray-400 mb-8 font-body">
          Interactive NCERT learning for Class 10
        </p>

        {/* Google Sign In Button */}
        <motion.button
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-hist-blue/40 rounded-xl px-6 py-3.5 font-body text-base font-semibold text-hist-dark transition-colors shadow-sm hover:shadow-md"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSignIn}
          disabled={loading}
        >
          {/* Google icon */}
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </motion.button>

        <p className="text-xs text-gray-400 mt-6">
          For students, teachers & parents
        </p>
      </motion.div>
    </div>
  )
}
