import { useNavigate } from 'react-router'
import { Button, HeroCard, Icon, Reveal, Wordmark, type IconName } from '@/design'
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
    <div className="min-h-dvh bg-[#bccbb2]">
      <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-paper px-5 pb-8 pt-8">
        <div className="flex items-center justify-between animate-[rise_.4s_var(--ease-out-soft)_both]">
          <Wordmark />
          <span className="rounded-full bg-white px-3 py-1.5 text-2xs font-medium text-ink">Prototipe</span>
        </div>

        <HeroCard className="mt-6" side={<Icon name="arrow-down-left" size={24} />}>
          <p className="text-2xs text-kelp-300">Securities crowdfunding syariah</p>
          <h1 className="mt-2 text-[28px] font-semibold leading-[1.12] tracking-tight">
            Modal syariah untuk usaha <span className="text-sun-500">pesisir.</span>
          </h1>
          <p className="mt-3 text-2xs leading-relaxed text-white/75">
            Nelayan dinilai dari hasil tangkapan dan catatan usahanya, bukan agunan. Investor mendanai lewat akad mudharabah yang tercatat transparan.
          </p>
        </HeroCard>

        <section className="mt-7 flex-1">
          <h2 className="text-[17px] font-semibold text-ink">Masuk sebagai akun demo</h2>
          <ul className="mt-3 flex flex-col gap-3">
            {accounts.map((a, i) => (
              <li key={a.role}>
              <Reveal i={i + 2}>
                <button
                  disabled={!ready}
                  onClick={() => {
                    login(a.userId)
                    nav(`/${a.role}`)
                  }}
                  className="flex w-full items-center gap-4 press rounded-md bg-surface p-4 text-left hover:shadow-soft hover:bg-white disabled:opacity-50"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-kelp-950 text-white">
                    <Icon name={a.icon} size={24} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-ink">{a.name}</span>
                    <span className="mt-0.5 block text-2xs leading-snug text-ink-muted">{a.desc}</span>
                  </span>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sun-500 text-kelp-950">
                    <Icon name="caret-right" size={18} />
                  </span>
                </button>
              </Reveal>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-md bg-surface p-4 text-sm text-ink">
            <p className="flex items-center gap-1.5 font-semibold">
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
