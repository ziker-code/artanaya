import { useNavigate } from 'react-router'
import { Button, Card, Divider, ListRow } from '@/design'
import { useMe, useStore } from '@/data/store'
import { Avatar, PageHeader } from '../shared'

const faq = [
  ['Apa itu akad mudharabah?', 'Kerja sama usaha: investor memberi modal, Bapak mengelola usaha. Keuntungan dibagi sesuai nisbah yang disepakati di awal. Bila rugi bukan karena kelalaian, kerugian modal ditanggung investor.'],
  ['Kenapa dana dicairkan bertahap?', 'Supaya dana dipakai sesuai rencana. Setiap tahap terbuka setelah laporan progres tahap sebelumnya dikirim.'],
  ['Skor saya rendah, apakah ditolak?', 'Tidak. Skor di bawah 50 berarti perlu pembinaan. Fasilitator akan membantu melengkapi data, lalu proyek bisa diajukan ulang.'],
  ['Dari mana skor dihitung?', 'Dari 5 data: transaksi Dompetku, hasil panen/tangkapan, keanggotaan koperasi, dokumen legalitas, dan riwayat akad di ARTANAYA. Tidak perlu agunan.'],
]

export function NelayanHelp() {
  const me = useMe()!
  const f = me.facilitator
  return (
    <div className="pb-8">
      <PageHeader title="Bantuan" />
      <div className="flex flex-col gap-5 px-5 pt-3">
        {f && (
          <Card className="p-5">
            <p className="text-sm text-ink-muted">Fasilitator digital Bapak</p>
            <p className="mt-1 text-lg font-bold">{f.name}</p>
            <p className="text-sm text-ink-muted">{f.org}</p>
            <a href={`https://wa.me/${f.phone}?text=${encodeURIComponent('Halo Mas, saya butuh bantuan di ARTANAYA.')}`} target="_blank" rel="noreferrer" className="mt-4 block">
              <Button block variant="secondary" icon="whatsapp">
                Chat lewat WhatsApp
              </Button>
            </a>
          </Card>
        )}
        <section>
          <h2 className="mb-2 text-lg font-bold">Pertanyaan umum</h2>
          <div className="flex flex-col gap-2">
            {faq.map(([q, a]) => (
              <details key={q} className="group rounded-md border border-line bg-surface p-4 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold">
                  {q}
                  <span className="text-ink-faint transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export function ProfileCommon() {
  const me = useMe()!
  const logout = useStore((s) => s.logout)
  const nav = useNavigate()
  return (
    <div className="pb-8">
      <PageHeader title="Profil" />
      <div className="flex flex-col gap-5 px-5 pt-3">
        <Card className="flex items-center gap-4 p-5">
          <Avatar initials={me.initials} />
          <div className="min-w-0">
            <p className="text-lg font-bold">{me.name}</p>
            <p className="truncate text-sm text-ink-muted">{me.location}</p>
          </div>
        </Card>
        <Card className="px-4">
          <ListRow icon="identification-card" title="Data diri & verifikasi" subtitle="Terverifikasi biometrik" />
          <Divider />
          <ListRow icon="shield-check" title="Keamanan akun" subtitle="Zero-trust · perangkat dikenali" />
          <Divider />
          <ListRow icon="gear" title="Pengaturan" subtitle="Bahasa Indonesia · notifikasi WhatsApp" />
        </Card>
        <Button
          variant="ghost"
          icon="sign-out"
          className="border-coral-100 text-coral-700"
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
