import { Card, Notice, ScoreBadge, ScoreBreakdown, ScoreDial, type SignalRow } from '@/design'
import { DECISION_COPY, SIGNAL_NAME, type ScoreResult, type SignalInput, type SignalKey } from '@/lib/scoring'
import { formatRupiahShort } from '@/lib/format'

function note(k: SignalKey, s: SignalInput): string {
  switch (k) {
    case 'T':
      return s.tx ? `${s.tx.count90} transaksi Dompetku · ${formatRupiahShort(s.tx.amount90)} dalam 90 hari` : 'Belum ada transaksi Dompetku'
    case 'P': {
      if (!s.volumes?.length) return 'Belum ada catatan hasil'
      const avg = Math.round(s.volumes.reduce((a, b) => a + b, 0) / s.volumes.length)
      return `Rata-rata ${avg.toLocaleString('id-ID')} kg/bulan selama ${s.volumes.length} bulan`
    }
    case 'K':
      return !s.membership ? 'Belum diisi' : s.membership.member ? `Anggota aktif ${s.membership.years} tahun` : 'Belum bergabung koperasi/KUB'
    case 'L':
      return !s.legal ? 'Belum diisi' : [s.legal.kusuka ? 'KUSUKA ✓' : 'KUSUKA belum', s.legal.sku ? 'SKU ✓' : 'SKU belum'].join(' · ')
    case 'R':
      return s.history ? `${s.history.onTime}/${s.history.total} akad lunas tepat waktu` : 'Nelayan baru — bobot dibagi ke sinyal lain'
  }
}

export function scoreRows(r: ScoreResult, s: SignalInput): SignalRow[] {
  return (Object.keys(SIGNAL_NAME) as SignalKey[]).map((k) => ({ key: k, name: SIGNAL_NAME[k], score: r.signals[k], weight: r.weights[k], note: note(k, s) }))
}

export function ScoreSummary({ r, s, compact }: { r: ScoreResult; s: SignalInput; compact?: boolean }) {
  const copy = DECISION_COPY[r.decision]
  return (
    <div className="flex flex-col gap-4">
      <Card className="flex items-center gap-4 p-5">
        <ScoreDial score={r.score} complete={r.complete} size={76} />
        <div className="min-w-0">
          <p className="text-sm text-ink-muted">Skor kelayakan AI</p>
          <p className="num text-[28px] font-extrabold leading-tight">
            {r.score}
            <span className="text-base font-semibold text-ink-muted">/100</span>
          </p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            <ScoreBadge score={r.score} complete={r.complete} />
            {r.newcomer && <span className="inline-flex h-6 items-center rounded-full bg-tide-100 px-2.5 text-2xs font-semibold text-tide-600">Nelayan Baru</span>}
          </div>
        </div>
      </Card>
      <Notice tone={r.decision === 'pembinaan' ? 'coral' : r.decision === 'verifikasi' ? 'tide' : 'sun'} icon={r.decision === 'pembinaan' ? 'help' : 'info'} title={copy.title}>
        {copy.body}
      </Notice>
      {!compact && (
        <Card className="p-5">
          <p className="mb-4 text-sm font-semibold text-ink">Dari mana skor ini?</p>
          <ScoreBreakdown rows={scoreRows(r, s)} />
          <p className="mt-5 border-t border-line pt-3 text-2xs text-ink-faint">
            S = Σ bobot × sinyal (Lampiran 7). Ambang acuan tiap sinyal bersifat asumsi prototipe.
          </p>
        </Card>
      )}
    </div>
  )
}
