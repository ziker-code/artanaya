import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { EmptyState, Icon, IconButton, Panel, Reveal, TopBar, type IconName } from '@/design'
import { useMe, useStore } from '@/data/store'
import type { Role } from '@/data/types'
import { formatDate, formatRupiah } from '@/lib/format'
import { cn } from '@/lib/cn'

export type Notif = { id: string; icon: IconName; title: string; body: string; ts: string; to?: string; tone?: 'lime' | 'dark' | 'coral' }

type State = ReturnType<typeof useStore.getState>

/** Notifikasi diturunkan langsung dari data (proyek, ledger, radar, forum) — selalu sesuai kondisi terbaru. */
export function buildNotifs(s: State, meId: string, role: Role): Notif[] {
  const me = s.users.find((u) => u.id === meId)
  if (!me) return []
  const out: Notif[] = []
  const days = (iso: string) => (Date.now() - new Date(iso).getTime()) / 86_400_000

  const myThreads = s.forum.filter((t) => t.authorId === meId)
  for (const t of myThreads)
    for (const c of t.comments)
      if (c.authorId !== meId) out.push({ id: `cm-${c.id}`, icon: 'chats', title: `${c.authorName} membalas diskusi Anda`, body: `“${c.body.slice(0, 80)}”`, ts: c.createdAt, to: `/${role}/komunitas/${t.id}`, tone: 'dark' })

  if (role === 'nelayan') {
    for (const p of s.projects.filter((x) => x.ownerId === meId)) {
      const base = `/nelayan/proyek/${p.id}`
      if (p.status === 'review') out.push({ id: `rv-${p.id}`, icon: 'clipboard-check', title: `${p.id} sedang diverifikasi`, body: `Skor awal ${p.score.score}. Admin memeriksa berkas Bapak.`, ts: p.createdAt, to: base })
      if (p.status === 'coaching') out.push({ id: `co-${p.id}`, icon: 'help', title: `${p.title} dirujuk ke fasilitator`, body: 'Fasilitator akan membantu melengkapi data. Ini bukan penolakan.', ts: p.reviewedAt ?? p.createdAt, to: base, tone: 'coral' })
      if ((p.status === 'live' || p.status === 'running') && p.reviewedAt) out.push({ id: `lv-${p.id}`, icon: 'verified', title: `${p.title} sudah tayang`, body: 'Proyek sudah tampil di marketplace investor.', ts: p.reviewedAt, to: base, tone: 'lime' })
      for (const st of p.stages) {
        if (st.status === 'available') out.push({ id: `av-${p.id}-${st.n}`, icon: 'arrow-down-left', title: `Tahap ${st.n} siap dicairkan`, body: `${formatRupiah(st.amount)} untuk ${st.label.toLowerCase()}.`, ts: new Date().toISOString(), to: '/nelayan/dompet', tone: 'lime' })
        if (st.status === 'disbursed') out.push({ id: `rp-${p.id}-${st.n}`, icon: 'upload', title: `Kirim laporan progres tahap ${st.n}`, body: 'Tahap berikutnya terbuka setelah laporan diterima.', ts: st.disbursedAt ?? p.createdAt, to: base })
      }
      if (p.nextDue) out.push({ id: `due-${p.id}-${p.nextDue.date.slice(0, 10)}`, icon: 'calendar', title: `Jatuh tempo setoran ${formatDate(p.nextDue.date)}`, body: `${formatRupiah(p.nextDue.amount)} untuk ${p.title}.`, ts: new Date(new Date(p.nextDue.date).getTime() - 30 * 86_400_000).toISOString(), to: '/nelayan/dompet' })
    }
    for (const b of s.ledger.filter((x) => (x.type === 'pencairan' && x.to === me.name) || (x.type === 'setoran' && x.from === me.name)))
      out.push({ id: `lg-${b.hash}`, icon: b.type === 'pencairan' ? 'arrow-down-left' : 'arrow-up-right', title: b.type === 'pencairan' ? `Dana masuk ${formatRupiah(b.amount)}` : `Setoran ${formatRupiah(b.amount)} tercatat`, body: `${b.memo} · blok #${b.block}`, ts: b.ts, to: '/nelayan/dompet', tone: 'dark' })
  }

  if (role === 'investor') {
    const mine = new Set(s.investments.filter((i) => i.investorId === meId).map((i) => i.projectId))
    for (const p of s.projects.filter((x) => x.status === 'live' && x.reviewedAt && days(x.reviewedAt) < 30))
      out.push({ id: `new-${p.id}`, icon: 'plus', title: 'Proyek baru menggalang dana', body: `${p.title} · skor ${p.score.score} · ±${p.expectedReturnPct}%/thn`, ts: p.reviewedAt!, to: `/investor/proyek/${p.id}`, tone: 'lime' })
    for (const b of s.ledger.filter((x) => x.type === 'distribusi' && mine.has(x.projectId)))
      out.push({ id: `ds-${b.hash}`, icon: 'arrow-down-left', title: `Bagi hasil ${b.projectId} dibagikan`, body: `${b.memo} · blok #${b.block}`, ts: b.ts, to: '/investor/portofolio', tone: 'dark' })
    for (const i of s.investments.filter((x) => x.investorId === meId).slice(-5))
      out.push({ id: `iv-${i.id}`, icon: 'verified', title: `Investasi ${formatRupiah(i.amount)} tercatat`, body: `${i.projectId} · masuk escrow smart contract`, ts: i.createdAt, to: `/investor/proyek/${i.projectId}` })
    for (const e of s.securityEvents.filter((x) => x.userId === meId))
      out.push({ id: `se-${e.id}`, icon: e.outcome === 'diblokir' ? 'warning' : 'shield-check', title: e.title, body: `${e.detail} · ${e.outcome}`, ts: e.createdAt, to: '/investor/radar', tone: e.outcome === 'diblokir' ? 'coral' : 'dark' })
  }

  if (role === 'admin') {
    for (const p of s.projects.filter((x) => x.status === 'review'))
      out.push({ id: `q-${p.id}`, icon: 'clipboard-check', title: `Pengajuan baru ${p.id}`, body: `${p.title} · skor ${p.score.score}`, ts: p.createdAt, to: `/admin/tinjau/${p.id}`, tone: 'lime' })
    for (const a of s.alerts.filter((x) => x.status === 'open'))
      out.push({ id: `al-${a.id}`, icon: 'warning', title: `Radar: ${a.title}`, body: a.subject, ts: a.createdAt, to: '/admin/radar', tone: 'coral' })
    for (const b of s.ledger.slice(-6))
      out.push({ id: `bk-${b.hash}`, icon: 'link', title: `Blok #${b.block} · ${b.type}`, body: `${b.projectId} · ${formatRupiah(b.amount)}`, ts: b.ts, to: '/admin/ledger', tone: 'dark' })
  }

  return out.sort((a, b) => b.ts.localeCompare(a.ts))
}

