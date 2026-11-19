import { useNavigate } from 'react-router'
import { Button, Icon, Wordmark, type IconName } from '@/design'
import { useBoot } from '@/app/RoleShell'
import { useStore } from '@/data/store'
import { DEMO } from '@/data/seed'
import { useSyncStatus } from '@/data/sync'
import { toast } from '@/app/toast'
import type { Role } from '@/data/types'

const accounts: { role: Role; userId: string; name: string; desc: string; icon: IconName }[] = [
  { role: 'nelayan', userId: DEMO.nelayan, name: 'Pak Rudi · Nelayan', desc: 'Pembudidaya rumput laut, Lombok Tengah. Ajukan modal, lihat skor, cairkan dana.', icon: 'plant' },
  { role: 'investor', userId: DEMO.investor, name: 'Dedi · Investor', desc: 'Investor ritel, Bogor. Telusuri proyek, danai mulai Rp50.000, pantau keamanan.', icon: 'chart-bar' },
  { role: 'admin', userId: DEMO.admin, name: 'Admin Pengelola', desc: 'Verifikasi pengajuan, audit ledger smart contract, tindak lanjuti radar penipuan.', icon: 'clipboard-check' },
]

export function Splash() {
  const ready = useBoot()
  const login = useStore((s) => s.login)
  const reset = useStore((s) => s.resetDemo)
  const nav = useNavigate()
  const sync = useSyncStatus((s) => s.status)

  return (
    <div className="min-h-dvh bg-kelp-950">
      <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col">
        <section className="paper-grain relative overflow-hidden bg-kelp-900 px-6 pb-14 pt-14 text-paper">
          <svg aria-hidden viewBox="0 0 400 200" className="absolute inset-x-0 bottom-0 w-full text-kelp-700/70" fill="none" stroke="currentColor" strokeWidth="1.3">
            {[0, 16, 32, 48, 64, 80].map((y) => (
              <path key={y} d={`M-10 ${90 + y} C 70 ${70 + y}, 130 ${112 + y}, 210 ${90 + y} S 340 ${70 + y}, 410 ${92 + y}`} />
            ))}
          </svg>
          <div className="relative">
            <Wordmark tone="paper" className="text-[26px]" />
            <h1 className="mt-10 text-[34px] font-extrabold leading-[1.08] tracking-tight">
              Modal syariah
              <br />
              untuk usaha{' '}
              <em className="font-serif text-[1.12em] font-normal italic text-sun-300">pesisir.</em>
            </h1>
            <p className="mt-4 max-w-[34ch] text-[15px] text-kelp-200">
              Nelayan dinilai dari hasil tangkapan dan catatan usahanya, bukan agunan. Investor ikut mendanai dengan akad mudharabah yang tercatat transparan.
            </p>
          </div>
        </section>

        <section className="relative -mt-6 flex-1 rounded-t-lg bg-paper px-5 pb-8 pt-6">
          <p className="text-sm font-semibold text-ink-muted">Masuk sebagai akun demo</p>
          <ul className="mt-3 flex flex-col gap-3">
            {accounts.map((a) => (
              <li key={a.role}>
                <button
                  disabled={!ready}
                  onClick={() => {
                    login(a.userId)
                    nav(`/${a.role}`)
                  }}
                  className="flex w-full items-center gap-4 rounded-md border border-line bg-surface p-4 text-left transition-colors hover:border-kelp-300 hover:bg-white disabled:opacity-50"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-kelp-100 text-kelp-700">
                    <Icon name={a.icon} size={24} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold text-ink">{a.name}</span>
                    <span className="mt-0.5 block text-sm leading-snug text-ink-muted">{a.desc}</span>
                  </span>
                  <Icon name="caret-right" className="text-ink-faint" />
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-md bg-tide-100 p-4 text-sm text-tide-600">
            <p className="flex items-center gap-1.5 font-bold">
              <Icon name="info" size={20} /> Tips demo
            </p>
            <p className="mt-1">
              {sync === 'online'
                ? 'Data tersambung ke server: buka akun Nelayan di HP dan akun Admin di laptop, perubahan muncul seketika di keduanya.'
                : 'Buka dua tab (misal Nelayan dan Admin) berdampingan: data tersinkron otomatis, pengajuan baru langsung muncul di antrean admin.'}
            </p>
          </div>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-2xs text-ink-muted">
            <span className={`size-2 rounded-full ${sync === 'online' ? 'bg-kelp-500' : sync === 'connecting' ? 'bg-sun-500' : 'bg-ink-faint'}`} />
            {sync === 'online' ? 'Tersambung Supabase · data bersama real-time' : sync === 'connecting' ? 'Menyambung ke server…' : 'Mode lokal · data di perangkat ini'}
          </p>

          <Button
            variant="quiet"
            className="mt-4 w-full"
            icon="waves"
            onClick={async () => {
              await reset()
              toast.ok('Data demo dikembalikan ke awal')
            }}
          >
            Reset data demo
          </Button>

          <p className="mt-6 text-center text-2xs text-ink-faint">Prototipe lomba — bukan layanan urun dana berizin OJK. Seluruh data dan transaksi adalah simulasi.</p>
        </section>
      </div>
    </div>
  )
}
