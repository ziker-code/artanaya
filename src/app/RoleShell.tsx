import { useEffect } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router'
import { BottomNav, DisclaimerBar, Skeleton, type NavItem } from '@/design'
import { useStore } from '@/data/store'
import { startSync } from '@/data/sync'
import type { Role } from '@/data/types'

const NAV: Record<Role, NavItem[]> = {
  nelayan: [
    { key: '', label: 'Beranda', icon: 'home' },
    { key: 'proyek', label: 'Proyek Saya', icon: 'folder' },
    { key: 'dompet', label: 'Dompetku', icon: 'wallet' },
    { key: 'bantuan', label: 'Bantuan', icon: 'help' },
    { key: 'profil', label: 'Profil', icon: 'user' },
  ],
  investor: [
    { key: '', label: 'Beranda', icon: 'home' },
    { key: 'portofolio', label: 'Portofolio', icon: 'chart-bar' },
    { key: 'komunitas', label: 'Komunitas', icon: 'chats' },
    { key: 'radar', label: 'Radar', icon: 'shield-check' },
    { key: 'profil', label: 'Profil', icon: 'user' },
  ],
  admin: [
    { key: '', label: 'Beranda', icon: 'home' },
    { key: 'tinjau', label: 'Tinjau', icon: 'clipboard-check' },
    { key: 'ledger', label: 'Ledger', icon: 'link' },
    { key: 'radar', label: 'Radar AI', icon: 'radar' },
    { key: 'profil', label: 'Profil', icon: 'user' },
  ],
}

export function useBoot() {
  const ready = useStore((s) => s.ready)
  const init = useStore((s) => s.init)
  useEffect(() => {
    void init().then(() => startSync())
  }, [init])
  return ready
}

export function RoleShell({ role }: { role: Role }) {
  const ready = useBoot()
  const me = useStore((s) => s.users.find((u) => u.id === s.sessionUserId))
  const loc = useLocation()
  const nav = useNavigate()

  if (!ready) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-[480px] flex-col gap-4 p-5">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-44 w-full rounded-lg" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }
  if (!me || me.role !== role) return <Navigate to="/" replace />

  const seg = loc.pathname.split('/')[2] ?? ''
  const items = NAV[role]
  const active = items.some((i) => i.key === seg) ? seg : ''
  const depth = loc.pathname.split('/').filter(Boolean).length
  const isRoot = depth === 1 || (depth === 2 && items.some((i) => i.key === seg))

  return (
    <div className="min-h-dvh bg-paper-sunk/60">
      <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-paper shadow-[0_0_0_1px_var(--color-line)]">
        <main className="flex-1">
          <Outlet />
          <DisclaimerBar />
        </main>
        {isRoot && <BottomNav items={items} active={active} onSelect={(k) => nav(`/${role}${k ? `/${k}` : ''}`)} />}
      </div>
    </div>
  )
}
