import { useState } from 'react'
import { create } from 'zustand'
import { BottomSheet, Button, Icon } from '@/design'
import { cn } from '@/lib/cn'
import { toast } from './toast'

/** Event `beforeinstallprompt` (Chrome/Edge Android & desktop) disimpan agar bisa dipicu dari tombol. */
type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> }

const isStandalone = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true)

const isIos = () => typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent)

const usePwa = create<{ deferred: InstallEvent | null; installed: boolean }>(() => ({ deferred: null, installed: isStandalone() }))

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    usePwa.setState({ deferred: e as InstallEvent })
  })
  window.addEventListener('appinstalled', () => {
    usePwa.setState({ deferred: null, installed: true })
    toast.ok('ARTANAYA terpasang di layar utama')
  })
}

/** Kartu "Install aplikasi": Android/desktop memakai prompt asli, iPhone mendapat panduan Bagikan → Tambah ke Layar Utama. */
export function InstallAppCard({ compact, className }: { compact?: boolean; className?: string }) {
  const { deferred, installed } = usePwa()
  const [guide, setGuide] = useState(false)
  if (installed) return null

  const install = async () => {
    if (deferred) {
      await deferred.prompt()
      const { outcome } = await deferred.userChoice
      usePwa.setState({ deferred: null })
      if (outcome === 'dismissed') toast.ok('Bisa dipasang kapan saja dari menu ini')
      return
    }
    setGuide(true)
  }

  return (
    <>
      <button onClick={install} className={cn('press flex w-full items-center gap-3 rounded-md bg-kelp-950 p-3.5 text-left text-white', className)}>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-sun-500 text-kelp-950">
          <Icon name="arrow-down-left" size={20} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold">Pasang aplikasi ARTANAYA</span>
          {!compact && <span className="block text-2xs text-kelp-300">Buka dari layar utama HP, layar penuh, tetap jalan saat sinyal lemah</span>}
        </span>
        <Icon name="caret-right" size={18} className="text-white/60" />
      </button>

      <BottomSheet open={guide} onOpenChange={setGuide} title="Pasang ke layar utama" description={isIos() ? 'Di iPhone/iPad, pasang lewat Safari:' : 'Browser ini belum menawarkan pemasangan otomatis. Pasang lewat menu browser:'}>
        <ol className="flex flex-col gap-3 text-sm">
          {(isIos()
            ? ['Buka halaman ini di Safari', 'Ketuk tombol Bagikan (kotak dengan panah ke atas)', 'Pilih “Tambah ke Layar Utama”', 'Ketuk “Tambah” — ikon ARTANAYA muncul di layar utama']
            : ['Buka halaman ini di Chrome', 'Ketuk menu ⋮ di kanan atas', 'Pilih “Instal aplikasi” atau “Tambahkan ke layar utama”', 'Konfirmasi — ikon ARTANAYA muncul di layar utama']
          ).map((t, i) => (
            <li key={t} className="flex items-center gap-3">
              <span className="num flex size-8 shrink-0 items-center justify-center rounded-full bg-kelp-950 text-sm font-semibold text-sun-500">{i + 1}</span>
              {t}
            </li>
          ))}
        </ol>
        <Button block className="mt-5" onClick={() => setGuide(false)}>
          Mengerti
        </Button>
      </BottomSheet>
    </>
  )
}
