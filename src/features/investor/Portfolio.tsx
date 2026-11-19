import { useNavigate } from 'react-router'
import { BarChart, Card, EmptyState, ProgressBar } from '@/design'
import { investorReturns, useMe, useStore } from '@/data/store'
import { formatRupiah, formatRupiahShort, shortHash } from '@/lib/format'
import { PageHeader, StatusBadge } from '../shared'

export function Portfolio() {
  const me = useMe()!
  const nav = useNavigate()
  const state = useStore((s) => s)
  const mine = state.investments.filter((i) => i.investorId === me.id)
  const byProject = [...new Set(mine.map((i) => i.projectId))].map((pid) => ({
    p: state.projects.find((x) => x.id === pid)!,
    amount: mine.filter((i) => i.projectId === pid).reduce((a, i) => a + i.amount, 0),
    last: mine.filter((i) => i.projectId === pid).at(-1)!,
  }))
  const total = mine.reduce((a, i) => a + i.amount, 0)
  const returns = investorReturns(state, me.id)

  // Investasi per bulan, 6 bulan terakhir
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setDate(1)
    d.setMonth(d.getMonth() - (5 - i))
    return d
  })
  const bars = months.map((d) => ({
    label: d.toLocaleDateString('id-ID', { month: 'short' }).replace('.', ''),
    value: mine.filter((i) => {
      const t = new Date(i.createdAt)
      return t.getMonth() === d.getMonth() && t.getFullYear() === d.getFullYear()
    }).reduce((a, i) => a + i.amount, 0),
  }))

  return (
    <div className="pb-8">
      <PageHeader title="Portofolio" />
      <div className="flex flex-col gap-4 px-5 pt-3">
        <Card className="p-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-ink-muted">Total modal tersalur</p>
              <p className="num text-2xl font-extrabold">{formatRupiah(total)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-ink-muted">Bagi hasil</p>
              <p className="num text-lg font-bold text-kelp-700">+{formatRupiahShort(returns)}</p>
            </div>
          </div>
          <div className="mt-5">
            <BarChart data={bars} highlight={5} height={96} format={formatRupiah} />
          </div>
        </Card>

        {byProject.length === 0 && <EmptyState icon="chart-bar" title="Belum ada investasi" body="Mulai dari Rp50.000 di proyek pilihan Anda." />}

        {byProject.map(({ p, amount, last }) => (
          <button key={p.id} onClick={() => nav(`/investor/proyek/${p.id}`)} className="rounded-md border border-line bg-surface p-4 text-left transition-colors hover:border-kelp-300">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="num text-2xs font-semibold text-ink-muted">{p.id}</span>
              <StatusBadge status={p.status} />
            </div>
            <p className="font-bold">{p.title}</p>
            <p className="num mt-1 text-sm">
              Modal Anda <b>{formatRupiah(amount)}</b> · porsi {((amount / p.target) * 100).toFixed(1).replace('.', ',')}%
            </p>
            <div className="mt-3">
              <ProgressBar value={(p.raised / p.target) * 100} tone="kelp" />
            </div>
            {last.hash && <p className="mt-2 font-mono text-2xs text-tide-600">bukti: {shortHash(last.hash, 8, 6)}</p>}
          </button>
        ))}
      </div>
    </div>
  )
}
