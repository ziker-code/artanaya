import { useState } from 'react'
import { THEMES, type ThemeName } from '@/app/themes'

/**
 * Halaman pembanding palet: aplikasi ASLI ditampilkan berdampingan (iframe) dengan palet berbeda.
 * Hanya untuk penilaian — tidak mengubah tampilan default.
 */
const SCREENS = [
  { label: 'Masuk', path: '/', as: '' },
  { label: 'Beranda Nelayan', path: '/nelayan', as: 'u-rudi' },
  { label: 'Dompetku', path: '/nelayan/dompet', as: 'u-rudi' },
  { label: 'Ajukan Proyek', path: '/nelayan/ajukan', as: 'u-rudi' },
  { label: 'Beranda Investor', path: '/investor', as: 'u-dedi' },
  { label: 'Prospektus', path: '/investor/proyek/PRJ-0024', as: 'u-dedi' },
  { label: 'Radar Ancaman', path: '/investor/radar', as: 'u-dedi' },
  { label: 'Beranda Admin', path: '/admin', as: 'u-admin' },
  { label: 'Ledger', path: '/admin/ledger', as: 'u-admin' },
]

const CURRENT = { label: 'Sekarang', desc: 'Palet yang sedang live: sage, hitam, lime.', swatch: ['#070806', '#A6E465', '#D3E0CA', '#F7FAF3', '#FFFFFF'] }

const OPTIONS: { key: ThemeName; label: string; desc: string; swatch: string[] }[] = [
  { key: 'sekarang', ...CURRENT },
  ...(Object.keys(THEMES) as Exclude<ThemeName, 'sekarang'>[]).map((k) => ({ key: k as ThemeName, label: THEMES[k].label, desc: THEMES[k].desc, swatch: THEMES[k].swatch })),
]

const W = 390
const H = 844

export function ThemeCompare() {
  const [screen, setScreen] = useState(SCREENS[1])
  const [scale, setScale] = useState(0.7)

  const src = (key: ThemeName) => {
    const q = new URLSearchParams({ tema: key })
    if (screen.as) q.set('as', screen.as)
    return `${screen.path}?${q.toString()}`
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#f3f5f7', color: '#0b1d2a', fontFamily: 'Poppins, system-ui, sans-serif' }}>
      <header style={{ maxWidth: 1600, margin: '0 auto', padding: '28px 20px 8px', display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center' }}>
        <img src="/brand/logo-full.png" alt="ARTANAYA" style={{ height: 84, width: 'auto' }} />
        <div style={{ flex: '1 1 320px' }}>
          <h1 style={{ fontSize: 26, fontWeight: 600, margin: 0 }}>Pratinjau palet dari logo</h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: '#4b5b66', maxWidth: 720 }}>
            Setiap kolom adalah aplikasi ARTANAYA yang asli dengan layout yang sama persis — hanya warnanya yang berbeda. Pilih layar di bawah, bandingkan, lalu pilih A, B, atau C. Belum ada yang diterapkan ke aplikasi live.
          </p>
        </div>
      </header>

      <nav style={{ maxWidth: 1600, margin: '0 auto', padding: '12px 20px', display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        {SCREENS.map((s) => (
          <button
            key={s.path}
            onClick={() => setScreen(s)}
            style={{
              height: 38,
              padding: '0 16px',
              borderRadius: 999,
              border: 0,
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 14,
              fontWeight: s.path === screen.path ? 600 : 500,
              background: s.path === screen.path ? '#0b4a66' : '#ffffff',
              color: s.path === screen.path ? '#ffffff' : '#0b1d2a',
            }}
          >
            {s.label}
          </button>
        ))}
        <label style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#4b5b66' }}>
          Ukuran
          <input type="range" min={0.45} max={1} step={0.05} value={scale} onChange={(e) => setScale(Number(e.target.value))} />
        </label>
      </nav>

      <main style={{ maxWidth: 1600, margin: '0 auto', padding: '8px 20px 40px', display: 'flex', gap: 24, overflowX: 'auto' }}>
        {OPTIONS.map((o) => (
          <section key={o.key} style={{ flex: '0 0 auto', width: W * scale + 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <h2 style={{ fontSize: 17, fontWeight: 600, margin: 0 }}>{o.label}</h2>
              {o.key === 'sekarang' && <span style={{ fontSize: 11, background: '#e2e8ec', borderRadius: 999, padding: '2px 8px' }}>live</span>}
            </div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
              {o.swatch.map((c) => (
                <span key={c} title={c} style={{ width: 28, height: 28, borderRadius: 999, background: c, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.08)' }} />
              ))}
            </div>
            <p style={{ fontSize: 12, color: '#4b5b66', minHeight: 54, margin: '0 0 10px' }}>{o.desc}</p>
            <div style={{ width: W * scale + 16, height: H * scale + 16, borderRadius: 36 * scale + 8, background: '#0b1d2a', padding: 8, boxShadow: '0 20px 40px -20px rgba(11,29,42,.5)' }}>
              <div style={{ width: W * scale, height: H * scale, borderRadius: 36 * scale, overflow: 'hidden', background: '#fff' }}>
                <iframe
                  key={src(o.key)}
                  title={`${o.label} — ${screen.label}`}
                  src={src(o.key)}
                  style={{ width: W, height: H, border: 0, transform: `scale(${scale})`, transformOrigin: '0 0' }}
                />
              </div>
            </div>
            <a href={src(o.key)} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: 10, fontSize: 13, fontWeight: 600, color: '#0b4a66' }}>
              Buka layar penuh ↗
            </a>
          </section>
        ))}
      </main>
    </div>
  )
}
