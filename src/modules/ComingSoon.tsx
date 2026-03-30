import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'

const SECTION_NAMES: Record<string, string> = {
  s1: 'The French Revolution & the Nation',
  s2: 'Making of Nationalism in Europe',
  s3: 'Age of Revolutions: 1830-1848',
  s4: 'Making of Germany & Italy',
  s5: 'Visualising the Nation',
  s6: 'Nationalism & Imperialism',
}

export function ComingSoon() {
  const navigate = useNavigate()
  const { sectionId } = useParams()
  const sectionName = sectionId ? SECTION_NAMES[sectionId] : null

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div
        className="bg-white rounded-3xl p-8 shadow-card max-w-md w-full text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="text-6xl mb-4">🏗️</div>
        <h2 className="font-display text-2xl font-bold text-hist-dark mb-2">
          Coming Soon
        </h2>
        {sectionName && (
          <p className="text-hist-blue font-display font-bold mb-2">{sectionName}</p>
        )}
        <p className="text-gray-500 mb-6">
          This section is being built. Check back soon!
        </p>
        <motion.button
          className="bg-hist-gold text-white font-display px-8 py-3 rounded-full shadow-button btn-press"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
        >
          ← Back to Home
        </motion.button>
      </motion.div>
    </div>
  )
}
