import { useId, useState, type InputHTMLAttributes, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { BottomSheet, Button, Icon, LogoMark, Reveal, Segmented, type IconName } from '@/design'
import { useBoot } from '@/app/RoleShell'
import { DEMO_PASSWORD, useStore } from '@/data/store'
import { DEMO } from '@/data/seed'
import { useSyncStatus } from '@/data/sync'
import type { Role } from '@/data/types'
import { cn } from '@/lib/cn'
import { openWa } from '@/lib/wa'
import { toast } from '@/app/toast'

/* ---------- Kerangka: kepala hitam dengan "tetesan" yang meleleh ke latar sage ---------- */

function Drips() {
  return (
    <svg aria-hidden viewBox="0 0 400 90" preserveAspectRatio="none" className="absolute inset-x-0 top-full -mt-px h-[72px] w-full origin-top text-kelp-950 drop-shadow-[0_10px_12px_rgb(7_8_6/0.18)] animate-[drip_5s_ease-in-out_infinite_alternate]">
      <path
        fill="currentColor"
        d="M0 0H400V34C392 34 386 46 380 58C372 74 352 76 346 60C340 44 333 30 316 32C298 34 296 72 274 76C252 80 248 48 234 40C220 32 208 50 199 60C186 74 162 74 156 56C150 38 142 26 124 30C106 34 104 66 86 70C66 74 62 44 50 36C36 26 18 44 0 38Z"
      />
    </svg>
  )
}

function AuthShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#bccbb2]">
      <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col overflow-hidden bg-paper">
        <header className="relative z-10 bg-kelp-950 px-6 pb-8 pt-10 text-center text-white">
          <span className="mx-auto mb-4 block w-fit rounded-full bg-white/10 p-1.5 ring-1 ring-sun-500/40 animate-[pop_.5s_var(--ease-out-soft)_both]">
            <LogoMark size={44} />
          </span>
          <h1 className="text-[28px] font-semibold tracking-tight animate-[rise_.45s_var(--ease-out-soft)_both]">{title}</h1>
          <Drips />
        </header>
        <main className="flex flex-1 flex-col px-7 pb-8 pt-24">{children}</main>
      </div>
    </div>
  )
}

/* ---------- Input bergaris bawah (gaya referensi) ---------- */

function LineField({ icon, label, error, trailing, ...rest }: InputHTMLAttributes<HTMLInputElement> & { icon: IconName; label: string; error?: string; trailing?: ReactNode }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className={cn('flex h-12 items-center gap-3 border-b-2 transition-colors focus-within:border-kelp-950', error ? 'border-coral-600' : 'border-kelp-950/20')}>
        <Icon name={icon} size={20} className="shrink-0 text-ink-muted" />
        <input id={id} placeholder={label} aria-invalid={error ? true : undefined} {...rest} className="h-full w-full min-w-0 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-faint" />
        {trailing}
      </div>
      {error && <p className="mt-1 text-2xs text-coral-700">{error}</p>}
    </div>
  )
}

function PasswordField({ value, onChange, label = 'Kata sandi', error }: { value: string; onChange: (v: string) => void; label?: string; error?: string }) {
  const [show, setShow] = useState(false)
  return (
    <LineField
      icon="lock"
      label={label}
      type={show ? 'text' : 'password'}
      autoComplete="current-password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={error}
      trailing={
        <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'} className="press shrink-0 rounded-full p-1 text-ink-muted hover:text-ink">
          <Icon name={show ? 'eye-slash' : 'eye'} size={20} />
        </button>
      }
    />
  )
}

/* ---------- Akun demo: sekali ketuk langsung masuk ---------- */

const demos: { role: Role; userId: string; label: string; photo?: string; icon: IconName }[] = [
  { role: 'nelayan', userId: DEMO.nelayan, label: 'Nelayan', photo: '/avatars/davin.webp', icon: 'plant' },
  { role: 'investor', userId: DEMO.investor, label: 'Investor', photo: '/avatars/li-chiang.png', icon: 'chart-bar' },
  { role: 'admin', userId: DEMO.admin, label: 'Admin', icon: 'clipboard-check' },
]

