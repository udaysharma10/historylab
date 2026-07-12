import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '../../lib/supabase'
import { chapterKey } from '../../lib/contentIds'
import { getChapter } from '../../data/books'

// Sprint 1: chapter access is server-driven (products + entitlements + admins,
// RLS-scoped), replacing the Round-8 client email allowlist. This client check
// still only gates the UI — content ships in the bundle until Sprint 2 moves
// premium chapters behind the get-chapter Edge Function.
export interface Product {
  id: string
  name: string
  kind: 'chapter' | 'addon'
  price_paise: number
  list_price_paise: number | null
  is_free: boolean
  active: boolean
}

interface AccessValue {
  loading: boolean
  isAdmin: boolean
  products: Product[]
  /** namespaced chapter ids (c10-hist-ch2) this user is entitled to */
  entitledChapters: Set<string>
  canAccessChapter: (chapterSlug: string) => boolean
  refresh: () => Promise<void>
}

const AccessContext = createContext<AccessValue | null>(null)

export function useAccess() {
  const ctx = useContext(AccessContext)
  if (!ctx) throw new Error('useAccess must be used within AccessProvider')
  return ctx
}

export function AccessProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [entitledChapters, setEntitledChapters] = useState<Set<string>>(new Set())

  const refresh = useCallback(async () => {
    const [productsRes, entitlementsRes, adminRes] = await Promise.all([
      supabase.from('products').select('*').eq('active', true),
      supabase.from('entitlements').select('chapter_id'),
      supabase.rpc('is_admin'),
    ])
    if (!productsRes.error && productsRes.data) setProducts(productsRes.data as Product[])
    if (!entitlementsRes.error && entitlementsRes.data) {
      setEntitledChapters(new Set(entitlementsRes.data.map((r) => r.chapter_id as string)))
    }
    if (!adminRes.error) setIsAdmin(adminRes.data === true)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const canAccessChapter = useCallback(
    (chapterSlug: string): boolean => {
      const ch = getChapter('history-10', chapterSlug)
      if (!ch || ch.status !== 'live') return false
      if (isAdmin) return true
      const key = chapterKey(chapterSlug)
      const product = products.find((p) => p.id === key)
      // Until products load, fall back to the bundled isFree flag so free
      // chapters never flash locked.
      if (product ? product.is_free : ch.isFree) return true
      return entitledChapters.has(key)
    },
    [isAdmin, products, entitledChapters]
  )

  const value = useMemo(
    () => ({ loading, isAdmin, products, entitledChapters, canAccessChapter, refresh }),
    [loading, isAdmin, products, entitledChapters, canAccessChapter, refresh]
  )

  return <AccessContext.Provider value={value}>{children}</AccessContext.Provider>
}
