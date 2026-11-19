import { useState } from 'react'
import { Badge, BottomSheet, Button, Card, EmptyState, Icon, type IconName } from '@/design'
import { useStore } from '@/data/store'
import type { AlertKind, FraudAlert } from '@/data/types'
import { cn } from '@/lib/cn'
import { toast } from '@/app/toast'
import { PageHeader } from '../shared'

const KIND: Record<AlertKind, { label: string; icon: IconName }> = {
  geofence: { label: 'Geofencing', icon: 'map-pin' },
  liveness: { label: 'Biometrik', icon: 'scan-face' },
  device: { label: 'Perangkat', icon: 'identification-card' },
  velocity: { label: 'Pola transaksi', icon: 'chart-bar' },
}

const SEV = {
  tinggi: { strip: 'bg-coral-600', tone: 'coral' },
  sedang: { strip: 'bg-sun-500', tone: 'sun' },
  rendah: { strip: 'bg-tide-600', tone: 'tide' },
} as const

const ACTIONS = ['Bekukan akun sementara', 'Minta verifikasi wajah ulang', 'Hubungi lewat fasilitator']

function timeAgo(iso: string) {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (m < 60) return `${Math.max(1, m)} menit lalu`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} jam lalu`
  return `${Math.round(h / 24)} hari lalu`
}

export function FraudRadar() {
  const alerts = useStore((s) => s.alerts)
  const resolve = useStore((s) => s.resolveAlert)
  const [target, setTarget] = useState<FraudAlert | null>(null)
  const open = alerts.filter((a) => a.status === 'open')
  const done = alerts.filter((a) => a.status !== 'open')

  return (
    <div className="pb-8">
      <PageHeader eyebrow="Proactive AI threat detection" title="Radar Penipuan" />
      <div className="flex flex-col gap-4 px-5 pt-2">
        <div className="grid grid-cols-3 gap-2">
          {(['tinggi', 'sedang', 'rendah'] as const).map((s) => (
            <Card key={s} className="p-3">
              <span className={cn('block h-1 w-6 rounded-full', SEV[s].strip)} />
              <p className="num mt-2 text-xl font-semibold">{open.filter((a) => a.severity === s).length}</p>
              <p className="text-2xs capitalize text-ink-muted">{s}</p>
            </Card>
          ))}
        </div>

        {open.length === 0 && <EmptyState icon="shield-check" title="Tidak ada peringatan aktif" body="Radar terus memantau login, biometrik, dan pola transaksi." />}

        {open.map((a) => (
          <Card key={a.id} className="relative overflow-hidden p-4 pl-5">
            <span className={cn('absolute inset-y-0 left-0 w-1', SEV[a.severity].strip)} />
            <div className="mb-2 flex items-center gap-2">
              <Badge tone={SEV[a.severity].tone} icon={KIND[a.kind].icon}>
                {KIND[a.kind].label}
              </Badge>
              <span className="ml-auto text-2xs text-ink-muted">{timeAgo(a.createdAt)}</span>
            </div>
            <p className="font-bold">{a.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">{a.detail}</p>
            <p className="mt-2 text-2xs font-semibold text-ink">{a.subject}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button size="sm" variant="secondary" onClick={() => setTarget(a)}>
                Tindak Lanjuti
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  resolve(a.id, 'dismissed', 'Diabaikan: aktivitas wajar setelah dicek admin')
                  toast.ok('Peringatan ditandai aman')
                }}
              >
                Abaikan
              </Button>
            </div>
          </Card>
        ))}

        {done.length > 0 && (
          <section className="mt-2">
            <h2 className="mb-2 text-sm font-semibold text-ink-muted">Sudah ditangani</h2>
            <Card className="divide-y divide-line px-4">
              {done.map((a) => (
                <div key={a.id} className="flex items-start gap-3 py-3">
                  <Icon name={a.status === 'actioned' ? 'check' : 'close'} className="mt-0.5 text-ink-muted" />
                  <div className="min-w-0 text-sm">
                    <p className="font-semibold">{a.title}</p>
                    <p className="text-2xs text-ink-muted">{a.resolution}</p>
                  </div>
                </div>
              ))}
            </Card>
          </section>
        )}
      </div>

      <BottomSheet open={!!target} onOpenChange={(v) => !v && setTarget(null)} title="Tindak lanjut" description={target?.subject}>
        <div className="flex flex-col gap-2">
          {ACTIONS.map((label) => (
            <Button
              key={label}
              variant="ghost"
              block
              className="justify-start"
              onClick={() => {
                resolve(target!.id, 'actioned', label)
                toast.ok(`${label} — tercatat di log keamanan`)
                setTarget(null)
              }}
            >
              {label}
            </Button>
          ))}
        </div>
      </BottomSheet>
    </div>
  )
}
