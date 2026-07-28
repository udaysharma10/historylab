import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { MobileTabBar } from './MobileTabBar'
import { useAuthContext } from '../auth'
import { useProgressStore } from '../../store/useProgressStore'
import { IconMenu, IconClose, IconChevronRight, IconChevronLeft, IconStar } from './icons'

export interface Crumb {
  label: string
  to?: string
}

interface WorkspaceShellProps {
  chapterId: string
  /** kept for API compatibility — the CH pill retired with the mobile tab bar */
  chapterNumber?: number
  /** Max two segments (decision #37) — the chapter name lives in the sidebar. */
  crumbs?: Crumb[]
  /** Right rail content. Omit → two-column layout (sidebar + pane). */
  rail?: ReactNode
  children: ReactNode
}

// Altitude 2 — the chapter workspace (decision #37/#38): sidebar + main pane
// + rail on desktop; top bar + slide-in drawer on mobile with the rail
// stacking below the pane. Immersive routes (reader/quiz/player) never
// render this shell.
export function WorkspaceShell({
  chapterId,
  crumbs,
  rail,
  children,
}: WorkspaceShellProps) {
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { profile } = useAuthContext()
  const totalStars = useProgressStore((s) => s.totalStars)

  return (
    <div className="min-h-dvh">
      {/* Mobile top bar — mobile track 2026-07-28: stars + avatar replace the
          CH pill (chapter identity lives in the hero + drawer). Avatar opens
          the drawer, whose bottom block holds profile + sign out. */}
      <div className="lg:hidden flex items-center gap-3 px-4 py-3">
        <button
          className="text-v2-ink p-1"
          aria-label="Open menu"
          onClick={() => setDrawerOpen(true)}
        >
          <IconMenu />
        </button>
        <button
          className="font-display text-[17px] font-bold text-v2-ink"
          onClick={() => navigate('/')}
        >
          History<span className="text-v2-accent">Lab</span>
        </button>
        <span className="ml-auto flex items-center gap-1 bg-v2-accent-soft rounded-full px-2.5 py-1 text-[11px] font-extrabold text-v2-accent-deep">
          <IconStar className="w-3.5 h-3.5" /> {totalStars}
        </span>
        <button aria-label="Profile" onClick={() => setDrawerOpen(true)}>
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <span className="w-8 h-8 rounded-full bg-v2-accent text-white grid place-items-center text-[13px] font-extrabold">
              {(profile.name || 'S').charAt(0).toUpperCase()}
            </span>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-[268px] bg-v2-page1 shadow-v2 p-4 overflow-y-auto">
            <button
              className="text-v2-muted mb-2 p-1"
              aria-label="Close menu"
              onClick={() => setDrawerOpen(false)}
            >
              <IconClose />
            </button>
            <Sidebar chapterId={chapterId} onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      <div
        className={`mx-auto max-w-[1300px] grid grid-cols-1 gap-7 px-4 lg:px-7 pt-1 lg:pt-5 pb-28 lg:pb-16 ${
          rail
            ? 'lg:grid-cols-[224px_minmax(0,1fr)_292px]'
            : 'lg:grid-cols-[224px_minmax(0,1fr)]'
        }`}
      >
        {/* Sidebar — desktop only (drawer covers mobile). Fixed viewport
            height so the profile block pins to the bottom edge. */}
        <aside className="hidden lg:block sticky top-5 min-w-0 h-[calc(100dvh-2.5rem)]">
          <Sidebar chapterId={chapterId} />
        </aside>

        <main className="min-w-0">
          {/* Mobile: full crumbs truncate into noise at 390px — collapse to a
              single parent back-link (the tab bar carries orientation now). */}
          {crumbs && crumbs.length > 1 && crumbs[crumbs.length - 2].to && (
            <button
              className="lg:hidden flex items-center gap-1 text-[12.5px] font-bold text-v2-muted mb-3"
              onClick={() => navigate(crumbs[crumbs.length - 2].to!)}
            >
              <IconChevronLeft className="w-[14px] h-[14px]" />
              <span className="truncate max-w-[260px]">{crumbs[crumbs.length - 2].label}</span>
            </button>
          )}
          {crumbs && crumbs.length > 0 && (
            <nav className="hidden lg:flex items-center gap-2 text-[12.5px] font-bold text-v2-muted mb-3.5">
              {crumbs.map((crumb, i) => {
                const last = i === crumbs.length - 1
                return (
                  <span key={i} className="flex items-center gap-2 min-w-0">
                    {crumb.to && !last ? (
                      <button
                        className="hover:text-v2-ink transition-colors truncate max-w-[240px]"
                        onClick={() => navigate(crumb.to!)}
                      >
                        {crumb.label}
                      </button>
                    ) : (
                      <span className={last ? 'text-v2-ink truncate' : undefined}>
                        {crumb.label}
                      </span>
                    )}
                    {!last && <IconChevronRight className="w-[13px] h-[13px] shrink-0" />}
                  </span>
                )
              })}
            </nav>
          )}
          {children}
        </main>

        {rail && <div className="lg:sticky lg:top-5 h-fit min-w-0">{rail}</div>}
      </div>

      {/* Mobile bottom tab bar — workspace altitude only (this shell never
          wraps immersion routes or the Shelf). */}
      <MobileTabBar chapterId={chapterId} />
    </div>
  )
}
