import { useShallow } from 'zustand/react/shallow'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Button, Card, EmptyState, Icon, ScoreBadge, Segmented, TopBar } from '@/design'
import { useStore } from '@/data/store'
import { DECISION_COPY } from '@/lib/scoring'
import { BUSINESS_LABEL } from '@/lib/scoring.config'
import { formatDate, formatRupiah } from '@/lib/format'
import { toast } from '@/app/toast'
import { ScoreSummary } from '../score'
import { KV, PageHeader, StatusBadge, TYPE_ICON } from '../shared'

export function ReviewList() {
  const nav = useNavigate()
  const [tab, setTab] = useState('wait')
  const projects = useStore((s) => s.projects)
  const users = useStore((s) => s.users)
  const list = tab === 'wait' ? projects.filter((p) => p.status === 'review') : projects
  return (
    <div className="pb-8">
      <PageHeader eyebrow="Audit pengajuan nelayan" title="Tinjau Pengajuan" />
      <div className="px-5 pt-2">
        <Segmented label="Filter" value={tab} onChange={setTab} options={[{ value: 'wait', label: `Menunggu (${projects.filter((p) => p.status === 'review').length})` }, { value: 'all', label: 'Semua proyek' }]} />
        <div className="mt-4 flex flex-col gap-3">
          {list.length === 0 && <EmptyState icon="check" title="Antrean kosong" body="Semua pengajuan sudah ditinjau." />}
          {list.map((p) => (
            <button key={p.id} onClick={() => nav(`/admin/tinjau/${p.id}`)} className="press rounded-md bg-surface p-4 text-left hover:shadow-soft">
              <div className="mb-2 flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-full bg-kelp-100 text-kelp-700">
                  <Icon name={TYPE_ICON[p.type]} size={16} />
                </span>
                <span className="num text-2xs font-semibold text-ink-muted">{p.id}</span>
                <span className="ml-auto">{p.status === 'review' ? <ScoreBadge score={p.score.score} complete={p.score.complete} /> : <StatusBadge status={p.status} />}</span>
              </div>
              <p className="font-bold">{p.title}</p>
              <p className="text-sm text-ink-muted">Pengaju: {users.find((u) => u.id === p.ownerId)?.name}</p>
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <p className="text-2xs text-ink-muted">Target dana</p>
                  <p className="num font-bold">{formatRupiah(p.target)}</p>
                </div>
                <span className="num text-sm font-semibold text-ink-muted">skor {p.score.score}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ReviewDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const p = useStore((s) => s.projects.find((x) => x.id === id))
  const owner = useStore((s) => s.users.find((u) => u.id === p?.ownerId))
  const alerts = useStore(useShallow((s) => s.alerts.filter((a) => a.status === 'open' && a.subject.includes(id ?? '#'))))
  const review = useStore((s) => s.reviewProject)
  const [note, setNote] = useState('')
  if (!p || !owner) return <EmptyState icon="folder" title="Pengajuan tidak ditemukan" />

  const rec = p.score.decision
  const recommendPublish = rec === 'tayang-tinggi' || rec === 'tayang-sedang'
  const docs: [string, boolean][] = [
    ['Kartu KUSUKA', !!p.signals.legal?.kusuka],
    ['Surat Keterangan Usaha', !!p.signals.legal?.sku],
    ['Keanggotaan koperasi/KUB', !!p.signals.membership?.member],
    ['Verifikasi wajah (liveness)', true],
  ]

  const act = (action: 'publish' | 'coach') => {
    review(p.id, action, note || (action === 'coach' ? 'Dirujuk ke fasilitator untuk melengkapi data dan pembinaan usaha.' : ''))
    toast.ok(action === 'publish' ? `${p.id} tayang di marketplace investor` : `${p.id} dirujuk ke fasilitator`)
    nav('/admin/tinjau')
  }

  return (
    <div className="pb-8">
      <TopBar title={p.title} subtitle={`${p.id} · ${BUSINESS_LABEL[p.type]}`} onBack={() => nav(-1)} />
      <div className="flex flex-col gap-5 px-5">
        {alerts.length > 0 && (
          <div className="flex gap-3 rounded-md border border-coral-600/30 bg-coral-100 p-4 text-sm text-coral-700">
            <Icon name="warning" size={24} className="shrink-0" />
            <div>
              <p className="font-bold">Radar AI: {alerts[0].title}</p>
              <p>{alerts[0].detail}</p>
            </div>
          </div>
        )}

        <ScoreSummary r={p.score} s={p.signals} />

        <Card className="divide-y divide-line px-4">
          <KV k="Pengaju" v={owner.name} />
          <KV k="Lokasi" v={p.location} />
          <KV k="Target dana" v={formatRupiah(p.target)} strong />
          <KV k="Akad" v={`Mudharabah · ${p.tenorMonths} bulan`} />
          <KV k="Diajukan" v={formatDate(p.createdAt)} />
        </Card>

        <Card className="p-4">
          <p className="mb-2 text-sm font-semibold">Kelengkapan berkas</p>
          <ul className="flex flex-col gap-2">
            {docs.map(([label, ok]) => (
              <li key={label} className="flex items-center gap-2 text-sm">
                <span className={`flex size-6 items-center justify-center rounded-full ${ok ? 'bg-kelp-100 text-kelp-700' : 'bg-coral-100 text-coral-700'}`}>
                  <Icon name={ok ? 'check' : 'close'} size={16} />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-4">
          <p className="text-sm font-semibold">Rencana penggunaan dana</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-muted">{p.plan}</p>
        </Card>

        {p.status === 'review' ? (
          <section className="flex flex-col gap-3">
            <p className="text-sm">
              <span className="font-semibold">Rekomendasi sistem: </span>
              {DECISION_COPY[rec].title}
            </p>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Catatan untuk nelayan / fasilitator (opsional)"
              className="rounded-[22px] border-2 border-transparent bg-white p-4 text-base outline-none focus:border-kelp-950"
            />
            <Button block variant={recommendPublish ? 'primary' : 'ghost'} icon="check" onClick={() => act('publish')}>
              Verifikasi & Tayangkan
            </Button>
            <Button block variant={recommendPublish ? 'ghost' : 'secondary'} icon="whatsapp" onClick={() => act('coach')}>
              Rujuk ke Fasilitator
            </Button>
          </section>
        ) : (
          <div className="flex items-center gap-2 text-sm text-ink-muted">
            Status: <StatusBadge status={p.status} />
          </div>
        )}
      </div>
    </div>
  )
}
