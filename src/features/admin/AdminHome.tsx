import { useNavigate } from 'react-router'
import { Badge, CountUp, Divider, HeroCard, Icon, IconButton, ListRow, Panel, QuickAction, Reveal, SectionHeader } from '@/design'
import { useStore } from '@/data/store'
import { formatDate, formatRupiah, formatRupiahShort, shortHash } from '@/lib/format'
import { Avatar } from '../shared'

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
      <div className="mb-5 flex items-center gap-3 animate-[rise_.4s_var(--ease-out-soft)_both]">
        <Avatar initials="AU" />
        <div className="min-w-0 flex-1">
          <p className="text-2xs text-ink-muted">Portal pengelola</p>
          <p className="truncate text-[19px] font-semibold leading-tight">Admin Utama</p>
        </div>
        <IconButton icon="bell" label="Notifikasi" badge={openAlerts > 0} />
      </div>

      <HeroCard side={<Icon name="link" size={24} />}>
        <div className="mb-5 flex items-center justify-between">
          <span className="text-[15px] font-semibold tracking-wide">ARTANAYA</span>
          <Badge tone="onDark" icon="shield-check">Sistem normal</Badge>
        </div>
        <p className="text-2xs text-kelp-300">Total dana kelolaan</p>
        <p className="num text-[30px] font-semibold leading-tight tracking-tight">
          <CountUp value={managed} format={formatRupiah} />
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-2xs">
          <Stat label="Proyek aktif" value={active} />
          <Stat label="Blok ledger" value={ledger.length} />
          <Stat label="Peringatan" value={openAlerts} warn={openAlerts > 0} />
        </div>
      </HeroCard>

      <div className="mt-6 flex justify-between px-1">
        {(
          [
            ['clipboard-check', 'Tinjau', '/admin/tinjau'],
            ['link', 'Ledger', '/admin/ledger'],
            ['radar', 'Radar AI', '/admin/radar'],
            ['more', 'Profil', '/admin/profil'],
          ] as const
        ).map(([icon, label, to], i) => (
          <Reveal key={label} i={i + 1}>
            <QuickAction icon={icon} label={label} onClick={() => nav(to)} accent={i === 3} />
          </Reveal>
        ))}
      </div>

      <section className="mt-6">
        <SectionHeader title="Tugas hari ini" />
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => nav('/admin/tinjau')} className="press rounded-md bg-surface p-4 text-left hover:shadow-soft">
            <span className="flex size-11 items-center justify-center rounded-full bg-sun-500 text-kelp-950">
              <Icon name="clipboard-check" size={20} />
            </span>
            <p className="num mt-3 text-2xl font-semibold">{queue}</p>
            <p className="text-sm text-ink-muted">pengajuan menunggu</p>
          </button>
          <button onClick={() => nav('/admin/radar')} className="press rounded-md bg-surface p-4 text-left hover:shadow-soft">
            <span className="flex size-11 items-center justify-center rounded-full bg-kelp-950 text-white">
              <Icon name="radar" size={20} />
            </span>
            <p className="num mt-3 text-2xl font-semibold">{openAlerts}</p>
            <p className="text-sm text-ink-muted">peringatan radar</p>
          </button>
        </div>
      </section>

      <section className="mt-6">
        <SectionHeader title="Log sistem terbaru" />
        <Panel>
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
        </Panel>
        <button onClick={() => nav('/admin/ledger')} className="mt-2 text-sm font-semibold text-kelp-700">
          Buka Ledger lengkap →
        </button>
      </section>

    </div>
  )
}

function Stat({ label, value, warn }: { label: string; value: number; warn?: boolean }) {
  return (
    <div>
      <p className={`num text-lg font-semibold ${warn ? 'text-sun-300' : ''}`}>{value}</p>
      <p className="text-2xs text-kelp-300">{label}</p>
    </div>
  )
}
