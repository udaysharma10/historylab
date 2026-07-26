import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthContext } from '../auth'
import { useAccess } from '../auth/AccessProvider'
import { useProgressStore } from '../../store/useProgressStore'
import {
  IconHome,
  IconPencil,
  IconTarget,
  IconLayers,
  IconCalendar,
  IconMap,
  IconImage,
} from './icons'

interface SidebarProps {
  chapterId: string
  /** Called after any navigation — the mobile drawer uses this to close itself. */
  onNavigate?: () => void
}

interface NavItem {
  label: string
  to: string
  icon: React.ReactNode
  isActive: (pathname: string, base: string) => boolean
  badge?: string
}

// The sidebar is the chapter workspace's fixed switchboard (decision #37/#38):
// identical on every workspace page. A section page is a child of Overview,
// so Overview stays highlighted there.
export function Sidebar({ chapterId, onNavigate }: SidebarProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { profile, signOut } = useAuthContext()
  const { isAdmin } = useAccess()
  const totalStars = useProgressStore((s) => s.totalStars)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const base = `/chapter/${chapterId}`

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  const groups: Array<{ label: string; items: NavItem[] }> = [
    {
      label: 'Learn',
      items: [
        {
          label: 'Overview',
          to: base,
          icon: <IconHome />,
          isActive: (p, b) => p === b || p.startsWith(`${b}/section`),
        },
      ],
    },
    {
      label: 'Practice',
      items: [
        {
          label: 'Practice',
          to: `${base}/exam`,
          icon: <IconPencil />,
          isActive: (p, b) => p.startsWith(`${b}/exam`),
        },
        {
          label: 'Mock Tests',
          to: `${base}/tests`,
          icon: <IconTarget />,
          isActive: (p, b) => p.startsWith(`${b}/tests`),
        },
      ],
    },
    {
      label: 'Revise',
      items: [
        {
          label: 'Flashcards',
          to: `${base}/flashcards`,
          icon: <IconLayers />,
          isActive: (p, b) => p.startsWith(`${b}/flashcards`),
        },
        {
          label: 'Timeline',
          to: `${base}/timeline`,
          icon: <IconCalendar />,
          isActive: (p, b) => p.startsWith(`${b}/timeline`),
        },
        {
          label: 'Maps',
          to: `${base}/maps`,
          icon: <IconMap />,
          isActive: (p, b) => p.startsWith(`${b}/maps`),
        },
        {
          label: 'Figures',
          to: `${base}/figures`,
          icon: <IconImage />,
          isActive: (p, b) => p.startsWith(`${b}/figures`),
        },
      ],
    },
  ]

  function goTo(to: string) {
    navigate(to)
    onNavigate?.()
  }

  return (
    <div className="flex flex-col">
      <button
        className="font-display text-[22px] font-bold text-v2-ink px-3 pb-4 text-left"
        onClick={() => goTo('/')}
      >
        History<span className="text-v2-accent">Lab</span>
      </button>

      <nav>
        {groups.map((group, gi) => (
          <div key={group.label}>
            <div
              className={`text-[10px] font-extrabold tracking-[1.2px] uppercase text-v2-muted px-3 mb-1.5 ${
                gi === 0 ? 'mt-0' : 'mt-3.5'
              }`}
            >
              {group.label}
            </div>
            {group.items.map((item) => {
              const active = item.isActive(pathname, base)
              return (
                <button
                  key={item.label}
                  className={`w-full flex items-center gap-[11px] px-3 py-2.5 rounded-[11px] text-[13.5px] font-bold text-left mb-0.5 transition-colors ${
                    active
                      ? 'bg-white text-v2-accent-deep shadow-v2-sm'
                      : 'text-v2-body hover:text-v2-ink'
                  }`}
                  onClick={() => goTo(item.to)}
                >
                  {item.icon}
                  {item.label}
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Profile block — replaces the old top-header identity + menu */}
      <div className="relative mt-5 mx-1" ref={menuRef}>
        <button
          className="w-full flex items-center gap-2.5 p-3 bg-white rounded-[14px] shadow-v2-sm text-left"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-v2-accent to-[#F2914E] text-white grid place-items-center font-display font-bold text-base shrink-0">
            {profile.name ? profile.name[0].toUpperCase() : '?'}
          </span>
          <span className="min-w-0">
            <span className="block text-[13px] font-extrabold text-v2-ink truncate">
              {profile.name}
            </span>
            <span className="block text-[10.5px] font-bold text-v2-muted capitalize">
              {profile.role} · ⭐ {totalStars} stars
            </span>
          </span>
        </button>

        {menuOpen && (
          <div className="absolute left-0 right-0 bottom-full mb-2 bg-white rounded-xl shadow-card-hover border border-gray-100 py-1.5 z-50">
            {isAdmin && (
              <>
                <button
                  className="w-full text-left px-4 py-2 text-sm font-semibold text-v2-body hover:bg-v2-page1"
                  onClick={() => {
                    setMenuOpen(false)
                    goTo('/dashboard')
                  }}
                >
                  Dashboard
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm font-semibold text-v2-body hover:bg-v2-page1"
                  onClick={() => {
                    setMenuOpen(false)
                    goTo('/admin')
                  }}
                >
                  Admin
                </button>
              </>
            )}
            <button
              className="w-full text-left px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50"
              onClick={async () => {
                setMenuOpen(false)
                await signOut()
              }}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
