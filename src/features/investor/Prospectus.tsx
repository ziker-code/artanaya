import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { BottomSheet, Button, Card, EmptyState, Icon, MoneyInput, ProgressBar, TopBar } from '@/design'
import { useStore } from '@/data/store'
import type { LedgerBlock } from '@/data/types'
import { BUSINESS_LABEL } from '@/lib/scoring.config'
import { formatRupiah, formatRupiahShort } from '@/lib/format'
import { cn } from '@/lib/cn'
import { ScoreSummary } from '../score'
import { KV, ProjectCover, StatusBadge, TYPE_ICON, useAction } from '../shared'

const QUICK = [50_000, 100_000, 500_000, 1_000_000]

export function Prospectus() {
  const { id } = useParams()
  const nav = useNavigate()
  const p = useStore((s) => s.projects.find((x) => x.id === id))
  const owner = useStore((s) => s.users.find((u) => u.id === p?.ownerId))
  const backers = useStore((s) => new Set(s.investments.filter((i) => i.projectId === id).map((i) => i.investorName)).size)
  const invest = useStore((s) => s.invest)
  const selfLocked = useStore((s) => s.selfLocked)
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState(500_000)
  const [agree, setAgree] = useState(false)
  const [done, setDone] = useState<LedgerBlock | null>(null)

  const [run, busy] = useAction(async () => {
    const b = await invest(p!.id, amount)
    setDone(b)
  })

  if (!p || !owner) return <EmptyState icon="folder" title="Proyek tidak ditemukan" />
  const room = p.target - p.raised
  const estYear = Math.round((amount * p.expectedReturnPct) / 100)

  return (
    <div className="pb-28">
      <TopBar title="Prospektus" subtitle={p.id} onBack={() => nav(-1)} />
      <div className="flex flex-col gap-5 px-5">
        <ProjectCover type={p.type} id={p.id} className="rounded-lg p-5">
          <span className="inline-flex h-6 items-center gap-1 rounded-full bg-black/25 px-2.5 text-2xs font-semibold">
            <Icon name={TYPE_ICON[p.type]} size={16} /> {BUSINESS_LABEL[p.type]}
          </span>
          <h1 className="mt-6 text-[24px] font-extrabold leading-tight">{p.title}</h1>
          <p className="mt-1 flex items-center gap-1 text-sm text-white/85">
            <Icon name="map-pin" size={16} /> {p.location}
          </p>
        </ProjectCover>

        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <span className="num text-2xl font-extrabold">{formatRupiah(p.raised)}</span>
            <span className="num text-sm font-semibold text-ink-muted">{Math.round((p.raised / p.target) * 100)}%</span>
          </div>
          <ProgressBar value={(p.raised / p.target) * 100} />
          <p className="mt-2 text-sm text-ink-muted">
            dari {formatRupiah(p.target)} · {backers} investor · sisa {formatRupiahShort(room)}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            ['Estimasi', `±${p.expectedReturnPct}%/thn`],
            ['Tenor', `${p.tenorMonths} bulan`],
            ['Nisbah', `${Math.round(p.investorShare * 100)}:${Math.round((1 - p.investorShare) * 100)}`],
          ].map(([k, v]) => (
            <Card key={k} className="p-3">
              <p className="text-2xs text-ink-muted">{k}</p>
              <p className="num mt-0.5 font-bold">{v}</p>
            </Card>
          ))}
        </div>

        <section>
          <h2 className="mb-2 text-lg font-bold">Tentang usaha</h2>
          <p className="text-[15px] leading-relaxed text-ink">{p.summary}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">{p.plan}</p>
          <Card className="mt-3 flex items-center gap-3 p-4">
            <span className="flex size-11 items-center justify-center rounded-full bg-kelp-700 text-sm font-bold text-paper">{owner.initials}</span>
            <div className="text-sm">
              <p className="font-bold">{owner.name}</p>
              <p className="text-ink-muted">Pengelola usaha · KUSUKA terverifikasi</p>
            </div>
          </Card>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold">Penilaian AI</h2>
          <ScoreSummary r={p.score} s={p.signals} />
        </section>

        <section>
          <h2 className="mb-1 text-lg font-bold">Smart contract mudharabah</h2>
          <p className="mb-3 text-sm text-ink-muted">Dana Anda masuk escrow dan dicairkan bertahap hanya setelah laporan progres diterima.</p>
          <Card className="divide-y divide-line px-4">
            {p.stages.map((s) => (
              <KV key={s.n} k={`Tahap ${s.n} · ${s.label}`} v={formatRupiah(s.amount)} />
            ))}
          </Card>
          <p className="mt-3 rounded-sm bg-paper-sunk p-3 text-2xs leading-relaxed text-ink-muted">
            Risiko: hasil usaha kelautan dipengaruhi cuaca dan harga pasar. Bagi hasil adalah estimasi dan tidak dijamin. Dalam akad mudharabah, kerugian modal yang bukan karena kelalaian pengelola ditanggung pemodal.
          </p>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[480px] border-t border-line bg-surface/95 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur-md">
        {p.status === 'live' ? (
          <Button block icon="plus" onClick={() => { setDone(null); setAgree(false); setOpen(true) }}>
            Danai Proyek · mulai Rp50.000
          </Button>
        ) : (
          <div className="flex items-center justify-center gap-2 text-sm text-ink-muted">
            Status: <StatusBadge status={p.status} />
          </div>
        )}
      </div>

      <BottomSheet open={open} onOpenChange={setOpen} title={done ? 'Investasi tercatat' : 'Danai proyek'} description={done ? undefined : p.title}>
        {done ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-kelp-100 text-kelp-700">
              <Icon name="verified" size={32} />
            </span>
            <div>
              <p className="num text-2xl font-extrabold">{formatRupiah(done.amount)}</p>
              <p className="text-sm text-ink-muted">masuk escrow {p.id}</p>
            </div>
            <Card className="w-full p-4 text-left">
              <p className="text-2xs text-ink-muted">Blok #{done.block} · hash transaksi</p>
              <p className="mt-1 break-all font-mono text-xs text-tide-600">{done.hash}</p>
            </Card>
            <Button block variant="secondary" onClick={() => { setOpen(false); nav('/investor/portofolio') }}>
              Lihat Portofolio
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {selfLocked && (
              <p className="rounded-sm bg-coral-100 p-3 text-sm text-coral-700">Kunci mandiri aktif. Buka di menu Radar untuk bertransaksi.</p>
            )}
            <div className="flex flex-wrap gap-2">
              {QUICK.filter((v) => v <= room).map((v) => (
                <button
                  key={v}
                  onClick={() => setAmount(v)}
                  className={cn('h-9 rounded-full border px-4 text-sm font-semibold', amount === v ? 'border-kelp-900 bg-kelp-900 text-paper' : 'border-line bg-surface')}
                >
                  {formatRupiahShort(v)}
                </button>
              ))}
            </div>
            <MoneyInput label="Nominal investasi" value={amount} onChange={setAmount} step={50_000} min={50_000} max={room} hint={`Estimasi bagi hasil ±${formatRupiah(estYear)}/tahun (tidak dijamin)`} />
            <label className="flex items-start gap-3 rounded-sm bg-paper-sunk p-3 text-sm">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 size-5 accent-[var(--color-kelp-700)]" />
              <span>Saya memahami akad mudharabah, nisbah {Math.round(p.investorShare * 100)}:{Math.round((1 - p.investorShare) * 100)}, dan risiko usaha ini.</span>
            </label>
            <Button block loading={busy} disabled={!agree || selfLocked} onClick={() => run()}>
              Konfirmasi {formatRupiah(amount)}
            </Button>
            <p className="text-center text-2xs text-ink-muted">Pembayaran simulasi — tidak ada uang sungguhan yang berpindah.</p>
          </div>
        )}
      </BottomSheet>
    </div>
  )
}
