import { InstallAppCard } from '@/app/pwa'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Badge, Button, Card, Divider, HeroCard, Icon, ListRow, Panel, Reveal, TextField, TopBar } from '@/design'
import { DEFAULT_PREFS, investorReturns, useMe, useStore, walletOf } from '@/data/store'
import type { Role, UserPrefs } from '@/data/types'
import { formatDate, formatRupiahShort } from '@/lib/format'
import { openWa } from '@/lib/wa'
import { toast } from '@/app/toast'
import { Toggle } from '../nelayan/SubmitProject'
import { Avatar, PageHeader } from '../shared'

const ROLE_LABEL: Record<Role, string> = { nelayan: 'Nelayan · Pembudidaya', investor: 'Investor ritel', admin: 'Admin pengelola' }

function usePrefs() {
  const me = useMe()!
  return { ...DEFAULT_PREFS, ...me.prefs }
}

/* ---------- Beranda profil ---------- */
export function ProfileHome() {
  const me = useMe()!
  const nav = useNavigate()
  const logout = useStore((s) => s.logout)
  const state = useStore((s) => s)
  const base = `/${me.role}/profil`

  const stats: [string, string][] =
    me.role === 'nelayan'
      ? [
          ['Proyek', String(state.projects.filter((p) => p.ownerId === me.id).length)],
          ['Dana diterima', formatRupiahShort(walletOf(state.ledger, me.name).received)],
          ['Skor terakhir', String(state.projects.find((p) => p.ownerId === me.id)?.score.score ?? '-')],
        ]
      : me.role === 'investor'
        ? [
            ['Proyek didanai', String(new Set(state.investments.filter((i) => i.investorId === me.id).map((i) => i.projectId)).size)],
            ['Total investasi', formatRupiahShort(state.investments.filter((i) => i.investorId === me.id).reduce((a, i) => a + i.amount, 0))],
            ['Bagi hasil', formatRupiahShort(investorReturns(state, me.id))],
          ]
        : [
            ['Antrean', String(state.projects.filter((p) => p.status === 'review').length)],
            ['Peringatan', String(state.alerts.filter((a) => a.status === 'open').length)],
            ['Blok ledger', String(state.ledger.length)],
          ]

  const helpMsg =
    me.role === 'nelayan'
      ? `Halo Mas ${me.facilitator?.name.split(' ')[0] ?? 'fasilitator'}, saya ${me.name} (nelayan ARTANAYA, ${me.location}). Saya butuh bantuan soal: `
      : me.role === 'investor'
        ? `Halo tim ARTANAYA, saya ${me.name} (investor). Saya ingin bertanya tentang: `
        : `Halo fasilitator, saya ${me.name} dari tim pengelola ARTANAYA. Mohon bantuan untuk: `

  return (
    <div className="pb-8">
      <PageHeader title="Profil" />
      <div className="flex flex-col gap-5 px-5 pt-3">
        <HeroCard>
          <div className="flex items-center gap-4">
            <Avatar initials={me.initials} photo={me.photo} size={64} />
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold">{me.name}</p>
              <p className="truncate text-2xs text-kelp-300">{ROLE_LABEL[me.role]}</p>
              <div className="mt-2">
                <Badge tone="onDark" icon="verified">
                  Terverifikasi
                </Badge>
              </div>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
            {stats.map(([k, v]) => (
              <div key={k}>
                <p className="num text-base font-semibold">{v}</p>
                <p className="text-[11px] text-kelp-300">{k}</p>
              </div>
            ))}
          </div>
        </HeroCard>

        <Reveal i={1}>
          <Panel>
            <ListRow icon="identification-card" title="Data diri" subtitle={`${me.phone !== '-' ? me.phone : 'Lengkapi nomor HP'} · ${me.location}`} chevron onClick={() => nav(`${base}/data`)} />
            <Divider />
            <ListRow icon="shield-check" title="Keamanan akun" subtitle="Verifikasi 2 langkah, perangkat, aktivitas" chevron onClick={() => nav(`${base}/keamanan`)} />
            <Divider />
            <ListRow icon="gear" title="Pengaturan" subtitle="Notifikasi, tampilan, data demo" chevron onClick={() => nav(`${base}/pengaturan`)} />
            <Divider />
            <ListRow icon="whatsapp" iconTone="kelp" title="Bantuan via WhatsApp" subtitle="Pesan otomatis terisi, Anda yang menekan kirim" chevron onClick={() => openWa(helpMsg)} />
          </Panel>
        </Reveal>

        <Reveal i={2}>
          <Panel>
            <ListRow icon="scan-face" iconTone="tide" title="Verifikasi biometrik" subtitle="Segera hadir — diputuskan di tahap akhir" trailing={<Badge tone="neutral">Segera</Badge>} />
          </Panel>
        </Reveal>

        <Button
          variant="ghost"
          icon="sign-out"
          className="text-coral-700"
          onClick={() => {
            logout()
            nav('/', { replace: true })
          }}
        >
          Keluar
        </Button>
      </div>
    </div>
  )
}

