import type { ReactNode } from 'react'
import { Dialog } from 'radix-ui'
import { IconButton } from './Button'

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  title: string
  description?: string
  children: ReactNode
}

/** Bottom sheet untuk konfirmasi (pencairan, investasi, tindakan admin). */
export function BottomSheet({ open, onOpenChange, title, description, children }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-kelp-950/45 data-[state=open]:animate-[fade_200ms_ease-out]" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[88dvh] w-full max-w-[480px] overflow-y-auto rounded-t-lg bg-paper px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-3 shadow-float outline-none data-[state=open]:animate-[sheet-up_320ms_var(--ease-out-soft)]">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line" aria-hidden />
          <div className="mb-4 flex items-start gap-2">
            <div className="flex-1">
              <Dialog.Title className="text-xl font-bold text-ink">{title}</Dialog.Title>
              {description ? (
                <Dialog.Description className="mt-1 text-sm text-ink-muted">{description}</Dialog.Description>
              ) : (
                <Dialog.Description className="sr-only">{title}</Dialog.Description>
              )}
            </div>
            <Dialog.Close asChild>
              <IconButton icon="close" label="Tutup" className="-mr-2 -mt-1" />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
