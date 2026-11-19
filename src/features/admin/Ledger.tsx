import { useState } from 'react'
import { Badge, Button, Card, HeroCard, Icon } from '@/design'
import { useStore } from '@/data/store'
import { verifyChain, type VerifyResult } from '@/lib/ledger'
import { formatDate, formatRupiah, shortHash } from '@/lib/format'
import { cn } from '@/lib/cn'
import { toast } from '@/app/toast'
import { PageHeader } from '../shared'

const TYPE = {
  investasi: { label: 'Investasi', tone: 'tide' },
  pencairan: { label: 'Pencairan', tone: 'sun' },
  setoran: { label: 'Setoran', tone: 'kelp' },
  distribusi: { label: 'Distribusi', tone: 'kelp' },
} as const

export function Ledger() {
  const ledger = useStore((s) => s.ledger)
  const tamper = useStore((s) => s.tamper)
  const tamperLedger = useStore((s) => s.tamperLedger)
  const [result, setResult] = useState<VerifyResult | null>(null)
  const [checking, setChecking] = useState(false)
  const [open, setOpen] = useState<number | null>(null)
  const [show, setShow] = useState(15)
  const list = [...ledger].reverse()

  const verify = async () => {
    setChecking(true)
    const r = await verifyChain(ledger)
    await new Promise((res) => setTimeout(res, 450))
    setResult(r)
    setChecking(false)
    if (!r.ok) {
      setOpen(r.brokenAt)
      setShow(ledger.length)
      setTimeout(() => document.getElementById(`blk-${r.brokenAt}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100)
    }
  }

  return (
    <div className="pb-8">
      <PageHeader eyebrow="Smart contract mudharabah (simulasi)" title="Ledger Transaksi" />
      <div className="flex flex-col gap-4 px-5 pt-2">
        <HeroCard>
          <div className="flex items-center justify-between">
            <Badge tone="onDark" icon="link">
              Hash chain SHA-256
            </Badge>
            <span className="num text-2xs text-kelp-300">{ledger.length} blok</span>
          </div>
          <p className="mt-4 text-sm text-kelp-300">Hash blok terakhir</p>
          <p className="mt-1 break-all font-mono text-[13px] leading-snug text-white">{ledger.at(-1)?.hash}</p>
          <Button className="mt-5" block loading={checking} icon="shield-check" onClick={verify}>
            Verifikasi Rantai
          </Button>
        </HeroCard>

        {result && (
          <div className={cn('flex gap-3 rounded-md p-4 text-sm', result.ok ? 'bg-kelp-100 text-kelp-700' : 'bg-coral-100 text-coral-700')} role="status">
            <Icon name={result.ok ? 'verified' : 'warning'} size={24} className="shrink-0" />
            {result.ok ? (
              <p>
                <b>Rantai utuh.</b> {result.checked} blok dihitung ulang di browser ini; semua hash cocok.
              </p>
            ) : (
              <p>
                <b>Rantai putus di blok #{result.brokenAt}.</b> {result.reason}. Data yang diubah diam-diam langsung ketahuan.
              </p>
            )}
          </div>
        )}

        <details className="rounded-md bg-white/60 p-4 text-sm">
          <summary className="cursor-pointer font-semibold text-ink-muted">Mode demo juri</summary>
          <p className="mt-2 text-ink-muted">Ubah nominal satu blok langsung di database tanpa menghitung ulang hash, lalu tekan “Verifikasi Rantai”.</p>
          <Button
            size="sm"
            variant={tamper ? 'secondary' : 'danger'}
            className="mt-3"
            onClick={() => {
              tamperLedger()
              setResult(null)
              toast.ok(tamper ? 'Data dipulihkan' : 'Satu blok dimanipulasi — coba verifikasi')
            }}
          >
            {tamper ? 'Pulihkan data asli' : 'Simulasikan manipulasi data'}
          </Button>
        </details>

        <section>
          <h2 className="mb-2 text-lg font-bold">Log transaksi</h2>
          <Card className="divide-y divide-line">
            {list.slice(0, show).map((b) => {
              const broken = result && !result.ok && result.brokenAt === b.block
              return (
                <div key={b.block} id={`blk-${b.block}`} className={cn('px-4', broken && 'bg-coral-100/60')}>
                  <button className="flex w-full items-center gap-3 py-3 text-left" onClick={() => setOpen(open === b.block ? null : b.block)} aria-expanded={open === b.block}>
                    <span className="num w-10 shrink-0 text-2xs font-bold text-ink-muted">#{b.block}</span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <Badge tone={TYPE[b.type].tone}>{TYPE[b.type].label}</Badge>
                        <span className="num text-2xs text-ink-muted">{b.projectId}</span>
                      </span>
                      <code className="mt-1 block font-mono text-xs text-tide-600">{shortHash(b.hash, 10, 6)}</code>
                    </span>
                    <span className="num shrink-0 text-sm font-bold">{formatRupiah(b.amount)}</span>
                  </button>
                  {open === b.block && (
                    <dl className="mb-3 grid grid-cols-[88px_1fr] gap-x-3 gap-y-1.5 rounded-sm bg-paper-sunk p-3 text-2xs">
                      <dt className="text-ink-muted">Waktu</dt>
                      <dd>{formatDate(b.ts)} {new Date(b.ts).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</dd>
                      <dt className="text-ink-muted">Dari → ke</dt>
                      <dd>
                        {b.from} → {b.to}
                      </dd>
                      <dt className="text-ink-muted">Keterangan</dt>
                      <dd>{b.memo}</dd>
                      <dt className="text-ink-muted">Prev hash</dt>
                      <dd className="break-all font-mono">{b.prevHash}</dd>
                      <dt className="text-ink-muted">Hash</dt>
                      <dd className="break-all font-mono">{b.hash}</dd>
                    </dl>
                  )}
                </div>
              )
            })}
          </Card>
          {show < list.length && (
            <Button variant="quiet" className="mt-2 w-full" onClick={() => setShow(show + 20)}>
              Tampilkan lebih banyak ({list.length - show} lagi)
            </Button>
          )}
        </section>
      </div>
    </div>
  )
}
