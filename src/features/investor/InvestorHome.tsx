import { useMoney } from '../profile/Profile'
import { NotifBell } from '../notifications'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Badge, Card, ChipRow, CountUp, HeroCard, Icon, QuickAction, Reveal, SectionHeader } from '@/design'
import { investorReturns, useMe, useStore } from '@/data/store'
import { BUSINESS_LABEL, type BusinessType } from '@/lib/scoring.config'
import { formatRupiah, formatRupiahShort } from '@/lib/format'
import { Avatar, ProjectCard } from '../shared'

const FILTERS = ['Semua', ...Object.values(BUSINESS_LABEL)]

export function InvestorHome() {
  const me = useMe()!
  const money = useMoney()
  const nav = useNavigate()
  const [filter, setFilter] = useState('Semua')
  const [q, setQ] = useState('')
  const state = useStore((s) => s)
  const mine = state.investments.filter((i) => i.investorId === me.id)
  const total = mine.reduce((a, i) => a + i.amount, 0)
  const projectsFunded = new Set(mine.map((i) => i.projectId)).size
  const returns = investorReturns(state, me.id)
  const typeKey = (Object.keys(BUSINESS_LABEL) as BusinessType[]).find((k) => BUSINESS_LABEL[k] === filter)
  const live = state.projects
    .filter((p) => p.status === 'live')
    .filter((p) => !typeKey || p.type === typeKey)
    .filter((p) => !q || `${p.title} ${p.location}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => b.score.score - a.score.score)
  const openThreats = state.securityEvents.filter((e) => e.userId === me.id && e.outcome === 'diblokir').length

  return (
    <div className="px-5 pb-8 pt-6">
      <div className="mb-5 flex items-center gap-3 animate-[rise_.4s_var(--ease-out-soft)_both]">
        <Avatar initials={me.initials} photo={me.photo} />
        <div className="min-w-0 flex-1">
          <p className="text-2xs text-ink-muted">{me.name}</p>
          <p className="truncate text-[19px] font-semibold leading-tight">Selamat datang 👋</p>
        </div>
        <NotifBell role="investor" />
      </div>

      <HeroCard side={<Icon name="shield-check" size={24} />}>
        <div className="mb-5 flex items-center justify-between">
          <span className="text-[15px] font-semibold tracking-wide">ARTANAYA</span>
          <Badge tone="onDark">{projectsFunded} proyek</Badge>
        </div>
        <p className="text-2xs text-kelp-300">Total investasi maritim</p>
        <p className="num text-[30px] font-semibold leading-tight tracking-tight">
          <CountUp value={total} format={money(formatRupiah)} />
        </p>
        <div className="mt-4 flex items-end justify-between text-2xs">
          <span className="text-white/85">Bagi hasil diterima</span>
          <span className="num font-semibold text-sun-300">+{formatRupiahShort(returns)}</span>
        </div>
      </HeroCard>

      <div className="mt-6 flex justify-between px-1">
        {(
          [
            ['chart-bar', 'Portofolio', '/investor/portofolio'],
            ['shield-check', 'Radar', '/investor/radar'],
            ['chats', 'Komunitas', '/investor/komunitas'],
            ['more', 'Profil', '/investor/profil'],
          ] as const
        ).map(([icon, label, to], i) => (
          <Reveal key={label} i={i + 1}>
            <QuickAction icon={icon} label={label} onClick={() => nav(to)} accent={i === 3} />
          </Reveal>
        ))}
      </div>

      <button onClick={() => nav('/investor/radar')} className="press mt-5 flex w-full items-center gap-3 rounded-md bg-surface p-3.5 text-left">
        <span className="flex size-10 items-center justify-center rounded-full bg-kelp-950 text-sun-500">
          <Icon name="shield-check" size={20} />
        </span>
        <span className="flex-1 text-sm">
          <b className="font-semibold">Akun terlindungi</b>
          <span className="block text-2xs text-ink-muted">{openThreats} ancaman diblokir otomatis bulan ini</span>
        </span>
        <Icon name="caret-right" size={18} className="text-ink-faint" />
      </button>

      <section className="mt-6">
        <SectionHeader title="Proyek menggalang dana" />
        <label className="mb-3 flex h-13 items-center gap-2.5 rounded-full bg-white px-5 focus-within:ring-2 focus-within:ring-kelp-950">
          <Icon name="search" className="text-ink-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari proyek atau lokasi" className="w-full bg-transparent outline-none placeholder:text-ink-faint" aria-label="Cari proyek" />
        </label>
        <ChipRow options={FILTERS} value={filter} onChange={setFilter} />
        <div className="mt-4 flex flex-col gap-3">
          {live.map((p, i) => (
            <Reveal key={p.id} i={i}>
              <ProjectCard p={p} onOpen={() => nav(`/investor/proyek/${p.id}`)} />
            </Reveal>
          ))}
          {live.length === 0 && (
            <Card className="p-6 text-center text-sm text-ink-muted">Tidak ada proyek yang cocok dengan filter ini.</Card>
          )}
        </div>
      </section>
    </div>
  )
}
