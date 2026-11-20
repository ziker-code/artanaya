import { create } from 'zustand'
import { useEffect } from 'react'
import { Icon } from '@/design'
import { cn } from '@/lib/cn'

type Toast = { id: number; tone: 'ok' | 'error'; text: string }
const useToasts = create<{ items: Toast[]; push: (t: Omit<Toast, 'id'>) => void; drop: (id: number) => void }>((set) => ({
  items: [],
  push: (t) => set((s) => ({ items: [...s.items, { ...t, id: Date.now() + Math.random() }] })),
  drop: (id) => set((s) => ({ items: s.items.filter((x) => x.id !== id) })),
}))

export const toast = {
  ok: (text: string) => useToasts.getState().push({ tone: 'ok', text }),
  error: (text: string) => useToasts.getState().push({ tone: 'error', text }),
}

function Item({ t }: { t: Toast }) {
  const drop = useToasts((s) => s.drop)
  useEffect(() => {
    const id = setTimeout(() => drop(t.id), 3800)
    return () => clearTimeout(id)
  }, [t.id, drop])
  return (
    <div
      role="status"
      className={cn(
        'pointer-events-auto flex items-center gap-3 rounded-full py-2 pl-2 pr-5 text-sm font-medium shadow-float animate-[drop_360ms_var(--ease-out-soft)]',
        t.tone === 'ok' ? 'bg-kelp-950 text-white' : 'bg-coral-600 text-white',
      )}
    >
      <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-full', t.tone === 'ok' ? 'bg-sun-500 text-white' : 'bg-white/20 text-white')}>
        <Icon name={t.tone === 'ok' ? 'check' : 'warning'} size={20} />
      </span>
      <span>{t.text}</span>
    </div>
  )
}

export function Toaster() {
  const items = useToasts((s) => s.items)
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-3 z-[60] mx-auto flex w-full max-w-[480px] flex-col gap-2 px-4">
      {items.map((t) => (
        <Item key={t.id} t={t} />
      ))}
    </div>
  )
}