function DemoAccounts() {
  const ready = useBoot()
  const login = useStore((s) => s.login)
  const users = useStore((s) => s.users)
  const reset = useStore((s) => s.resetDemo)
  const sync = useSyncStatus((s) => s.status)
  const nav = useNavigate()
  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center gap-3 text-2xs text-ink-muted">
        <span className="h-px flex-1 bg-kelp-950/15" />
        atau masuk cepat dengan akun demo
        <span className="h-px flex-1 bg-kelp-950/15" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {demos.map((d, i) => {
          const u = users.find((x) => x.id === d.userId)
          return (
            <Reveal key={d.role} i={i + 3}>
              <button
                disabled={!ready}
                onClick={() => {
                  login(d.userId)
                  nav(`/${d.role}`)
                }}
                className="press flex w-full flex-col items-center gap-2 rounded-md bg-surface px-2 py-4 hover:shadow-soft disabled:opacity-50"
              >
                {d.photo ? (
                  <img src={d.photo} alt="" className="size-14 rounded-full object-cover object-[50%_22%] ring-2 ring-sun-500" />
                ) : (
                  <span className="flex size-14 items-center justify-center rounded-full bg-kelp-950 text-sun-500 ring-2 ring-sun-500">
                    <Icon name={d.icon} size={24} />
                  </span>
                )}
                <span className="w-full truncate text-center text-sm font-semibold">{u?.name.split(' ').slice(0, 2).join(' ') ?? d.label}</span>
                <span className="rounded-full bg-kelp-950 px-2.5 py-0.5 text-[11px] font-medium text-white">{d.label}</span>
              </button>
            </Reveal>
          )
        })}
      </div>
      <p className="mt-5 flex items-center justify-center gap-1.5 text-2xs text-ink-muted">
        <span className={`size-2 rounded-full ${sync === 'online' ? 'bg-kelp-500' : sync === 'connecting' ? 'bg-sun-500' : 'bg-ink-faint'}`} />
        {sync === 'online' ? 'Tersambung Supabase · data bersama real-time' : sync === 'connecting' ? 'Menyambung ke server…' : 'Mode lokal · data di perangkat ini'}
      </p>
      <button
        onClick={async () => {
          await reset()
          toast.ok('Data demo dikembalikan ke awal')
        }}
        className="press mx-auto mt-2 block rounded-full px-4 py-2 text-2xs font-semibold text-ink-muted hover:bg-white/60"
      >
        Reset data demo
      </button>
    </section>
  )
}

function Disclaimer() {
  return <p className="mt-auto pt-6 text-center text-[11px] leading-relaxed text-ink-faint">Prototipe lomba — bukan layanan urun dana berizin OJK. Seluruh data dan transaksi adalah simulasi.</p>
}

/* ---------- Masuk ---------- */

