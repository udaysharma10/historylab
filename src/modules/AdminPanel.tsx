import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuthContext } from '../components/auth'
import { useAccess } from '../components/auth/AccessProvider'
import { chapterSlug } from '../lib/contentIds'
import { PapersAdmin } from './testcentre/PapersAdmin'

// Admin panel v1 (Sprint 1, plan §6): view users, grant/revoke chapter
// entitlements (admin_grant rows — how pilot cohorts and FOC comps get
// access), view purchases. Server-enforced by RLS (admins table); this UI is
// only reachable/usable by admin accounts.
interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  school: string | null
  class: string | null
  guardian_email: string | null
  guardian_consent_at: string | null
  created_at: string
}

interface EntitlementRow {
  id: string
  user_id: string
  chapter_id: string
  source: string
  note: string | null
  created_at: string
}

interface PurchaseRow {
  id: string
  status: string
  amount_paise: number | null
  created_at: string
  products: { name: string } | null
  profiles: { email: string } | null
}

export function AdminPanel() {
  const navigate = useNavigate()
  const { profile } = useAuthContext()
  const { isAdmin, loading: accessLoading, products, refresh } = useAccess()

  const [tab, setTab] = useState<'users' | 'purchases' | 'pricing' | 'papers'>('users')
  const [priceEdits, setPriceEdits] = useState<Record<string, { price: string; list: string }>>({})
  const [users, setUsers] = useState<AdminUser[]>([])
  const [entitlements, setEntitlements] = useState<EntitlementRow[]>([])
  const [purchases, setPurchases] = useState<PurchaseRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const gatedChapters = useMemo(
    () => products.filter((p) => p.kind === 'chapter' && !p.is_free),
    [products]
  )

  const loadData = useCallback(async () => {
    setLoading(true)
    const [usersRes, entRes, purRes] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('entitlements').select('*'),
      supabase
        .from('purchases')
        .select('id, status, amount_paise, created_at, products(name), profiles(email)')
        .order('created_at', { ascending: false }),
    ])
    if (usersRes.data) setUsers(usersRes.data as AdminUser[])
    if (entRes.data) setEntitlements(entRes.data as EntitlementRow[])
    if (purRes.data) setPurchases(purRes.data as unknown as PurchaseRow[])
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!accessLoading && !isAdmin) navigate('/', { replace: true })
  }, [accessLoading, isAdmin, navigate])

  useEffect(() => {
    if (isAdmin) loadData()
  }, [isAdmin, loadData])

  const entitlementsByUser = useMemo(() => {
    const map: Record<string, EntitlementRow[]> = {}
    for (const e of entitlements) (map[e.user_id] ??= []).push(e)
    return map
  }, [entitlements])

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return users
    return users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    )
  }, [users, search])

  const grant = async (userId: string, chapterId: string) => {
    setBusy(true)
    setError(null)
    const { error: err } = await supabase.from('entitlements').insert({
      user_id: userId,
      chapter_id: chapterId,
      source: 'admin_grant',
      granted_by: profile.id,
      note: note.trim() || null,
    })
    if (err) setError(`Grant failed: ${err.message}`)
    else {
      await loadData()
      refresh()
    }
    setBusy(false)
  }

  const revoke = async (entitlementId: string) => {
    setBusy(true)
    setError(null)
    const { error: err } = await supabase.from('entitlements').delete().eq('id', entitlementId)
    if (err) setError(`Revoke failed: ${err.message}`)
    else {
      await loadData()
      refresh()
    }
    setBusy(false)
  }

  if (accessLoading || (!isAdmin && loading)) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-gray-400 font-body">
        Loading…
      </div>
    )
  }
  if (!isAdmin) return null

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-hist-dark mb-1">Admin</h1>
        <p className="font-body text-sm text-gray-500 mb-5">
          Accounts, chapter grants and purchases. Grants unlock a chapter exactly like a purchase.
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {(['users', 'purchases', 'pricing', 'papers'] as const).map((t) => (
            <button
              key={t}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                tab === t ? 'bg-hist-dark text-white' : 'bg-white text-hist-dark shadow-card'
              }`}
              onClick={() => setTab(t)}
            >
              {t === 'users'
                ? `Users (${users.length})`
                : t === 'purchases'
                  ? `Purchases (${purchases.length})`
                  : t === 'pricing'
                    ? 'Pricing'
                    : 'Papers'}
            </button>
          ))}
        </div>

        {error && (
          <div className="rounded-xl p-3 mb-4 bg-red-50 border border-red-200 text-red-700 text-sm font-body">
            {error}
          </div>
        )}

        {tab === 'users' && (
          <>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-hist-blue focus:outline-none font-body text-sm mb-4 bg-white"
            />
            {loading ? (
              <div className="text-gray-400 font-body text-sm">Loading users…</div>
            ) : (
              <div className="space-y-2">
                {filteredUsers.map((u) => {
                  const owned = entitlementsByUser[u.id] ?? []
                  const expanded = expandedId === u.id
                  return (
                    <div key={u.id} className="bg-white rounded-2xl shadow-card overflow-hidden">
                      <button
                        className="w-full text-left px-4 py-3 flex items-center gap-3"
                        onClick={() => setExpandedId(expanded ? null : u.id)}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-display font-bold text-sm text-hist-dark truncate">
                            {u.name || '(no name)'}
                            <span className="ml-2 font-body font-normal text-xs text-gray-400">
                              {u.role}
                              {u.class ? ` · ${u.class}` : ''}
                            </span>
                          </div>
                          <div className="font-body text-xs text-gray-500 truncate">{u.email}</div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {owned.map((e) => (
                            <span
                              key={e.id}
                              className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-hist-green/10 text-hist-green"
                            >
                              {chapterSlug(e.chapter_id)}
                            </span>
                          ))}
                          <span className="text-gray-300 text-xs">{expanded ? '▴' : '▾'}</span>
                        </div>
                      </button>

                      {expanded && (
                        <div className="px-4 pb-4 pt-1 border-t border-hist-line space-y-3">
                          <div className="font-body text-xs text-gray-500">
                            School: {u.school || '—'} · Guardian: {u.guardian_email || '—'}
                            {u.guardian_consent_at
                              ? ` · Consent: ${new Date(u.guardian_consent_at).toLocaleDateString()}`
                              : ' · Consent: —'}
                            {' · Joined: '}
                            {new Date(u.created_at).toLocaleDateString()}
                          </div>

                          {/* Owned chapters */}
                          {owned.length > 0 && (
                            <div className="space-y-1.5">
                              {owned.map((e) => (
                                <div
                                  key={e.id}
                                  className="flex items-center justify-between text-xs font-body bg-hist-green/5 rounded-lg px-3 py-2"
                                >
                                  <span>
                                    <b>{chapterSlug(e.chapter_id)}</b> · {e.source}
                                    {e.note ? ` · “${e.note}”` : ''}
                                  </span>
                                  <button
                                    className="text-hist-red font-semibold hover:underline disabled:opacity-40"
                                    disabled={busy}
                                    onClick={() => revoke(e.id)}
                                  >
                                    Revoke
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Grant buttons for chapters not yet owned */}
                          {gatedChapters.some((p) => !owned.find((e) => e.chapter_id === p.id)) && (
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Grant note (e.g. Pilot cohort) — optional"
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-hist-blue focus:outline-none font-body text-xs"
                              />
                              <div className="flex flex-wrap gap-2">
                                {gatedChapters
                                  .filter((p) => !owned.find((e) => e.chapter_id === p.id))
                                  .map((p) => (
                                    <button
                                      key={p.id}
                                      className="text-xs font-semibold px-3 py-1.5 rounded-full bg-hist-gold text-white disabled:opacity-40"
                                      disabled={busy}
                                      onClick={() => grant(u.id, p.id)}
                                    >
                                      + Grant {chapterSlug(p.id)}
                                    </button>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
                {filteredUsers.length === 0 && (
                  <div className="text-gray-400 font-body text-sm text-center py-8">
                    No users match “{search}”.
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {tab === 'pricing' && (
          <div className="bg-white rounded-2xl shadow-card p-4 space-y-4">
            <p className="text-xs text-gray-400 font-body">
              Prices update everywhere instantly (locked cards, purchase sheet, landing). Amounts
              in rupees; “List” is the struck-through price — leave blank for none.
            </p>
            {products.map((p) => {
              const edit = priceEdits[p.id] ?? {
                price: String(p.price_paise / 100),
                list: p.list_price_paise != null ? String(p.list_price_paise / 100) : '',
              }
              const dirty =
                Number(edit.price) * 100 !== p.price_paise ||
                (edit.list === '' ? null : Number(edit.list) * 100) !== p.list_price_paise
              return (
                <div key={p.id} className="flex flex-wrap items-center gap-3 border-b border-hist-line last:border-0 pb-3 last:pb-0">
                  <div className="flex-1 min-w-[180px]">
                    <div className="font-display font-bold text-sm text-hist-dark">{p.name}</div>
                    <div className="font-body text-[11px] text-gray-400">
                      {p.id} · {p.is_free ? 'free' : p.kind}
                      {p.preview_section ? ` · preview: ${p.preview_section}` : ''}
                    </div>
                  </div>
                  <label className="text-xs font-body text-gray-500">
                    ₹{' '}
                    <input
                      type="number"
                      min="0"
                      value={edit.price}
                      onChange={(e) => setPriceEdits((s) => ({ ...s, [p.id]: { ...edit, price: e.target.value } }))}
                      className="w-20 px-2 py-1.5 rounded-lg border border-gray-200 focus:border-hist-blue focus:outline-none"
                    />
                  </label>
                  <label className="text-xs font-body text-gray-500">
                    List ₹{' '}
                    <input
                      type="number"
                      min="0"
                      value={edit.list}
                      onChange={(e) => setPriceEdits((s) => ({ ...s, [p.id]: { ...edit, list: e.target.value } }))}
                      className="w-20 px-2 py-1.5 rounded-lg border border-gray-200 focus:border-hist-blue focus:outline-none"
                    />
                  </label>
                  <button
                    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-hist-gold text-white disabled:opacity-40"
                    disabled={busy || !dirty || edit.price === '' || Number.isNaN(Number(edit.price))}
                    onClick={async () => {
                      setBusy(true)
                      setError(null)
                      const { error: err } = await supabase
                        .from('products')
                        .update({
                          price_paise: Math.round(Number(edit.price) * 100),
                          list_price_paise:
                            edit.list === '' ? null : Math.round(Number(edit.list) * 100),
                        })
                        .eq('id', p.id)
                      if (err) setError(`Price update failed: ${err.message}`)
                      else {
                        setPriceEdits((s) => {
                          const next = { ...s }
                          delete next[p.id]
                          return next
                        })
                        await refresh()
                      }
                      setBusy(false)
                    }}
                  >
                    Save
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {tab === 'purchases' && (
          <div className="bg-white rounded-2xl shadow-card p-4">
            {purchases.length === 0 ? (
              <p className="text-gray-400 font-body text-sm text-center py-6">
                No purchases yet — Razorpay checkout lands in Sprint 3. Admin grants appear under
                each user in the Users tab.
              </p>
            ) : (
              <div className="space-y-2">
                {purchases.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between text-xs font-body border-b border-hist-line last:border-0 py-2"
                  >
                    <span className="truncate">
                      {p.profiles?.email ?? '—'} · {p.products?.name ?? '—'}
                    </span>
                    <span className="shrink-0 ml-3">
                      {p.amount_paise != null ? `₹${(p.amount_paise / 100).toFixed(0)}` : '—'} ·{' '}
                      <b>{p.status}</b> · {new Date(p.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'papers' && <PapersAdmin />}
      </motion.div>
    </div>
  )
}
