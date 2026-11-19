import { useShallow } from 'zustand/react/shallow'
import { useNavigate } from 'react-router'
import { Badge, Button, Card, Divider, HeroCard, Icon, IconButton, Notice, ProgressBar, SectionHeader, TxRow, type IconName } from '@/design'
import { useMe, useStore, walletOf } from '@/data/store'
import { formatDate, formatRupiah } from '@/lib/format'
import { EmptyState } from '@/design'
import { TYPE_ICON } from '../shared'

function Insight({ volumes }: { volumes: number[] | null }) {
  if (!volumes || volumes.length < 2) return null
  const avg = volumes.reduce((a, b) => a + b, 0) / volumes.length
  const diff = Math.round(((volumes.at(-1)! - avg) / avg) * 100)
  if (Math.abs(diff) < 3) return null
  return (
    <p className="mt-8 text-center font-serif text-lg italic leading-snug text-kelp-700">
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
  const nav = useNavigate()
  const projects = useStore(useShallow((s) => s.projects.filter((p) => p.ownerId === me.id)))
  const ledger = useStore((s) => s.ledger)
  const active = projects.find((p) => p.status === 'running') ?? projects.find((p) => p.status === 'live')
  const pending = projects.find((p) => p.status === 'review' || p.status === 'coaching')
  const wallet = walletOf(ledger, me.name)
  const avail = active?.stages.find((s) => s.status === 'available')
  const needReport = active?.stages.find((s) => s.status === 'disbursed')

  const quick: [IconName, string, () => void][] = [
    ['plus', 'Ajukan Proyek', () => nav('/nelayan/ajukan')],
    ['wallet', 'Dompetku', () => nav('/nelayan/dompet')],
    ['upload', 'Lapor Progres', () => nav(active ? `/nelayan/proyek/${active.id}` : '/nelayan/proyek')],
  ]

  return (
    <div className="px-5 pb-8 pt-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex-1">
          <p className="text-sm text-ink-muted">{greeting()}</p>
          <p className="text-[22px] font-bold leading-tight">Pak {me.name.split(' ')[0]}</p>
        </div>
        <IconButton icon="bell" label="Notifikasi" tone="soft" badge={!!active?.nextDue} />
      </div>

      {active ? (
        <button className="block w-full text-left" onClick={() => nav(`/nelayan/proyek/${active.id}`)}>
          <HeroCard>
            <div className="mb-4 flex items-center justify-between">
              <Badge tone="onDark" icon={TYPE_ICON[active.type]}>
                {active.status === 'running' ? 'Proyek berjalan' : 'Menggalang dana'}
              </Badge>
              <span className="num text-2xs text-kelp-300">{active.id}</span>
            </div>
            <p className="text-lg font-semibold leading-snug">{active.title}</p>
            <p className="mb-4 text-sm text-kelp-300">{active.location}</p>
            <div className="mb-2 flex items-baseline justify-between">
              <span className="num text-[28px] font-extrabold tracking-tight">{formatRupiah(active.raised)}</span>
              <span className="num text-sm font-semibold text-sun-300">{Math.round((active.raised / active.target) * 100)}%</span>
            </div>
            <ProgressBar value={(active.raised / active.target) * 100} onDark />
            <p className="mt-2 text-2xs text-kelp-300">
              terkumpul dari target {formatRupiah(active.target)} · skor {active.score.score}
            </p>
          </HeroCard>
        </button>
      ) : (
        <EmptyState icon="folder" title="Belum ada proyek aktif" body="Ajukan proyek pertama, prosesnya sekitar 10 menit." action={<Button size="sm" icon="plus" onClick={() => nav('/nelayan/ajukan')}>Ajukan Proyek</Button>} />
      )}

      <div className="mt-4 grid grid-cols-3 gap-2">
        {quick.map(([icon, label, go]) => (
          <button key={label} onClick={go} className="flex flex-col items-center gap-2 rounded-md border border-line bg-surface px-2 py-4 transition-colors hover:bg-paper-sunk">
            <span className="flex size-10 items-center justify-center rounded-full bg-kelp-100 text-kelp-700">
              <Icon name={icon} size={20} />
            </span>
            <span className="text-2xs font-semibold leading-tight">{label}</span>
          </button>
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
        <SectionHeader title="Dompetku" action={<Button size="sm" variant="quiet" iconRight="caret-right" onClick={() => nav('/nelayan/dompet')}>Semua</Button>} />
        <Card className="px-4">
          {wallet.txs.slice(0, 3).map((t, i) => (
            <div key={t.hash}>
              {i > 0 && <Divider />}
              <TxRow title={t.memo.replace(/ — .*/, '')} date={formatDate(t.ts)} amount={t.amount} direction={t.type === 'pencairan' ? 'in' : 'out'} hash={t.hash} />
            </div>
          ))}
          {wallet.txs.length === 0 && <p className="py-4 text-sm text-ink-muted">Belum ada transaksi.</p>}
        </Card>
      </div>

      {active && <Insight volumes={active.signals.volumes} />}
    </div>
  )
}
