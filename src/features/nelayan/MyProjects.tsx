import { useShallow } from 'zustand/react/shallow'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { BottomSheet, Button, Card, EmptyState, Icon, Notice, ProgressBar, TopBar } from '@/design'
import { useMe, useStore } from '@/data/store'
import type { Stage } from '@/data/types'
import { formatDate, formatRupiah } from '@/lib/format'
import { cn } from '@/lib/cn'
import { toast } from '@/app/toast'
import { ScoreSummary } from '../score'
import { KV, PageHeader, ProjectCover, StatusBadge, useAction } from '../shared'

export function MyProjects() {
  const me = useMe()!
  const nav = useNavigate()
  const projects = useStore(useShallow((s) => s.projects.filter((p) => p.ownerId === me.id)))
  return (
    <div className="pb-8">
      <PageHeader title="Proyek Saya" trailing={<Button size="sm" icon="plus" onClick={() => nav('/nelayan/ajukan')}>Ajukan</Button>} />
      <div className="flex flex-col gap-3 px-5 pt-3">
        {projects.length === 0 && <EmptyState icon="folder" title="Belum ada proyek" />}
        {projects.map((p) => (
          <button key={p.id} onClick={() => nav(`/nelayan/proyek/${p.id}`)} className="rounded-md border border-line bg-surface p-4 text-left transition-colors hover:border-kelp-300">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="num text-2xs font-semibold text-ink-muted">{p.id}</span>
              <StatusBadge status={p.status} />
            </div>
            <p className="font-bold">{p.title}</p>
            <p className="mb-3 text-sm text-ink-muted">Skor {p.score.score} · diajukan {formatDate(p.createdAt)}</p>
            <ProgressBar value={(p.raised / p.target) * 100} />
            <p className="num mt-1.5 text-sm">
              <b>{formatRupiah(p.raised)}</b> <span className="text-ink-muted">/ {formatRupiah(p.target)}</span>
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}

const stageTone: Record<Stage['status'], string> = {
  locked: 'bg-paper-sunk text-ink-faint',
  available: 'bg-sun-500 text-kelp-950',
  disbursed: 'bg-kelp-700 text-paper',
  reported: 'bg-kelp-100 text-kelp-700',
}
const stageLabel: Record<Stage['status'], string> = {
  locked: 'Terkunci',
  available: 'Siap dicairkan',
  disbursed: 'Dicairkan · tunggu laporan',
  reported: 'Selesai',
}

export function ProjectDetailNelayan() {
  const { id } = useParams()
  const nav = useNavigate()
  const me = useMe()!
  const p = useStore((s) => s.projects.find((x) => x.id === id))
  const disburse = useStore((s) => s.disburse)
  const report = useStore((s) => s.reportProgress)
  const [reportFor, setReportFor] = useState<Stage | null>(null)
  const [text, setText] = useState('')

  const [doDisburse, busy] = useAction(async (n: number) => {
    const b = await disburse(p!.id, n)
    toast.ok(`Dana tahap ${n} cair · blok #${b.block}`)
  })

  if (!p || p.ownerId !== me.id) return <EmptyState icon="folder" title="Proyek tidak ditemukan" />

  return (
    <div className="pb-8">
      <TopBar title={p.title} subtitle={p.id} onBack={() => nav(-1)} />
      <div className="flex flex-col gap-5 px-5">
        <ProjectCover type={p.type} id={p.id} className="rounded-lg p-5">
          <StatusBadge status={p.status} />
          <p className="num mt-6 text-[28px] font-extrabold">{formatRupiah(p.raised)}</p>
          <p className="text-sm text-white/80">terkumpul dari {formatRupiah(p.target)}</p>
          <div className="mt-3">
            <ProgressBar value={(p.raised / p.target) * 100} onDark />
          </div>
        </ProjectCover>

        {p.status === 'review' && (
          <Notice icon="clipboard-check" title="Sedang diverifikasi admin">
            Biasanya selesai 1×24 jam. Bapak akan mendapat notifikasi WhatsApp.
          </Notice>
        )}
        {p.status === 'coaching' && (
          <Notice tone="coral" icon="help" title="Dirujuk ke fasilitator untuk pembinaan">
            {p.reviewNote || `${me.facilitator?.name} akan membantu melengkapi data sebelum diajukan ulang.`}
          </Notice>
        )}

        {(p.status === 'running' || p.status === 'live') && (
          <section>
            <h2 className="mb-1 text-lg font-bold">Pencairan bertahap</h2>
            <p className="mb-3 text-sm text-ink-muted">Aturan akad: tahap berikutnya terbuka setelah laporan progres tahap sebelumnya dikirim.</p>
            <ol className="flex flex-col gap-2">
              {p.stages.map((s) => (
                <li key={s.n} className="flex items-center gap-3 rounded-md border border-line bg-surface p-4">
                  <span className={cn('num flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold', stageTone[s.status])}>
                    {s.status === 'reported' ? <Icon name="check" size={16} /> : s.n}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{s.label}</p>
                    <p className="num text-sm text-ink-muted">
                      {formatRupiah(s.amount)} · {stageLabel[s.status]}
                    </p>
                  </div>
                  {s.status === 'available' && (
                    <Button size="sm" loading={busy} onClick={() => doDisburse(s.n)}>
                      Cairkan
                    </Button>
                  )}
                  {s.status === 'disbursed' && (
                    <Button size="sm" variant="secondary" icon="upload" onClick={() => { setReportFor(s); setText('') }}>
                      Lapor
                    </Button>
                  )}
                  {s.status === 'locked' && <Icon name="lock" className="text-ink-faint" />}
                </li>
              ))}
            </ol>
          </section>
        )}

        <ScoreSummary r={p.score} s={p.signals} />

        <Card className="divide-y divide-line px-4">
          <KV k="Akad" v={`Mudharabah · ${p.tenorMonths} bulan`} />
          <KV k="Nisbah investor : nelayan" v={`${Math.round(p.investorShare * 100)} : ${Math.round((1 - p.investorShare) * 100)}`} />
          <KV k="Rencana" v={<span className="block max-w-[24ch] text-right font-normal">{p.plan}</span>} />
        </Card>
      </div>

      <BottomSheet open={!!reportFor} onOpenChange={(v) => !v && setReportFor(null)} title={`Laporan progres tahap ${reportFor?.n}`} description="Ceritakan singkat hasil penggunaan dana. Foto bisa dikirim lewat fasilitator.">
        <div className="flex flex-col gap-4">
          <textarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="mis. 2.000 ikat bibit sudah ditanam di 40 tali, pertumbuhan baik."
            className="rounded-sm border border-transparent bg-paper-sunk p-3.5 text-base outline-none focus:border-kelp-700 focus:bg-surface"
          />
          <Button
            block
            icon="upload"
            disabled={text.trim().length < 10}
            onClick={() => {
              report(p.id, reportFor!.n, text)
              toast.ok(`Laporan tahap ${reportFor!.n} diterima — tahap berikutnya terbuka`)
              setReportFor(null)
            }}
          >
            Kirim Laporan
          </Button>
        </div>
      </BottomSheet>
    </div>
  )
}
