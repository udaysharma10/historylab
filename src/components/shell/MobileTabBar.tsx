import { useLocation, useNavigate } from 'react-router-dom'
import { useAccess } from '../auth/AccessProvider'
import { IconBook, IconLayers, IconTarget, IconPencil } from './icons'

// Mobile-only bottom tab bar (2026-07-28 mobile track) — the sidebar's four
// groups as thumb-reach app tabs. Rendered by WorkspaceShell only, so
// immersion routes (reader/quiz/player) and the Shelf never show it.
const TABS = [
  { key: 'learn', label: 'Learn', Icon: IconBook, path: (cid: string) => `/chapter/${cid}` },
  { key: 'revise', label: 'Revise', Icon: IconLayers, path: (cid: string) => `/chapter/${cid}/revise` },
  { key: 'practice', label: 'Practice', Icon: IconTarget, path: (cid: string) => `/chapter/${cid}/tests` },
  { key: 'exam', label: 'Exam Prep', Icon: IconPencil, path: (cid: string) => `/chapter/${cid}/exam` },
] as const

function activeTab(pathname: string): string {
  if (/\/(tests)(\/|$)/.test(pathname)) return 'practice'
  if (/\/(exam)(\/|$)/.test(pathname)) return 'exam'
  if (/\/(revise|flashcards|timeline|maps|figures)(\/|$)/.test(pathname)) return 'revise'
  return 'learn'
}

export function MobileTabBar({ chapterId }: { chapterId: string }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { canAccessChapter } = useAccess()
  const locked = !canAccessChapter(chapterId)
  const active = activeTab(pathname)

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-v2-line flex px-1 pt-1.5"
      style={{ paddingBottom: 'calc(0.375rem + env(safe-area-inset-bottom))' }}
    >
      {TABS.map(({ key, label, Icon, path }) => (
        <button
          key={key}
          className={`flex-1 flex flex-col items-center gap-0.5 py-1 text-[10.5px] font-bold ${
            active === key ? 'text-v2-accent' : 'text-v2-muted'
          }`}
          onClick={() => navigate(path(chapterId))}
        >
          <span className="relative">
            <Icon className="w-[22px] h-[22px]" />
            {key === 'practice' && locked && (
              <span className="absolute -top-1 -right-2 text-[9px]">🔒</span>
            )}
          </span>
          {label}
        </button>
      ))}
    </nav>
  )
}
