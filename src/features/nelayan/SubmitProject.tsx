import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Button, Card, ChipRow, Icon, MoneyInput, ScoreDial, Stepper, TextField, TopBar } from '@/design'
import { useMe, useStore } from '@/data/store'
import { computeScore, type SignalInput } from '@/lib/scoring'
import { BUSINESS_LABEL, type BusinessType } from '@/lib/scoring.config'
import { formatRupiahShort } from '@/lib/format'
import { cn } from '@/lib/cn'
import { toast } from '@/app/toast'
import { ScoreSummary } from '../score'
import { TYPE_ICON, useAction } from '../shared'

const MONTHS = Array.from({ length: 6 }, (_, i) => {
  const d = new Date()
  d.setDate(1)
  d.setMonth(d.getMonth() - (6 - i))
  return d.toLocaleDateString('id-ID', { month: 'short' }).replace('.', '')
})
const TENORS = ['6 bulan', '9 bulan', '12 bulan']

export function SubmitProject() {
  const me = useMe()!
  const nav = useNavigate()
  const prior = useStore((s) => s.projects.find((p) => p.ownerId === me.id && p.signals))
  const submit = useStore((s) => s.submitProject)
  const [step, setStep] = useState(0)

  const [type, setType] = useState<BusinessType>('budidaya')
  const [title, setTitle] = useState('Perluasan Para-Para Pengeringan')
  const [target, setTarget] = useState(25_000_000)
  const [tenor, setTenor] = useState('6 bulan')
  const [plan, setPlan] = useState('Membangun 6 para-para bambu dan terpal agar rumput laut kering lebih bersih dan harga jual naik dari Rp14.000 ke Rp17.000/kg.')

  const base = prior?.signals
  const [volumes, setVolumes] = useState<number[]>(base?.volumes ?? [0, 0, 0, 0, 0, 0])
  const [member, setMember] = useState(base?.membership?.member ?? false)
  const [years, setYears] = useState(base?.membership?.years ?? 0)
  const [kusuka, setKusuka] = useState(base?.legal?.kusuka ?? false)
  const [sku, setSku] = useState(base?.legal?.sku ?? false)
  const tx = base?.tx ?? null

  const signals: SignalInput = useMemo(
    () => ({ type, tx, volumes: volumes.some((v) => v > 0) ? volumes : null, membership: { member, years }, legal: { kusuka, sku }, history: null }),
    [type, tx, volumes, member, years, kusuka, sku],
  )
  const result = useMemo(() => computeScore(signals), [signals])

  const [send, busy] = useAction(async () => {
    const p = await submit({ title, type, target, tenorMonths: Number(tenor.split(' ')[0]), plan, signals })
    toast.ok(`${p.id} terkirim ke admin untuk verifikasi`)
    nav(`/nelayan/proyek/${p.id}`, { replace: true })
  })

  const back = () => (step === 0 ? nav(-1) : setStep(step - 1))

  return (
    <div className="pb-8">
      <TopBar title="Ajukan Proyek Baru" subtitle={`Langkah ${step + 1} dari 4`} onBack={back} />
      <div className="px-5">
        <Stepper steps={['Usaha', 'Dana', 'Data', 'Skor']} current={step} />

        {step === 0 && (
          <div className="mt-6 flex flex-col gap-5">
            <div>
              <p className="mb-3 text-sm font-semibold">Pilih jenis usaha</p>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(BUSINESS_LABEL) as BusinessType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    aria-pressed={type === t}
                    className={cn(
                      'flex flex-col items-start gap-3 rounded-md border p-4 text-left transition-colors',
                      type === t ? 'border-kelp-700 bg-kelp-100' : 'border-line bg-surface hover:bg-paper-sunk',
                    )}
                  >
                    <span className={cn('flex size-10 items-center justify-center rounded-full', type === t ? 'bg-kelp-700 text-paper' : 'bg-paper-sunk text-ink')}>
                      <Icon name={TYPE_ICON[t]} size={20} />
                    </span>
                    <span className="font-bold">{BUSINESS_LABEL[t]}</span>
                  </button>
                ))}
              </div>
            </div>
            <TextField label="Nama proyek" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="mis. Perluasan Tali Bentang" />
            <Button block iconRight="caret-right" disabled={title.trim().length < 4} onClick={() => setStep(1)}>
              Lanjut
            </Button>
          </div>
        )}

        {step === 1 && (
          <div className="mt-6 flex flex-col gap-5">
            <MoneyInput label="Berapa dana yang dibutuhkan?" value={target} onChange={setTarget} min={5_000_000} max={200_000_000} hint="Rp5 juta – Rp200 juta. Dana dicairkan bertahap dalam 3 tahap." />
            <div>
              <p className="mb-2 text-sm font-semibold">Lama akad</p>
              <ChipRow options={TENORS} value={tenor} onChange={setTenor} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="plan" className="text-sm font-semibold">
                Rencana penggunaan dana
              </label>
              <textarea
                id="plan"
                rows={4}
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="rounded-sm border border-transparent bg-paper-sunk p-3.5 text-base outline-none focus:border-kelp-700 focus:bg-surface"
              />
              <p className="text-sm text-ink-muted">Tulis singkat: untuk apa, dan apa yang membaik setelahnya.</p>
            </div>
            <Button block iconRight="caret-right" disabled={plan.trim().length < 20} onClick={() => setStep(2)}>
              Lanjut
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="mt-6 flex flex-col gap-5">
            <Card className="flex items-center gap-3 p-4">
              <span className="flex size-10 items-center justify-center rounded-full bg-tide-100 text-tide-600">
                <Icon name="wallet" size={20} />
              </span>
              <div className="flex-1 text-sm">
                <p className="font-bold">Transaksi Dompetku terisi otomatis</p>
                <p className="text-ink-muted">{tx ? `${tx.count90} transaksi · ${formatRupiahShort(tx.amount90)} (90 hari)` : 'Belum ada transaksi'}</p>
              </div>
            </Card>

            <div>
              <p className="mb-1 text-sm font-semibold">Hasil panen / tangkapan 6 bulan terakhir (kg)</p>
              <p className="mb-3 text-sm text-ink-muted">Dicatat bersama fasilitator {me.facilitator?.name ?? ''}. Ubah jika ada yang keliru.</p>
              <div className="grid grid-cols-3 gap-2">
                {volumes.map((v, i) => (
                  <label key={i} className="flex flex-col gap-1 rounded-sm bg-paper-sunk p-2.5">
                    <span className="text-2xs font-semibold text-ink-muted">{MONTHS[i]}</span>
                    <input
                      inputMode="numeric"
                      value={v ? v.toLocaleString('id-ID') : ''}
                      placeholder="0"
                      onChange={(e) => {
                        const n = Number(e.target.value.replace(/\D/g, '')) || 0
                        setVolumes(volumes.map((x, j) => (j === i ? n : x)))
                      }}
                      className="num w-full bg-transparent text-lg font-bold outline-none"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Toggle checked={member} onChange={setMember} title="Anggota koperasi / KUB" desc={me.kub ?? 'Kelompok Usaha Bersama'} />
              {member && (
                <div className="flex items-center justify-between rounded-sm bg-paper-sunk px-4 py-2">
                  <span className="text-sm">Lama bergabung</span>
                  <div className="flex items-center gap-3">
                    <button aria-label="Kurangi tahun" className="flex size-9 items-center justify-center rounded-full bg-surface" onClick={() => setYears(Math.max(0, years - 1))}>
                      <Icon name="minus" size={16} />
                    </button>
                    <span className="num w-14 text-center font-bold">{years} thn</span>
                    <button aria-label="Tambah tahun" className="flex size-9 items-center justify-center rounded-full bg-surface" onClick={() => setYears(years + 1)}>
                      <Icon name="plus" size={16} />
                    </button>
                  </div>
                </div>
              )}
              <Toggle checked={kusuka} onChange={setKusuka} title="Kartu KUSUKA" desc={me.kusuka ?? 'Kartu Pelaku Usaha Kelautan & Perikanan'} />
              <Toggle checked={sku} onChange={setSku} title="Surat Keterangan Usaha (SKU)" desc="Dari kantor desa" />
            </div>

            <div className="sticky bottom-3 flex items-center gap-3 rounded-md bg-kelp-900 p-3 text-paper shadow-float">
              <div className="rounded-full bg-paper p-0.5">
                <ScoreDial score={result.score} complete={result.complete} size={48} />
              </div>
              <p className="flex-1 text-sm leading-snug">
                <b>Perkiraan skor</b>
                <br />
                <span className="text-kelp-200">berubah saat data diubah</span>
              </p>
              <Button size="sm" onClick={() => setStep(3)}>
                Lihat skor
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="mt-6 flex flex-col gap-5">
            <ScoreSummary r={result} s={signals} />
            <Card className="divide-y divide-line px-4 text-sm">
              <div className="flex justify-between py-3">
                <span className="text-ink-muted">Proyek</span>
                <span className="font-semibold">{title}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-ink-muted">Kebutuhan dana</span>
                <span className="num font-bold">{formatRupiahShort(target)}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-ink-muted">Akad</span>
                <span className="font-semibold">Mudharabah · {tenor}</span>
              </div>
            </Card>
            <Button block loading={busy} onClick={() => send()}>
              Kirim Pengajuan
            </Button>
            <p className="text-center text-2xs text-ink-muted">Admin memverifikasi berkas sebelum proyek tayang di marketplace investor.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function Toggle({ checked, onChange, title, desc }: { checked: boolean; onChange: (v: boolean) => void; title: string; desc: string }) {
  return (
    <button role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="flex items-center gap-3 rounded-md border border-line bg-surface p-4 text-left">
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">{title}</span>
        <span className="block truncate text-sm text-ink-muted">{desc}</span>
      </span>
      <span className={cn('relative h-7 w-12 shrink-0 rounded-full transition-colors', checked ? 'bg-kelp-700' : 'bg-line')}>
        <span className={cn('absolute top-1 size-5 rounded-full bg-white transition-[left] duration-200', checked ? 'left-6' : 'left-1')} />
      </span>
    </button>
  )
}

export { Toggle }
