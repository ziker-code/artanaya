import { openWa } from '@/lib/wa'
import { useMoney } from '../profile/Profile'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { BottomSheet, Button, Card, Divider, EmptyState, HeroCard, ListRow, Notice, SectionHeader, TxRow } from '@/design'
import { useMe, useStore, walletOf } from '@/data/store'
import { formatDate, formatRupiah } from '@/lib/format'
import { toast } from '@/app/toast'
import { KV, PageHeader, useAction } from '../shared'

export function Wallet() {
  const me = useMe()!
  const money = useMoney()
  const nav = useNavigate()
  const ledger = useStore((s) => s.ledger)
  const active = useStore((s) => s.projects.find((p) => p.ownerId === me.id && p.status === 'running'))
  const disburse = useStore((s) => s.disburse)
  const pay = useStore((s) => s.payProfitShare)
  const w = walletOf(ledger, me.name)
  const avail = active?.stages.find((s) => s.status === 'available')
  const pendingReport = active?.stages.find((s) => s.status === 'disbursed')
  const [sheet, setSheet] = useState<'cair' | 'setor' | null>(null)

  const [doCair, busyCair] = useAction(async () => {
    const b = await disburse(active!.id, avail!.n)
    toast.ok(`Dana tahap ${avail!.n} cair · tercatat di blok #${b.block}`)
    setSheet(null)
  })
  const [doSetor, busySetor] = useAction(async () => {
    const b = await pay(active!.id)
    toast.ok(`Setoran diterima & dibagikan ke investor · blok #${b.block}`)
    setSheet(null)
  })

  return (
    <div className="pb-8">
      <PageHeader title="Dompetku" />
      <div className="flex flex-col gap-4 px-5 pt-3">
        <HeroCard>
          <p className="text-sm text-kelp-300">Dana diterima</p>
          <p className="num mt-1 text-[34px] font-semibold tracking-tight">{money(formatRupiah)(w.received)}</p>
          <p className="num text-sm text-kelp-300">sudah disetor kembali {formatRupiah(w.paid)}</p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <Button size="sm" onClick={() => setSheet('cair')}>
              Ajukan Pencairan
            </Button>
            <Button size="sm" variant="ghost" disabled={!active?.nextDue} onClick={() => setSheet('setor')}>
              Setor Bagi Hasil
            </Button>
          </div>
        </HeroCard>

        {active?.nextDue && (
          <Notice title={`Jatuh tempo setoran ${formatDate(active.nextDue.date)}`}>{formatRupiah(active.nextDue.amount)} untuk {active.title}</Notice>
        )}
        {!avail && active && (
          <Notice tone="tide" icon="lock" title="Belum ada tahap yang terbuka">
            Kirim laporan progres di halaman proyek untuk membuka tahap berikutnya.
          </Notice>
        )}

        <section className="mt-2">
          <SectionHeader title="Riwayat pencairan & setoran" />
          {w.txs.length === 0 ? (
            <EmptyState icon="wallet" title="Belum ada transaksi" />
          ) : (
            <Card className="px-4">
              {w.txs.map((t, i) => (
                <div key={t.hash}>
                  {i > 0 && <Divider />}
                  <TxRow title={t.memo} date={formatDate(t.ts)} amount={t.amount} direction={t.type === 'pencairan' ? 'in' : 'out'} hash={t.hash} />
                </div>
              ))}
            </Card>
          )}
          <p className="mt-2 text-2xs text-ink-muted">Setiap baris tercatat di Ledger Smart Contract (simulasi) dan tidak bisa diubah.</p>
        </section>

        <section className="mt-2">
          <SectionHeader title="Dokumen legalitas" />
          <Card className="px-4">
            <ListRow icon="identification-card" iconTone="kelp" title="Kartu KUSUKA" subtitle={me.kusuka} trailing={<span className="text-2xs font-semibold text-kelp-700">Terverifikasi</span>} />
            <Divider />
            <ListRow icon="file-text" iconTone="kelp" title="Akad mudharabah" subtitle={active ? `${active.id} · ${active.tenorMonths} bulan` : '-'} chevron onClick={() => active && nav(`/nelayan/proyek/${active.id}`)} />
          </Card>
        </section>
      </div>

      <BottomSheet open={sheet === 'cair'} onOpenChange={(v) => !v && setSheet(null)} title={avail ? `Pencairan tahap ${avail.n}` : 'Ajukan pencairan dana'} description="Smart contract memeriksa laporan tahap sebelumnya sebelum dana dilepas.">
        {avail && active && (
          <div className="flex flex-col gap-4">
            <Card className="divide-y divide-line px-4">
              <KV k="Untuk" v={avail.label} />
              <KV k="Nominal" v={formatRupiah(avail.amount)} strong />
              <KV k="Rekening tujuan" v="BRI ••• 4821" />
            </Card>
            <Button block loading={busyCair} onClick={() => doCair()}>
              Cairkan Sekarang
            </Button>
          </div>
        )}
        {!avail && (
          <div className="flex flex-col gap-4">
            {active ? (
              <>
                <Card className="divide-y divide-paper-sunk px-4">
                  {active.stages.map((st) => (
                    <KV
                      key={st.n}
                      k={`Tahap ${st.n} · ${st.label}`}
                      v={st.status === 'reported' ? 'Selesai' : st.status === 'disbursed' ? 'Tunggu laporan' : st.status === 'available' ? 'Siap cair' : 'Terkunci'}
                    />
                  ))}
                </Card>
                <p className="text-sm text-ink-muted">
                  {pendingReport
                    ? `Tahap ${pendingReport.n + 1} terbuka setelah laporan progres tahap ${pendingReport.n} dikirim.`
                    : 'Semua tahap sudah dicairkan. Pencairan berikutnya tersedia pada proyek baru.'}
                </p>
                {pendingReport && (
                  <Button block icon="upload" onClick={() => nav(`/nelayan/proyek/${active.id}`)}>
                    Kirim Laporan Progres
                  </Button>
                )}
                <Button
                  block
                  variant="ghost"
                  icon="whatsapp"
                  onClick={() => openWa(`Halo Mas ${me.facilitator?.name.split(' ')[0] ?? ''}, saya ${me.name} (${active.id} · ${active.title}). Saya ingin mengajukan pencairan dana tahap berikutnya dan butuh bantuan menyiapkan laporan progres.`)}
                >
                  Minta Bantuan Fasilitator
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm text-ink-muted">Belum ada proyek berjalan. Pencairan bisa diajukan setelah proyek Bapak didanai penuh.</p>
                <Button block icon="plus" onClick={() => nav('/nelayan/ajukan')}>
                  Ajukan Proyek
                </Button>
              </>
            )}
          </div>
        )}
      </BottomSheet>

      <BottomSheet open={sheet === 'setor'} onOpenChange={(v) => !v && setSheet(null)} title="Setor bagi hasil" description="Setoran otomatis dibagi ke semua investor sesuai porsi modalnya.">
        {active?.nextDue && (
          <div className="flex flex-col gap-4">
            <Card className="divide-y divide-line px-4">
              <KV k="Proyek" v={active.title} />
              <KV k="Nominal" v={formatRupiah(active.nextDue.amount)} strong />
              <KV k="Nisbah investor" v={`${Math.round(active.investorShare * 100)}%`} />
            </Card>
            <Button block loading={busySetor} onClick={() => doSetor()}>
              Setor dari Dompetku
            </Button>
          </div>
        )}
      </BottomSheet>
    </div>
  )
}
