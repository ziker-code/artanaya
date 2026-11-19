import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { BottomSheet, Button, Card, ChipRow, EmptyState, Icon, Panel, Reveal, Segmented, TextField, TopBar } from '@/design'
import { useMe, useStore } from '@/data/store'
import type { ForumThread } from '@/data/types'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/cn'
import { toast } from '@/app/toast'
import { PageHeader } from '../shared'

const TAGS = ['Tanya jawab', 'Pengalaman', 'Edukasi', 'Keamanan']

const articles = [
  ['Mengenal akad mudharabah dalam 3 menit', 'Akad · 3 mnt'],
  ['Kenapa nelayan dinilai tanpa agunan?', 'Skor AI · 4 mnt'],
  ['Hash chain: cara ledger membuktikan data tidak diubah', 'Teknologi · 5 mnt'],
  ['Mengenali modus penipuan “investasi bonus” di WhatsApp', 'Keamanan · 3 mnt'],
]

function ago(iso: string) {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (m < 60) return `${Math.max(1, m)} mnt lalu`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} jam lalu`
  const d = Math.round(h / 24)
  return d < 30 ? `${d} hari lalu` : formatDate(iso)
}

function AuthorBadge({ name, role }: { name: string; role: string }) {
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('')
  return (
    <span className="flex min-w-0 items-center gap-2 text-2xs">
      <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-full font-semibold', role === 'Fasilitator' ? 'bg-sun-500 text-kelp-950' : 'bg-kelp-950 text-white')}>{initials}</span>
      <span className="min-w-0">
        <b className="block truncate text-sm font-semibold">{name}</b>
        <span className="text-ink-muted">{role}</span>
      </span>
    </span>
  )
}

function LikeButton({ t }: { t: ForumThread }) {
  const me = useMe()!
  const toggle = useStore((s) => s.toggleLike)
  const liked = t.likes.includes(me.id)
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        toggle(t.id)
      }}
      aria-pressed={liked}
      className={cn('press inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-2xs font-semibold', liked ? 'bg-sun-500 text-kelp-950' : 'bg-paper-sunk text-ink')}
    >
      <svg viewBox="0 0 24 24" className="size-4" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" strokeLinejoin="round" />
      </svg>
      {t.likes.length}
    </button>
  )
}

export function Community() {
  const nav = useNavigate()
  const [tab, setTab] = useState('forum')
  const [filter, setFilter] = useState('Semua')
  const [open, setOpen] = useState(false)
  const forum = useStore((s) => s.forum)
  const create = useStore((s) => s.createThread)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [tag, setTag] = useState('Tanya jawab')
  const list = filter === 'Semua' ? forum : forum.filter((t) => t.tag === filter)

  return (
    <div className="pb-8">
      <PageHeader eyebrow="Forum Bahari" title="Komunitas" />
      <div className="flex flex-col gap-4 px-5 pt-2">
        <Segmented label="Konten" value={tab} onChange={setTab} options={[{ value: 'forum', label: 'Forum' }, { value: 'artikel', label: 'Artikel' }]} />
        {tab === 'forum' ? (
          <>
            <Button block icon="plus" onClick={() => setOpen(true)}>
              Mulai Diskusi Baru
            </Button>
            <ChipRow options={['Semua', ...TAGS]} value={filter} onChange={setFilter} />
            {list.length === 0 && <EmptyState icon="chats" title="Belum ada diskusi" body="Jadilah yang pertama memulai obrolan di topik ini." />}
            {list.map((t, i) => (
              <Reveal key={t.id} i={i}>
                <button onClick={() => nav(`/investor/komunitas/${t.id}`)} className="press block w-full rounded-md bg-surface p-4 text-left hover:shadow-soft">
                  <div className="mb-2 flex items-center gap-2">
                    <AuthorBadge name={t.authorName} role={t.authorRole} />
                    <span className="ml-auto shrink-0 rounded-full bg-paper-sunk px-2.5 py-1 text-[11px] font-semibold text-ink-muted">{t.tag}</span>
                  </div>
                  <p className="font-semibold leading-snug">{t.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{t.body}</p>
                  <div className="mt-3 flex items-center gap-2 text-2xs text-ink-muted">
                    <LikeButton t={t} />
                    <span className="inline-flex h-8 items-center gap-1 rounded-full bg-paper-sunk px-3 font-semibold text-ink">
                      <Icon name="chats" size={16} /> {t.comments.length}
                    </span>
                    <span className="ml-auto">{ago(t.createdAt)}</span>
                  </div>
                </button>
              </Reveal>
            ))}
          </>
        ) : (
          articles.map(([t, meta], i) => (
            <Reveal key={t} i={i}>
              <Card className="flex items-center gap-3 p-4">
                <span className="flex size-11 items-center justify-center rounded-full bg-kelp-950 text-sun-500">
                  <Icon name="file-text" size={20} />
                </span>
                <span className="flex-1">
                  <span className="block font-semibold leading-snug">{t}</span>
                  <span className="text-2xs text-ink-muted">{meta}</span>
                </span>
              </Card>
            </Reveal>
          ))
        )}
      </div>

      <BottomSheet open={open} onOpenChange={setOpen} title="Diskusi baru" description="Tanyakan atau bagikan pengalaman ke komunitas investor, nelayan, dan fasilitator.">
        <div className="flex flex-col gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold">Topik</p>
            <ChipRow options={TAGS} value={tag} onChange={setTag} />
          </div>
          <TextField label="Judul" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="mis. Berapa lama dana dicairkan?" maxLength={90} />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="th-body" className="text-sm font-semibold">
              Isi
            </label>
            <textarea id="th-body" rows={4} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Ceritakan lebih detail…" className="rounded-[22px] border-2 border-transparent bg-white p-4 text-base outline-none focus:border-kelp-950" />
          </div>
          <Button
            block
            disabled={title.trim().length < 6 || body.trim().length < 10}
            onClick={() => {
              const t = create({ title: title.trim(), body: body.trim(), tag })
              setOpen(false)
              setTitle('')
              setBody('')
              toast.ok('Diskusi terbit di Forum Bahari')
              nav(`/investor/komunitas/${t.id}`)
            }}
          >
            Terbitkan
          </Button>
        </div>
      </BottomSheet>
    </div>
  )
}

export function ThreadDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const t = useStore((s) => s.forum.find((x) => x.id === id))
  const add = useStore((s) => s.addComment)
  const [text, setText] = useState('')
  if (!t) return <EmptyState icon="chats" title="Diskusi tidak ditemukan" />

  const send = () => {
    if (text.trim().length < 2) return
    add(t.id, text.trim())
    setText('')
    toast.ok('Komentar terkirim')
  }

  return (
    <div className="pb-32">
      <TopBar title="Diskusi" subtitle={t.tag} onBack={() => nav(-1)} />
      <div className="flex flex-col gap-4 px-5">
        <Card className="p-5">
          <AuthorBadge name={t.authorName} role={t.authorRole} />
          <h1 className="mt-4 text-lg font-semibold leading-snug">{t.title}</h1>
          <p className="mt-2 text-[15px] leading-relaxed text-ink">{t.body}</p>
          <div className="mt-4 flex items-center gap-2 text-2xs text-ink-muted">
            <LikeButton t={t} />
            <span className="ml-auto">{ago(t.createdAt)}</span>
          </div>
        </Card>

        <h2 className="text-sm font-semibold text-ink-muted">{t.comments.length} komentar</h2>
        {t.comments.length === 0 ? (
          <p className="rounded-md bg-white/60 p-4 text-sm text-ink-muted">Belum ada komentar. Tulis tanggapan pertama.</p>
        ) : (
          <Panel>
            {t.comments.map((c, i) => (
              <Reveal key={c.id} i={i}>
                <div className={cn('py-3', i > 0 && 'border-t border-paper-sunk')}>
                  <div className="flex items-center gap-2">
                    <AuthorBadge name={c.authorName} role={c.authorRole} />
                    <span className="ml-auto shrink-0 text-[11px] text-ink-faint">{ago(c.createdAt)}</span>
                  </div>
                  <p className="mt-2 pl-11 text-sm leading-relaxed">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </Panel>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          send()
        }}
        className="fixed inset-x-0 bottom-0 z-30 mx-auto flex w-full max-w-[480px] items-center gap-2 px-4 pb-[calc(14px+env(safe-area-inset-bottom))]"
      >
        <label className="flex h-13 flex-1 items-center rounded-full bg-white px-5 shadow-float focus-within:ring-2 focus-within:ring-kelp-950">
          <span className="sr-only">Tulis komentar</span>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Tulis komentar…" className="w-full bg-transparent outline-none placeholder:text-ink-faint" />
        </label>
        <button type="submit" aria-label="Kirim komentar" disabled={text.trim().length < 2} className="press flex size-13 shrink-0 items-center justify-center rounded-full bg-sun-500 text-kelp-950 shadow-float disabled:opacity-50">
          <Icon name="send" size={22} />
        </button>
      </form>
    </div>
  )
}
