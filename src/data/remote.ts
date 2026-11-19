import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Adapter Supabase (PRD §8.3, versi kilat): satu baris `demo_state` berisi seluruh data demo,
 * disinkronkan real-time. Tanpa env var → aplikasi otomatis memakai adapter lokal saja.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const remoteEnabled = Boolean(url && key)

let client: SupabaseClient | null = null
function db() {
  if (!client && url && key) client = createClient(url, key, { auth: { persistSession: false } })
  return client
}

export type RemoteRow<T> = { data: T; version: number }

export async function loadRemote<T>(): Promise<RemoteRow<T> | null> {
  const c = db()
  if (!c) return null
  const { data, error } = await c.from('demo_state').select('data, version').eq('id', 'main').maybeSingle()
  if (error) throw error
  return data as RemoteRow<T> | null
}

export async function saveRemote<T>(data: T, version: number) {
  const c = db()
  if (!c) return
  const { error } = await c.from('demo_state').upsert({ id: 'main', data, version, updated_at: new Date().toISOString() })
  if (error) throw error
}

export function subscribeRemote<T>(onChange: (row: RemoteRow<T>) => void) {
  const c = db()
  if (!c) return () => {}
  const ch = c
    .channel('demo_state')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'demo_state', filter: 'id=eq.main' }, (payload) => {
      const row = payload.new as { data?: T; version?: number }
      if (row?.data && typeof row.version === 'number') onChange({ data: row.data, version: row.version })
    })
    .subscribe()
  return () => {
    void c.removeChannel(ch)
  }
}
