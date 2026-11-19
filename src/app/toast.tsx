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
        'pointer-events-auto flex items-start gap-2.5 rounded-md px-4 py-3 text-sm font-semibold shadow-float animate-[sheet-up_280ms_var(--ease-out-soft)]',
        t.tone === 'ok' ? 'bg-kelp-900 text-paper' : 'bg-coral-600 text-white',
      )}
    >
      <Icon name={t.tone === 'ok' ? 'check' : 'warning'} size={20} className="mt-px shrink-0" />
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