export function useNotifs(role: Role) {
  const me = useMe()
  const state = useStore((s) => s)
  const list = useMemo(() => (me ? buildNotifs(state, me.id, role) : []), [state, me, role])
  const read = me ? (state.notifRead[me.id] ?? []) : []
  const unread = list.filter((n) => !read.includes(n.id)).length
  return { list, read, unread }
}

/** Lonceng di header: badge bila ada notifikasi belum dibaca. */
export function NotifBell({ role }: { role: Role }) {
  const nav = useNavigate()
  const { unread } = useNotifs(role)
  return (
    <span className="relative">
      <IconButton icon="bell" label={unread ? `Notifikasi, ${unread} belum dibaca` : 'Notifikasi'} onClick={() => nav(`/${role}/notifikasi`)} />
      {unread > 0 && (
        <span className="num pointer-events-none absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-sun-500 px-1 text-[11px] font-semibold text-white ring-2 ring-paper animate-[pop_.35s_var(--ease-out-soft)_both]">
          {unread > 9 ? '9+' : unread}
        </span>
      )}
    </span>
  )
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  if (diff < 0) return 'akan datang'
  const m = Math.round(diff / 60000)
  if (m < 60) return `${Math.max(1, m)} mnt lalu`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} jam lalu`
  const d = Math.round(h / 24)
  return d < 30 ? `${d} hari lalu` : formatDate(iso)
}

export function NotificationsPage({ role }: { role: Role }) {
  const nav = useNavigate()
  const { list, read } = useNotifs(role)
  const mark = useStore((s) => s.markNotifsRead)
  // Daftar "belum dibaca" dibekukan saat halaman dibuka supaya titiknya tetap terlihat.
  const unreadAtOpen = useMemo(() => new Set(list.filter((n) => !read.includes(n.id)).map((n) => n.id)), []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const t = setTimeout(() => mark(list.map((n) => n.id)), 600)
    return () => clearTimeout(t)
  }, [list, mark])

  const today = list.filter((n) => Date.now() - new Date(n.ts).getTime() < 86_400_000)
  const earlier = list.filter((n) => !today.includes(n))

  return (
    <div className="pb-8">
      <TopBar title="Notifikasi" subtitle={unreadAtOpen.size ? `${unreadAtOpen.size} belum dibaca` : 'Semua sudah dibaca'} onBack={() => nav(-1)} />
      <div className="flex flex-col gap-5 px-5">
        {list.length === 0 && <EmptyState icon="bell" title="Belum ada notifikasi" body="Kabar soal proyek, dana, dan keamanan akun akan muncul di sini." />}
        {[
          ['Terbaru', today],
          ['Sebelumnya', earlier],
        ].map(([label, items]) =>
          (items as Notif[]).length ? (
            <section key={label as string}>
              <h2 className="mb-2 text-sm font-semibold text-ink-muted">{label as string}</h2>
              <Panel className="px-2">
                {(items as Notif[]).map((n, i) => (
                  <Reveal key={n.id} i={i}>
                    <button onClick={() => n.to && nav(n.to)} className="press flex w-full items-start gap-3 rounded-[18px] px-2 py-3 text-left hover:bg-paper-sunk/60">
                      <span
                        className={cn(
                          'flex size-11 shrink-0 items-center justify-center rounded-full',
                          n.tone === 'lime' ? 'bg-sun-500 text-white' : n.tone === 'coral' ? 'bg-coral-100 text-coral-700' : 'bg-kelp-950 text-white',
                        )}
                      >
                        <Icon name={n.icon} size={20} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="min-w-0 flex-1 truncate text-[15px] font-semibold text-ink">{n.title}</span>
                          {unreadAtOpen.has(n.id) && <span className="size-2 shrink-0 rounded-full bg-sun-600" aria-label="belum dibaca" />}
                        </span>
                        <span className="mt-0.5 block text-2xs leading-snug text-ink-muted">{n.body}</span>
                        <span className="mt-1 block text-[11px] text-ink-faint">{timeAgo(n.ts)}</span>
                      </span>
                    </button>
                  </Reveal>
                ))}
              </Panel>
            </section>
          ) : null,
        )}
      </div>
    </div>
  )
}