/* ---------- Data diri ---------- */
export function ProfileData() {
  const me = useMe()!
  const nav = useNavigate()
  const update = useStore((s) => s.updateProfile)
  const [form, setForm] = useState({
    name: me.name,
    phone: me.phone === '-' ? '' : me.phone,
    email: me.email ?? '',
    location: me.location,
    kusuka: me.kusuka ?? '',
    kub: me.kub ?? '',
  })
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value })
  const phoneOk = form.phone.replace(/\D/g, '').length >= 10
  const valid = form.name.trim().length >= 2 && phoneOk && form.location.trim().length >= 3

  return (
    <div className="pb-8">
      <TopBar title="Data diri" subtitle="Dipakai untuk akad & verifikasi" onBack={() => nav(-1)} />
      <div className="flex flex-col gap-4 px-5">
        <div className="flex justify-center py-2">
          <Avatar initials={me.initials} photo={me.photo} size={88} />
        </div>
        <TextField label="Nama lengkap" value={form.name} onChange={set('name')} />
        <TextField label="Nomor HP / WhatsApp" inputMode="tel" value={form.phone} onChange={set('phone')} error={form.phone && !phoneOk ? 'Minimal 10 digit' : undefined} />
        <TextField label="Email" type="email" value={form.email} onChange={set('email')} placeholder="opsional" />
        <TextField label="Alamat / lokasi usaha" icon="map-pin" value={form.location} onChange={set('location')} />
        {me.role === 'nelayan' && (
          <>
            <TextField label="Nomor KUSUKA" icon="identification-card" value={form.kusuka} onChange={set('kusuka')} hint="Kartu Pelaku Usaha Kelautan dan Perikanan" />
            <TextField label="Koperasi / KUB" value={form.kub} onChange={set('kub')} />
          </>
        )}
        <p className="text-2xs text-ink-muted">Bergabung sejak {formatDate(me.joinedAt)}</p>
        <Button
          block
          disabled={!valid}
          onClick={() => {
            update({ ...form, phone: form.phone.trim(), email: form.email.trim() || undefined, kusuka: form.kusuka || undefined, kub: form.kub || undefined })
            toast.ok('Data diri tersimpan')
            nav(-1)
          }}
        >
          Simpan Perubahan
        </Button>
      </div>
    </div>
  )
}

/* ---------- Keamanan akun ---------- */
export function ProfileSecurity() {
  const me = useMe()!
  const nav = useNavigate()
  const prefs = usePrefs()
  const updatePrefs = useStore((s) => s.updatePrefs)
  const locked = useStore((s) => s.selfLocked)
  const setLock = useStore((s) => s.setSelfLock)
  const events = useStore((s) => s.securityEvents).filter((e) => e.userId === me.id).slice(0, 5)
  const toggle = (k: keyof UserPrefs, on: string, off: string) => (v: boolean) => {
    updatePrefs({ [k]: v })
    toast.ok(v ? on : off)
  }

  return (
    <div className="pb-8">
      <TopBar title="Keamanan akun" subtitle="Prinsip zero-trust" onBack={() => nav(-1)} />
      <div className="flex flex-col gap-4 px-5">
        <Toggle checked={prefs.twoStep} onChange={toggle('twoStep', 'Verifikasi 2 langkah aktif', 'Verifikasi 2 langkah dimatikan')} title="Verifikasi 2 langkah" desc="Kode OTP WhatsApp setiap masuk dari perangkat baru" />
        <Toggle checked={prefs.loginAlert} onChange={toggle('loginAlert', 'Peringatan login aktif', 'Peringatan login dimatikan')} title="Peringatan login baru" desc="Kabari saya bila akun dibuka di perangkat lain" />
        {me.role === 'investor' && (
          <Toggle
            checked={locked}
            onChange={(v) => {
              setLock(v)
              toast.ok(v ? 'Akun dikunci. Transfer ditahan.' : 'Kunci dibuka.')
            }}
            title="Kunci mandiri (self-lock)"
            desc="Tahan semua transfer keluar sementara"
          />
        )}

        <section>
          <h2 className="mb-2 mt-2 text-sm font-semibold text-ink-muted">Perangkat aktif</h2>
          <Panel>
            <ListRow icon="shield-check" iconTone="kelp" title="Perangkat ini" subtitle="Aktif sekarang" trailing={<Badge tone="kelp">Ini</Badge>} />
            <Divider />
            <ListRow icon="identification-card" title={me.role === 'admin' ? 'Laptop kantor · Chrome' : 'Android · Chrome'} subtitle="Terakhir aktif 2 hari lalu" />
          </Panel>
          <Button
            variant="ghost"
            size="sm"
            className="mt-3"
            icon="sign-out"
            onClick={() => toast.ok('Semua perangkat lain sudah dikeluarkan')}
          >
            Keluarkan perangkat lain
          </Button>
        </section>

        {events.length > 0 && (
          <section>
            <h2 className="mb-2 mt-2 text-sm font-semibold text-ink-muted">Aktivitas keamanan terbaru</h2>
            <Panel>
              {events.map((e, i) => (
                <div key={e.id}>
                  {i > 0 && <Divider />}
                  <ListRow icon={e.outcome === 'diblokir' ? 'warning' : 'shield-check'} iconTone={e.outcome === 'diblokir' ? 'coral' : 'plain'} title={e.title} subtitle={`${e.detail} · ${formatDate(e.createdAt)}`} />
                </div>
              ))}
            </Panel>
          </section>
        )}

        <Panel>
          <ListRow icon="scan-face" iconTone="tide" title="Verifikasi biometrik" subtitle="Segera hadir" trailing={<Badge tone="neutral">Segera</Badge>} />
        </Panel>
      </div>
    </div>
  )
}

