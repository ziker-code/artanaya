import { useMoney } from '../profile/Profile'
import { NotifBell } from '../notifications'
import { useShallow } from 'zustand/react/shallow'
import { useNavigate } from 'react-router'
import { Badge, Button, CountUp, Divider, HeroCard, Icon, Notice, Panel, ProgressBar, QuickAction, Reveal, SectionHeader, TxRow, type IconName } from '@/design'
import { useMe, useStore, walletOf } from '@/data/store'
import { formatDate, formatRupiah } from '@/lib/format'
import { EmptyState } from '@/design'
import { Avatar, TYPE_ICON } from '../shared'

function Insight({ volumes }: { volumes: number[] | null }) {
  if (!volumes || volumes.length < 2) return null
  const avg = volumes.reduce((a, b) => a + b, 0) / volumes.length
  const diff = Math.round(((volumes.at(-1)! - avg) / avg) * 100)
  if (Math.abs(diff) < 3) return null
  return (
    <p className="mt-6 rounded-md bg-kelp-950 px-5 py-4 text-center text-sm leading-snug text-sun-300">
      “Hasil bulan lalu {Math.abs(diff)}% {diff > 0 ? 'di atas' : 'di bawah'} rata-rata 6 bulan Bapak.”
    </p>
  )
}

function greeting() {
  const h = new Date().getHours()
  if (h < 11) return 'Selamat pagi,'
  if (h < 15) return 'Selamat siang,'
  if (h < 19) return 'Selamat sore,'
  return 'Selamat malam,'
}

export function NelayanHome() {
  const me = useMe()!
  const money = useMoney()
  const nav = useNavigate()
  const projects = useStore(useShallow((s) => s.projects.filter((p) => p.ownerId === me.id)))
  const ledger = useStore((s) => s.ledger)
  const active = projects.find((p) => p.status === 'running') ?? projects.find((p) => p.status === 'live')
  const pending = projects.find((p) => p.status === 'review' || p.status === 'coaching')
  const wallet = walletOf(ledger, me.name)
  const avail = active?.stages.find((s) => s.status === 'available')
  const needReport = active?.stages.find((s) => s.status === 'disbursed')

  const quick: [IconName, string, () => void, boolean?][] = [
    ['plus', 'Ajukan', () => nav('/nelayan/ajukan')],
    ['wallet', 'Dompet', () => nav('/nelayan/dompet')],
    ['upload', 'Lapor', () => nav(active ? `/nelayan/proyek/${active.id}` : '/nelayan/proyek')],
    ['more', 'Bantuan', () => nav('/nelayan/bantuan'), true],
  ]

  return (
    <div className="px-5 pb-8 pt-6">
      <div className="mb-5 flex items-center gap-3 animate-[rise_.4s_var(--ease-out-soft)_both]">
        <Avatar initials={me.initials} photo={me.photo} />
        <div className="min-w-0 flex-1">
          <p className="text-2xs text-ink-muted">{greeting()}</p>
          <p className="truncate text-[19px] font-semibold leading-tight">Pak {me.name.split(' ')[0]} 👋</p>
        </div>
        <NotifBell role="nelayan" />
      </div>

      {active ? (
        <button className="press block w-full text-left" onClick={() => nav(`/nelayan/proyek/${active.id}`)}>
          <HeroCard side={<Icon name="caret-right" size={24} />}>
            <div className="mb-5 flex items-center justify-between gap-2">
              <span className="text-[15px] font-semibold tracking-wide">{active.id}</span>
              <Badge tone="onDark" icon={TYPE_ICON[active.type]}>
                {active.status === 'running' ? 'Berjalan' : 'Menggalang'}
              </Badge>
            </div>
            <p className="text-2xs text-kelp-300">Dana terkumpul</p>
            <p className="num text-[30px] font-semibold leading-tight tracking-tight">
              <CountUp value={active.raised} format={money(formatRupiah)} />
            </p>
            <div className="mt-3">
              <ProgressBar value={(active.raised / active.target) * 100} onDark />
            </div>
            <div className="mt-3 flex items-end justify-between gap-2 text-2xs">
              <span className="min-w-0 truncate text-white/85">{active.title}</span>
              <span className="num shrink-0 text-kelp-300">skor {active.score.score}</span>
            </div>
          </HeroCard>
        </button>
      ) : (
        <EmptyState icon="folder" title="Belum ada proyek aktif" body="Ajukan proyek pertama, prosesnya sekitar 10 menit." action={<Button size="sm" icon="plus" onClick={() => nav('/nelayan/ajukan')}>Ajukan Proyek</Button>} />
      )}

      <div className="mt-6 flex justify-between px-1">
        {quick.map(([icon, label, go, accent], i) => (
          <Reveal key={label} i={i + 1}>
            <QuickAction icon={icon} label={label} onClick={go} accent={accent} />
          </Reveal>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {avail && (
          <Notice tone="tide" icon="arrow-down-left" title={`Tahap ${avail.n} siap dicairkan`}>
            {formatRupiah(avail.amount)} untuk {avail.label.toLowerCase()}. Buka Dompetku untuk mengajukan.
          </Notice>
        )}
        {needReport && !avail && (
          <Notice tone="sun" icon="upload" title={`Kirim laporan progres tahap ${needReport.n}`}>
            Tahap {needReport.n + 1} terbuka setelah laporan diterima.
          </Notice>
        )}
        {active?.nextDue && (
          <Notice title={`Setor bagi hasil ${formatDate(active.nextDue.date)}`}>
            {formatRupiah(active.nextDue.amount)} · nisbah {Math.round(active.investorShare * 100)}% untuk investor
          </Notice>
        )}
        {pending && (
          <Notice tone={pending.status === 'coaching' ? 'coral' : 'sun'} icon="clipboard-check" title={pending.status === 'coaching' ? `${pending.title}: perlu pembinaan` : `${pending.title} sedang diverifikasi`}>
            {pending.status === 'coaching' ? `Fasilitator ${me.facilitator?.name} akan menghubungi Bapak.` : `Skor awal ${pending.score.score}. Admin memeriksa berkas Bapak.`}
          </Notice>
        )}
      </div>

      <div className="mt-6">
        <SectionHeader title="Aktivitas Terbaru" action={<Button size="sm" variant="quiet" iconRight="caret-right" onClick={() => nav('/nelayan/dompet')}>Semua</Button>} />
        <Panel>
          {wallet.txs.slice(0, 3).map((t, i) => (
            <div key={t.hash}>
              {i > 0 && <Divider />}
              <TxRow title={t.memo.replace(/ — .*/, '')} date={formatDate(t.ts)} amount={t.amount} direction={t.type === 'pencairan' ? 'in' : 'out'} hash={t.hash} />
            </div>
          ))}
          {wallet.txs.length === 0 && <p className="py-4 text-sm text-ink-muted">Belum ada transaksi.</p>}
        </Panel>
      </div>

      {active && <Insight volumes={active.signals.volumes} />}
    </div>
  )
}
