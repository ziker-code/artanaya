import { useShallow } from 'zustand/react/shallow'
import { Badge, Card, Gauge, Icon } from '@/design'
import { useMe, useStore } from '@/data/store'
import { formatDate } from '@/lib/format'
import { toast } from '@/app/toast'
import { Toggle } from '../nelayan/SubmitProject'
import { PageHeader } from '../shared'

const OUTCOME = {
  aman: { tone: 'kelp', label: 'Aman' },
  diblokir: { tone: 'coral', label: 'Diblokir' },
  ditinjau: { tone: 'sun', label: 'Ditinjau' },
} as const

export function SecurityRadar() {
  const me = useMe()!
  const events = useStore(useShallow((s) => s.securityEvents.filter((e) => e.userId === me.id)))
  const locked = useStore((s) => s.selfLocked)
  const setLock = useStore((s) => s.setSelfLock)
  const blocked = events.filter((e) => e.outcome === 'diblokir').length
  const score = Math.min(98, 80 + blocked * 3 + (locked ? 6 : 0))

  return (
    <div className="pb-8">
      <PageHeader eyebrow="AI cyber threat detection" title="Radar Ancaman" />
      <div className="flex flex-col gap-4 px-5 pt-3">
        <Card className="flex flex-col items-center p-6">
          <Gauge value={score} label="Skor keamanan akun" caption={`${blocked} ancaman diblokir otomatis`} />
        </Card>

        <div className={`flex gap-3 rounded-md p-4 text-sm ${locked ? 'bg-sun-100 text-[#5c3f0a]' : 'bg-kelp-100 text-kelp-700'}`}>
          <Icon name={locked ? 'lock' : 'shield-check'} size={24} className="shrink-0" />
          <div>
            <p className="font-bold">{locked ? 'Kunci mandiri aktif' : 'Semua transaksi aman'}</p>
            <p>{locked ? 'Semua transfer keluar ditahan sampai Anda membuka kunci.' : 'Tidak ada aktivitas mencurigakan yang tertunda.'}</p>
          </div>
        </div>

        <Toggle
          checked={locked}
          onChange={(v) => {
            setLock(v)
            toast.ok(v ? 'Akun dikunci. Transfer ditahan.' : 'Kunci dibuka.')
          }}
          title="Kunci mandiri (self-lock)"
          desc="Aktifkan bila HP hilang atau curiga ada yang mengakses akun"
        />

        <section className="mt-2">
          <h2 className="mb-2 text-lg font-bold">Aktivitas terpantau AI</h2>
          <Card className="divide-y divide-line px-4">
            {events.map((e) => (
              <div key={e.id} className="flex items-start gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold">{e.title}</p>
                  <p className="text-sm text-ink-muted">
                    {e.detail} · {formatDate(e.createdAt)}
                  </p>
                </div>
                <Badge tone={OUTCOME[e.outcome].tone}>{OUTCOME[e.outcome].label}</Badge>
              </div>
            ))}
          </Card>
        </section>
      </div>
    </div>
  )
}
