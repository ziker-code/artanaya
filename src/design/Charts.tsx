import { cn } from '@/lib/cn'

type Bar = { label: string; value: number }

/** Grafik batang lembut; satu batang bisa disorot (mis. bulan ini). */
export function BarChart({ data, highlight, height = 120, format }: { data: Bar[]; highlight?: number; height?: number; format?: (v: number) => string }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <figure className="w-full">
      <div className="flex items-end gap-2" style={{ height }}>
        {data.map((d, i) => {
          const on = i === highlight
          return (
            <div key={d.label} className="flex h-full flex-1 flex-col justify-end">
              <div
                title={format ? format(d.value) : String(d.value)}
                className={cn('w-full rounded-[8px] transition-[height] duration-700 ease-out-soft', on ? 'bg-sun-500' : 'bg-kelp-200')}
                style={{ height: `${Math.max(6, (d.value / max) * 100)}%` }}
              />
            </div>
          )
        })}
      </div>
      <figcaption className="mt-2 flex gap-2">
        {data.map((d, i) => (
          <span key={d.label} className={cn('flex-1 text-center text-2xs', i === highlight ? 'font-bold text-ink' : 'text-ink-muted')}>
            {d.label}
          </span>
        ))}
      </figcaption>
    </figure>
  )
}

/** Busur setengah lingkaran — skor keamanan akun. */
export function Gauge({ value, label, caption }: { value: number; label: string; caption?: string }) {
  const r = 80
  const half = Math.PI * r
  const pct = Math.max(0, Math.min(100, value)) / 100
  const tone = value >= 80 ? 'text-kelp-700' : value >= 50 ? 'text-sun-500' : 'text-coral-600'
  return (
    <div className="flex flex-col items-center" role="img" aria-label={`${label}: ${value} dari 100`}>
      <svg viewBox="0 0 200 112" className="w-[220px]">
        <path d="M20 100 A80 80 0 0 1 180 100" fill="none" strokeWidth="14" strokeLinecap="round" className="stroke-paper-sunk" />
        <path
          d="M20 100 A80 80 0 0 1 180 100"
          fill="none"
          strokeWidth="14"
          strokeLinecap="round"
          stroke="currentColor"
          className={cn(tone, 'transition-[stroke-dashoffset] duration-1000 ease-out-soft')}
          strokeDasharray={half}
          strokeDashoffset={half * (1 - pct)}
        />
        <text x="100" y="92" textAnchor="middle" className="num fill-ink text-[40px] font-bold">
          {value}
        </text>
      </svg>
      <p className="-mt-1 text-sm font-semibold text-ink">{label}</p>
      {caption && <p className="text-2xs text-ink-muted">{caption}</p>}
    </div>
  )
}

export type SignalRow = { key: string; name: string; score: number | null; weight: number; note: string }

/** Rincian 5 sinyal skor, dibaca orang awam: nama, isi bar, bobot efektif. */
export function ScoreBreakdown({ rows }: { rows: SignalRow[] }) {
  return (
    <ul className="flex flex-col gap-4">
      {rows.map((r) => (
        <li key={r.key}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3">
            <span className="text-[15px] font-semibold text-ink">
              <span className="mr-1.5 inline-flex size-6 items-center justify-center rounded-full bg-kelp-100 text-2xs font-bold text-kelp-700">{r.key}</span>
              {r.name}
            </span>
            <span className="num text-sm text-ink-muted">
              {r.score === null ? 'belum ada data' : <><b className="text-ink">{r.score}</b>/100</>} · bobot {Math.round(r.weight * 100)}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-paper-sunk">
            <div
              className={cn('h-full rounded-full', r.score === null ? 'bg-transparent' : r.score >= 70 ? 'bg-kelp-700' : r.score >= 50 ? 'bg-sun-500' : 'bg-coral-600')}
              style={{ width: `${r.score ?? 0}%` }}
            />
          </div>
          <p className="mt-1 text-2xs text-ink-muted">{r.note}</p>
        </li>
      ))}
    </ul>
  )
}
