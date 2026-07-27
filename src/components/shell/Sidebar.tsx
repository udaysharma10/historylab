import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthContext } from '../auth'
import { useAccess } from '../auth/AccessProvider'
import { useProgressStore } from '../../store/useProgressStore'
import { getChapter as getBookChapter } from '../../data/books'
import { getChapter } from '../../data/getChapter'
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
  const { isAdmin, canAccessChapter } = useAccess()
  const totalStars = useProgressStore((s) => s.totalStars)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const base = `/chapter/${chapterId}`
  const bookChapter = getBookChapter('history-10', chapterId)
  const chapterEntitled = canAccessChapter(chapterId)
  // Section tree under Overview (Uday 2026-07-27): location-driven — it
  // expands ONLY while inside a section (on Overview the journey list IS the
  // section list; duplicating it would wall up the sidebar). Titles only, no
  // progress marks — the rail ring is THE progress fact. No user-managed
  // collapse state: going deeper is what opens the map.
  const inSection = pathname.startsWith(`${base}/section/`)
  const sections = inSection ? (getChapter(chapterId)?.sections ?? []) : []

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  // Grouping per Neha's four concepts (2026-07-27): Learn / Revise /
  // Practice (Mock Tests) / Exam Prep. LEARN renders separately — it carries
  // the section tree.
  const groups: Array<{ label: string; items: NavItem[] }> = [
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
    {
      label: 'Practice',
      items: [
        {
          label: 'Mock Tests',
          to: `${base}/tests`,
          icon: <IconTarget />,
          isActive: (p, b) => p.startsWith(`${b}/tests`),
          // Honest discovery (law §4.6): preview users see the destination
          // exists but that it rides with the chapter purchase.
          badge: chapterEntitled ? undefined : '🔒',
        },
      ],
    },
    {
      label: 'Exam Prep',
      items: [
        {
          label: 'Exam Prep',
          to: `${base}/exam`,
          icon: <IconPencil />,
          isActive: (p, b) => p.startsWith(`${b}/exam`),
        },
      ],
    },
  ]

  // Inside a section the tree is expanded — drop the chapter-only Exam Prep
  // group there so the menu stays within one viewport (Uday 2026-07-27).
  const visibleGroups = inSection ? groups.filter((g) => g.label !== 'Exam Prep') : groups

  function goTo(to: string) {
    navigate(to)
    onNavigate?.()
  }

  return (
    <div className="flex flex-col h-full">
      <button
        className="font-display text-[22px] font-bold text-v2-ink px-3 pb-3 text-left"
        onClick={() => goTo('/')}
      >
        History<span className="text-v2-accent">Lab</span>
      </button>

      {/* Chapter identity (spec §1): ‹ All Chapters + the current chapter pill */}
      <button
        className="flex items-center gap-1 text-[10.5px] font-extrabold uppercase tracking-[0.8px] text-v2-muted hover:text-v2-ink transition-colors px-3 mb-1.5 text-left"
        onClick={() => goTo('/')}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        All Chapters
      </button>
      <button
        className="mx-1 mb-4 flex items-center gap-2.5 bg-white rounded-[12px] px-3 py-2.5 shadow-v2-sm text-left"
        onClick={() => goTo(base)}
      >
        <span className="w-7 h-7 rounded-[9px] bg-v2-accent text-white grid place-items-center font-display font-bold text-[12px] shrink-0">
          {bookChapter?.number ?? '?'}
        </span>
        <span className="text-[12px] font-extrabold text-v2-ink leading-snug line-clamp-2">
          {bookChapter?.title ?? 'Chapter'}
        </span>
      </button>

      {/* Nav scrolls on its own; identity above and profile below stay put. */}
      <nav className="flex-1 min-h-0 overflow-y-auto">
        {/* LEARN — Overview + the section tree (the sitemap, visible) */}
        <div>
          <div className="text-[10px] font-extrabold tracking-[1.2px] uppercase text-v2-muted px-3 mb-1.5 mt-0">
            Learn
          </div>
          <button
            className={`w-full flex items-center gap-[11px] px-3 py-2.5 rounded-[11px] text-[13.5px] font-bold text-left mb-0.5 transition-colors ${
              pathname === base
                ? 'bg-white text-v2-accent-deep shadow-v2-sm'
                : 'text-v2-body hover:text-v2-ink'
            }`}
            onClick={() => goTo(base)}
          >
            <IconHome />
            Overview
          </button>
          {sections.length > 0 && (
            <div className="ml-[21px] pl-2.5 border-l-2 border-v2-line mb-1">
              {sections.map((s) => {
                const active = pathname.startsWith(`${base}/section/${s.id}`)
                return (
                  <button
                    key={s.id}
                    className={`w-full flex items-center gap-2 px-2 py-[7px] rounded-[9px] text-[12px] font-bold text-left transition-colors ${
                      active
                        ? 'bg-white text-v2-accent-deep shadow-v2-sm'
                        : 'text-v2-muted hover:text-v2-ink'
                    }`}
                    onClick={() => goTo(`${base}/section/${s.id}`)}
                  >
                    <span
                      className={`text-[10px] font-extrabold shrink-0 ${
                        active ? 'text-v2-accent' : 'text-v2-muted/70'
                      }`}
                    >
                      S{s.number}
                    </span>
                    <span className="truncate">{s.title}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {visibleGroups.map((group) => (
          <div key={group.label}>
            <div className="text-[10px] font-extrabold tracking-[1.2px] uppercase text-v2-muted px-3 mb-1.5 mt-3.5">
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
                  {item.badge && (
                    <span className="ml-auto text-[11px] opacity-70">{item.badge}</span>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Profile block — replaces the old top-header identity + menu.
          mt-auto pins it to the sidebar's bottom edge (desktop gives the
          sidebar full viewport height). */}
      <div className="relative shrink-0 pt-4 mx-1" ref={menuRef}>
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