export function SignIn() {
  const nav = useNavigate()
  const ready = useBoot()
  const loginWithPassword = useStore((s) => s.loginWithPassword)
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [forgot, setForgot] = useState(false)

  const submit = () => {
    try {
      const u = loginWithPassword(id, pw)
      toast.ok(`Selamat datang kembali, ${u.name.split(' ')[0]}!`)
      nav(`/${u.role}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal masuk')
    }
  }

  return (
    <AuthShell title="Masuk">
      <Reveal i={1}>
        <h2 className="text-center text-[22px] font-semibold text-ink">Selamat datang kembali!</h2>
        <p className="mt-1 text-center text-2xs text-ink-muted">Modal syariah untuk usaha pesisir</p>
      </Reveal>

      <Reveal i={2}>
        <form
          className="mt-8 flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
        >
          <LineField icon="user" label="Nama, nomor HP, atau email" autoComplete="username" value={id} onChange={(e) => { setId(e.target.value); setError(null) }} />
          <PasswordField value={pw} onChange={(v) => { setPw(v); setError(null) }} />
          <div className="flex items-center justify-between text-2xs">
            <label className="flex cursor-pointer items-center gap-2 text-ink-muted">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="size-4 accent-[var(--color-kelp-950)]" />
              Ingat saya
            </label>
            <button type="button" onClick={() => setForgot(true)} className="font-semibold text-ink hover:underline">
              Lupa kata sandi?
            </button>
          </div>
          {error && <p className="rounded-sm bg-coral-100 px-3 py-2 text-2xs text-coral-700" role="alert">{error}</p>}
          <Button type="submit" block variant="secondary" disabled={!ready || !id.trim() || !pw}>
            Masuk
          </Button>
          <p className="text-center text-2xs text-ink-muted">
            Belum punya akun?{' '}
            <Link to="/daftar" className="font-semibold text-ink underline underline-offset-2">
              Daftar
            </Link>
          </p>
          <p className="text-center text-[11px] text-ink-faint">
            Uji coba: <b>davin</b>, <b>lichiang</b>, atau <b>admin</b> · sandi <b>{DEMO_PASSWORD}</b>
          </p>
        </form>
      </Reveal>

      <DemoAccounts />
      <Disclaimer />

      <BottomSheet open={forgot} onOpenChange={setForgot} title="Lupa kata sandi?" description="Tim pusat bantuan akan membantu memulihkan akun lewat WhatsApp.">
        <div className="flex flex-col gap-3">
          <Button
            block
            icon="whatsapp"
            onClick={() => openWa(`Halo tim ARTANAYA, saya lupa kata sandi akun saya${id ? ` (${id})` : ''}. Mohon bantu memulihkan akun.`)}
          >
            Hubungi via WhatsApp
          </Button>
          <p className="text-center text-2xs text-ink-muted">Pesan sudah terisi, Anda yang menekan kirim.</p>
        </div>
      </BottomSheet>
    </AuthShell>
  )
}

/* ---------- Daftar ---------- */

export function SignUp() {
  const nav = useNavigate()
  const ready = useBoot()
  const register = useStore((s) => s.registerUser)
  const [role, setRole] = useState<'nelayan' | 'investor'>('investor')
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [location, setLocation] = useState('')
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [touched, setTouched] = useState(false)

  const contactOk = contact.includes('@') ? /^\S+@\S+\.\S+$/.test(contact) : contact.replace(/\D/g, '').length >= 10
  const errors = {
    name: name.trim().length < 2 ? 'Isi nama lengkap' : undefined,
    contact: !contactOk ? 'Isi nomor HP (min. 10 digit) atau email yang valid' : undefined,
    pw: pw.length < 8 ? 'Minimal 8 karakter' : undefined,
    pw2: pw2 !== pw ? 'Kata sandi tidak sama' : undefined,
  }
  const valid = !Object.values(errors).some(Boolean)

  return (
    <AuthShell title="Daftar">
      <Reveal i={1}>
        <h2 className="text-center text-[22px] font-semibold text-ink">Hai, selamat datang!</h2>
        <p className="mt-1 text-center text-2xs text-ink-muted">Buat akun untuk mulai bergabung</p>
      </Reveal>

      <Reveal i={2}>
        <form
          className="mt-7 flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault()
            setTouched(true)
            if (!valid) return
            const u = register({ name, contact, role, location })
            toast.ok(`Akun dibuat. Selamat datang, ${u.name.split(' ')[0]}!`)
            nav(`/${u.role}`)
          }}
        >
          <Segmented
            label="Daftar sebagai"
            value={role}
            onChange={(v) => setRole(v as 'nelayan' | 'investor')}
            options={[
              { value: 'investor', label: 'Investor' },
              { value: 'nelayan', label: 'Nelayan' },
            ]}
          />
          <LineField icon="user" label="Nama lengkap" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} error={touched ? errors.name : undefined} />
          <LineField icon="whatsapp" label="Nomor HP atau email" autoComplete="email" value={contact} onChange={(e) => setContact(e.target.value)} error={touched ? errors.contact : undefined} />
          <LineField icon="map-pin" label={role === 'nelayan' ? 'Desa / kecamatan pesisir' : 'Kota domisili'} value={location} onChange={(e) => setLocation(e.target.value)} />
          <PasswordField value={pw} onChange={setPw} label="Kata sandi (min. 8 karakter)" error={touched ? errors.pw : undefined} />
          <PasswordField value={pw2} onChange={setPw2} label="Ulangi kata sandi" error={touched ? errors.pw2 : undefined} />
          <Button type="submit" block variant="secondary" disabled={!ready}>
            Daftar
          </Button>
          <p className="text-center text-2xs text-ink-muted">
            Sudah punya akun?{' '}
            <Link to="/" className="font-semibold text-ink underline underline-offset-2">
              Masuk
            </Link>
          </p>
        </form>
      </Reveal>
      <Disclaimer />
    </AuthShell>
  )
}
