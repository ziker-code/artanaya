import { useState } from 'react'
import { Card, Icon, Segmented } from '@/design'
import { PageHeader } from '../shared'

const posts = [
  { who: 'Nicholas J.', role: 'Investor', tag: 'Pengalaman', title: 'Pengalaman 3 bulan mendanai budidaya rumput laut', body: 'Laporan progres tiap tahap bikin tenang. Foto panen dikirim fasilitator langsung dari Gerupuk.', likes: 18, replies: 4 },
  { who: 'Siti Rahmawati', role: 'Nelayan', tag: 'Tanya jawab', title: 'Bagaimana kalau cuaca ekstrem saat musim tangkap?', body: 'Kapal kami sempat tidak melaut 9 hari. Apakah setoran bagi hasil bisa disesuaikan?', likes: 9, replies: 6 },
  { who: 'Dimas Pratama', role: 'Fasilitator', tag: 'Edukasi', title: 'Cara mencatat hasil panen yang rapi untuk skor', body: 'Timbang setelah kering, catat per tanggal, foto timbangan. Data ini masuk sinyal Produktivitas.', likes: 31, replies: 2 },
]

const articles = [
  ['Mengenal akad mudharabah dalam 3 menit', 'Akad · 3 mnt'],
  ['Kenapa nelayan dinilai tanpa agunan?', 'Skor AI · 4 mnt'],
  ['Hash chain: cara ledger membuktikan data tidak diubah', 'Teknologi · 5 mnt'],
  ['Mengenali modus penipuan “investasi bonus” di WhatsApp', 'Keamanan · 3 mnt'],
]

export function Community() {
  const [tab, setTab] = useState('forum')
  return (
    <div className="pb-8">
      <PageHeader eyebrow="Forum Bahari" title="Komunitas" />
      <div className="flex flex-col gap-4 px-5 pt-2">
        <Segmented label="Konten" value={tab} onChange={setTab} options={[{ value: 'forum', label: 'Forum Komunitas' }, { value: 'artikel', label: 'Artikel Edukasi' }]} />
        {tab === 'forum'
          ? posts.map((p) => (
              <Card key={p.title} className="p-4">
                <div className="mb-2 flex items-center gap-2 text-2xs">
                  <span className="flex size-8 items-center justify-center rounded-full bg-kelp-100 font-bold text-kelp-700">{p.who.split(' ').map((w) => w[0]).join('')}</span>
                  <span>
                    <b className="text-sm">{p.who}</b>
                    <span className="block text-ink-muted">{p.role}</span>
                  </span>
                  <span className="ml-auto rounded-full bg-paper-sunk px-2.5 py-1 font-semibold text-ink-muted">{p.tag}</span>
                </div>
                <p className="font-bold leading-snug">{p.title}</p>
                <p className="mt-1 text-sm text-ink-muted">{p.body}</p>
                <div className="mt-3 flex gap-4 text-2xs text-ink-muted">
                  <span>♥ {p.likes}</span>
                  <span className="flex items-center gap-1">
                    <Icon name="chats" size={16} /> {p.replies} balasan
                  </span>
                </div>
              </Card>
            ))
          : articles.map(([t, meta]) => (
              <Card key={t} className="flex items-center gap-3 p-4">
                <span className="flex size-10 items-center justify-center rounded-full bg-sun-100 text-sun-600">
                  <Icon name="file-text" size={20} />
                </span>
                <span className="flex-1">
                  <span className="block font-semibold leading-snug">{t}</span>
                  <span className="text-2xs text-ink-muted">{meta}</span>
                </span>
              </Card>
            ))}
      </div>
    </div>
  )
}
