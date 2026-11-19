import { useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { formatRupiah } from '@/lib/format'
import { Icon, type IconName } from './Icon'

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  hint?: ReactNode
  error?: string
  icon?: IconName
}

export function TextField({ label, hint, error, icon, className, id, ...rest }: FieldProps) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const describedBy = error ? `${fieldId}-err` : hint ? `${fieldId}-hint` : undefined
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={fieldId} className="text-sm font-semibold text-ink">
        {label}
      </label>
      <div
        className={cn(
          'flex h-12 items-center gap-2.5 rounded-sm border bg-paper-sunk px-3.5 transition-colors',
          'focus-within:border-kelp-700 focus-within:bg-surface',
          error ? 'border-coral-600' : 'border-transparent',
        )}
      >
        {icon && <Icon name={icon} className="shrink-0 text-ink-muted" />}
        <input
          {...rest}
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className="h-full w-full bg-transparent text-base text-ink outline-none placeholder:text-ink-faint"
        />
      </div>
      {error ? (
        <p id={`${fieldId}-err`} className="flex items-center gap-1 text-sm text-coral-700">
          <Icon name="warning" size={16} /> {error}
        </p>
      ) : (
        hint && (
          <p id={`${fieldId}-hint`} className="text-sm text-ink-muted">
            {hint}
          </p>
        )
      )}
    </div>
  )
}

type MoneyProps = {
  label: string
  value: number
  onChange: (v: number) => void
  step?: number
  min?: number
  max?: number
  hint?: ReactNode
}

/** Input nominal dengan tombol −/+ besar, mudah dipakai jempol di bawah matahari. */
export function MoneyInput({ label, value, onChange, step = 1_000_000, min = 0, max = 1_000_000_000, hint }: MoneyProps) {
  const id = useId()
  const clamp = (v: number) => Math.min(max, Math.max(min, v))
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>
      <div className="flex items-center gap-2 rounded-md bg-paper-sunk p-2">
        <button
          type="button"
          aria-label={`Kurangi ${formatRupiah(step)}`}
          onClick={() => onChange(clamp(value - step))}
          disabled={value <= min}
          className="flex size-12 shrink-0 items-center justify-center rounded-sm bg-surface text-ink transition-colors hover:bg-white disabled:opacity-40"
        >
          <Icon name="minus" size={20} />
        </button>
        <input
          id={id}
          inputMode="numeric"
          value={formatRupiah(value)}
          onChange={(e) => {
            const digits = Number(e.target.value.replace(/\D/g, ''))
            onChange(clamp(Number.isFinite(digits) ? digits : 0))
          }}
          className="num w-full min-w-0 bg-transparent text-center text-2xl font-bold text-ink outline-none"
        />
        <button
          type="button"
          aria-label={`Tambah ${formatRupiah(step)}`}
          onClick={() => onChange(clamp(value + step))}
          disabled={value >= max}
          className="flex size-12 shrink-0 items-center justify-center rounded-sm bg-sun-500 text-kelp-950 transition-colors hover:bg-sun-600 disabled:opacity-40"
        >
          <Icon name="plus" size={20} />
        </button>
      </div>
      {hint && <p className="text-sm text-ink-muted">{hint}</p>}
    </div>
  )
}
