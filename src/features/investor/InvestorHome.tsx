import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Card, ChipRow, HeroCard, Icon, IconButton, SectionHeader } from '@/design'
import { investorReturns, useMe, useStore } from '@/data/store'
import { BUSINESS_LABEL, type BusinessType } from '@/lib/scoring.config'
import { formatRupiah, formatRupiahShort } from '@/lib/format'
import { ProjectCard } from '../shared'

const FILTERS = ['Semua', ...Object.values(BUSINESS_LABEL)]

export function InvestorHome() {
  const me = useMe()!
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
      <div className="mb-5 flex items-center gap-3">
        <div className="flex-1">
          <p className="text-sm text-ink-muted">Halo,</p>
          <p className="text-[22px] font-bold leading-tight">{me.name}</p>
        </div>
        <IconButton icon="bell" label="Notifikasi" tone="soft" />
      </div>

      <HeroCard>
        <p className="text-sm text-kelp-300">Total investasi maritim</p>
        <p className="num mt-1 text-[32px] font-extrabold tracking-tight">{formatRupiah(total)}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
          <div>
            <p className="num text-lg font-bold text-sun-300">+{formatRupiahShort(returns)}</p>
            <p className="text-2xs text-kelp-300">bagi hasil diterima</p>
          </div>
          <div>
            <p className="num text-lg font-bold">{projectsFunded}</p>
            <p className="text-2xs text-kelp-300">proyek didanai</p>
          </div>
        </div>
      </HeroCard>

      <button onClick={() => nav('/investor/radar')} className="mt-3 flex w-full items-center gap-3 rounded-md border border-line bg-surface p-3.5 text-left transition-colors hover:bg-paper-sunk">
        <span className="flex size-9 items-center justify-center rounded-full bg-kelp-100 text-kelp-700">
          <Icon name="shield-check" size={20} />
        </span>
        <span className="flex-1 text-sm">
          <b>Akun terlindungi</b>
          <span className="block text-ink-muted">{openThreats} ancaman diblokir otomatis bulan ini</span>
        </span>
        <Icon name="caret-right" className="text-ink-faint" />
      </button>

      <section className="mt-6">
        <SectionHeader title="Proyek menggalang dana" />
        <label className="mb-3 flex h-12 items-center gap-2.5 rounded-sm bg-paper-sunk px-3.5 focus-within:bg-surface focus-within:ring-1 focus-within:ring-kelp-700">
          <Icon name="search" className="text-ink-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari proyek atau lokasi" className="w-full bg-transparent outline-none placeholder:text-ink-faint" aria-label="Cari proyek" />
        </label>
        <ChipRow options={FILTERS} value={filter} onChange={setFilter} />
        <div className="mt-4 flex flex-col gap-3">
          {live.map((p) => (
            <ProjectCard key={p.id} p={p} onOpen={() => nav(`/investor/proyek/${p.id}`)} />
          ))}
          {live.length === 0 && (
            <Card className="p-6 text-center text-sm text-ink-muted">Tidak ada proyek yang cocok dengan filter ini.</Card>
          )}
        </div>
      </section>
    </div>
  )
}
