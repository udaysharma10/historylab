import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  soundEnabled: boolean
  fontSize: 'small' | 'medium' | 'large'
  darkMode: boolean
  toggleSound: () => void
  setFontSize: (size: 'small' | 'medium' | 'large') => void
  toggleDarkMode: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      soundEnabled: true,
      fontSize: 'medium',
      darkMode: false,

      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      setFontSize: (fontSize) => set({ fontSize }),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
    }),
    { name: 'vedansh-history-settings' }
  )
)