/* ---------- Pengaturan ---------- */
export function ProfileSettings() {
  const nav = useNavigate()
  const prefs = usePrefs()
  const updatePrefs = useStore((s) => s.updatePrefs)
  const reset = useStore((s) => s.resetDemo)

  return (
    <div className="pb-8">
      <TopBar title="Pengaturan" onBack={() => nav(-1)} />
      <div className="flex flex-col gap-4 px-5">
        <h2 className="text-sm font-semibold text-ink-muted">Notifikasi</h2>
        <Toggle checked={prefs.notifWhatsapp} onChange={(v) => { updatePrefs({ notifWhatsapp: v }); toast.ok(v ? 'Notifikasi WhatsApp aktif' : 'Notifikasi WhatsApp dimatikan') }} title="Kabar lewat WhatsApp" desc="Jatuh tempo, pencairan, bagi hasil" />
        <Toggle checked={prefs.notifPush} onChange={(v) => { updatePrefs({ notifPush: v }); toast.ok(v ? 'Notifikasi aplikasi aktif' : 'Notifikasi aplikasi dimatikan') }} title="Notifikasi di aplikasi" desc="Tampilkan tanda di ikon lonceng" />

        <h2 className="mt-2 text-sm font-semibold text-ink-muted">Tampilan</h2>
        <Toggle checked={prefs.hideBalance} onChange={(v) => { updatePrefs({ hideBalance: v }); toast.ok(v ? 'Saldo disembunyikan' : 'Saldo ditampilkan') }} title="Sembunyikan saldo" desc="Nominal di kartu utama diganti •••" />
        <Card className="flex items-center justify-between p-4">
          <span>
            <span className="block font-semibold">Bahasa</span>
            <span className="text-2xs text-ink-muted">Bahasa Indonesia</span>
          </span>
          <Icon name="check" className="text-sun-600" />
        </Card>

        <h2 className="mt-2 text-sm font-semibold text-ink-muted">Aplikasi</h2>
        <InstallAppCard />

        <h2 className="mt-2 text-sm font-semibold text-ink-muted">Data demo</h2>
        <Card className="p-4">
          <p className="text-sm text-ink-muted">Kembalikan semua proyek, transaksi, forum, dan notifikasi ke kondisi awal untuk semua perangkat.</p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-3"
            icon="waves"
            onClick={async () => {
              await reset()
              toast.ok('Data demo dikembalikan ke awal')
            }}
          >
            Reset data demo
          </Button>
        </Card>

        <Card className="p-4 text-2xs leading-relaxed text-ink-muted">
          <p className="font-semibold text-ink">ARTANAYA · prototipe v0.6</p>
          Prototipe lomba — bukan layanan urun dana berizin OJK. Seluruh data dan transaksi adalah simulasi.
        </Card>
      </div>
    </div>
  )
}

/** Format nominal yang menghormati pengaturan "Sembunyikan saldo". */
export function useMoney() {
  const me = useMe()
  const hide = me?.prefs?.hideBalance
  return (fmt: (n: number) => string) => (n: number) => (hide ? 'Rp ••••••' : fmt(n))
}
