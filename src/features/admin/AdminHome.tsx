import { useNavigate } from 'react-router'
import { Badge, Card, Divider, HeroCard, Icon, IconButton, ListRow, SectionHeader } from '@/design'
import { useStore } from '@/data/store'
import { formatDate, formatRupiahShort, shortHash } from '@/lib/format'

const TYPE_LABEL = { investasi: 'Investasi masuk', pencairan: 'Pencairan', setoran: 'Setoran bagi hasil', distribusi: 'Distribusi bagi hasil' } as const

export function AdminHome() {
  const nav = useNavigate()
  const projects = useStore((s) => s.projects)
  const ledger = useStore((s) => s.ledger)
  const alerts = useStore((s) => s.alerts)
  const managed = projects.filter((p) => p.status === 'live' || p.status === 'running').reduce((a, p) => a + p.raised, 0)
  const active = projects.filter((p) => p.status === 'live' || p.status === 'running').length
  const queue = projects.filter((p) => p.status === 'review').length
  const openAlerts = alerts.filter((a) => a.status === 'open').length
  const recent = [...ledger].reverse().slice(0, 4)

  return (
    <div className="px-5 pb-8 pt-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex-1">
          <p className="text-sm text-ink-muted">Portal pengelola</p>
          <p className="text-[22px] font-bold leading-tight">Admin Utama</p>
        </div>
        <IconButton icon="bell" label="Notifikasi" tone="soft" badge={openAlerts > 0} />
      </div>

      <HeroCard>
        <p className="text-sm text-kelp-300">Total dana kelolaan</p>
        <p className="num mt-1 text-[34px] font-extrabold tracking-tight">{formatRupiahShort(managed)}</p>
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
          <Stat label="Proyek aktif" value={active} />
          <Stat label="Blok ledger" value={ledger.length} />
          <Stat label="Peringatan" value={openAlerts} warn={openAlerts > 0} />
        </div>
      </HeroCard>

      <section className="mt-6">
        <SectionHeader title="Tugas hari ini" />
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => nav('/admin/tinjau')} className="rounded-md border border-line bg-surface p-4 text-left transition-colors hover:border-kelp-300">
            <span className="flex size-10 items-center justify-center rounded-full bg-sun-100 text-sun-600">
              <Icon name="clipboard-check" size={20} />
            </span>
            <p className="num mt-3 text-2xl font-extrabold">{queue}</p>
            <p className="text-sm text-ink-muted">pengajuan menunggu</p>
          </button>
          <button onClick={() => nav('/admin/radar')} className="rounded-md border border-line bg-surface p-4 text-left transition-colors hover:border-kelp-300">
            <span className="flex size-10 items-center justify-center rounded-full bg-coral-100 text-coral-700">
              <Icon name="radar" size={20} />
            </span>
            <p className="num mt-3 text-2xl font-extrabold">{openAlerts}</p>
            <p className="text-sm text-ink-muted">peringatan radar</p>
          </button>
        </div>
      </section>

      <section className="mt-6">
        <SectionHeader title="Log sistem terbaru" />
        <Card className="px-4">
          {recent.map((b, i) => (
            <div key={b.hash}>
              {i > 0 && <Divider />}
              <ListRow
                icon={b.type === 'investasi' || b.type === 'setoran' ? 'arrow-down-left' : 'arrow-up-right'}
                iconTone={b.type === 'pencairan' ? 'sun' : 'kelp'}
                title={`${TYPE_LABEL[b.type]} · ${b.projectId}`}
                subtitle={`#${b.block} · ${shortHash(b.hash)} · ${formatDate(b.ts)}`}
                trailing={<span className="num text-sm font-bold">{formatRupiahShort(b.amount)}</span>}
              />
            </div>
          ))}
        </Card>
        <button onClick={() => nav('/admin/ledger')} className="mt-2 text-sm font-semibold text-kelp-700">
          Buka Ledger lengkap →
        </button>
      </section>

      <div className="mt-6 flex items-center gap-2">
        <Badge tone="kelp" icon="shield-check">
          Sistem normal
        </Badge>
        <span className="text-2xs text-ink-muted">sinkron otomatis antar-tab</span>
      </div>
    </div>
  )
}

function Stat({ label, value, warn }: { label: string; value: number; warn?: boolean }) {
  return (
    <div>
      <p className={`num text-xl font-bold ${warn ? 'text-sun-300' : ''}`}>{value}</p>
      <p className="text-2xs text-kelp-300">{label}</p>
    </div>
  )
}
