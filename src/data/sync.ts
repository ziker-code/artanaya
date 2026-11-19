import { create } from 'zustand'
import { loadRemote, remoteEnabled, saveRemote, subscribeRemote } from './remote'
import { useStore } from './store'

/**
 * Menyambungkan store lokal ke Supabase:
 * - saat mulai: ambil data bersama (atau unggah seed bila tabel masih kosong)
 * - setiap aksi: simpan ke Supabase (debounce 250 ms, nomor versi naik)
 * - perubahan dari perangkat lain: masuk lewat Realtime
 * Jika Supabase gagal, aplikasi tetap jalan dengan data lokal.
 */
type SyncStatus = 'local' | 'connecting' | 'online' | 'error'
export const useSyncStatus = create<{ status: SyncStatus }>(() => ({ status: remoteEnabled ? 'connecting' : 'local' }))

const SYNCED = ['users', 'projects', 'investments', 'alerts', 'securityEvents', 'ledger', 'selfLocked', 'tamper'] as const
type Synced = Pick<ReturnType<typeof useStore.getState>, (typeof SYNCED)[number]>

const pick = (s: ReturnType<typeof useStore.getState>): Synced =>
  Object.fromEntries(SYNCED.map((k) => [k, s[k]])) as Synced

let started = false
let version = 0
let applyingRemote = false
let timer: ReturnType<typeof setTimeout> | undefined

function apply(data: Synced, v: number) {
  applyingRemote = true
  useStore.setState({ ...data, ready: true })
  version = v
  applyingRemote = false
}

export async function startSync() {
  if (started || !remoteEnabled) return
  started = true
  const setStatus = (status: SyncStatus) => useSyncStatus.setState({ status })
  try {
    await useStore.getState().init()
    const row = await loadRemote<Synced>()
    if (row && Array.isArray(row.data?.projects) && row.data.projects.length) {
      apply(row.data, row.version)
    } else {
      version = 1
      await saveRemote(pick(useStore.getState()), version)
    }
    setStatus('online')
  } catch (e) {
    console.warn('[sync] Supabase tidak terjangkau, memakai data lokal', e)
    setStatus('error')
    return
  }

  useStore.subscribe((s, prev) => {
    if (applyingRemote) return
    if (!SYNCED.some((k) => s[k] !== prev[k])) return
    clearTimeout(timer)
    timer = setTimeout(async () => {
      version += 1
      try {
        await saveRemote(pick(useStore.getState()), version)
        setStatus('online')
      } catch (e) {
        console.warn('[sync] gagal menyimpan', e)
        setStatus('error')
      }
    }, 250)
  })

  subscribeRemote<Synced>((row) => {
    if (row.version <= version) return
    apply(row.data, row.version)
  })
}
