import { useStore } from '@/data/store'

/**
 * PRATINJAU palet berbasis logo (belum dipakai sebagai default).
 * Aktif hanya bila URL memuat ?tema=<nama>; tanpa parameter, aplikasi tetap memakai palet sekarang.
 * Nama token sama dengan src/index.css, sehingga seluruh layar ikut berubah tanpa mengubah kode layar.
 */
export type ThemeName = 'sekarang' | 'samudra' | 'pesisir' | 'gradasi'

type Tokens = Record<string, string>

const base = (t: Tokens): Tokens => t

export const THEMES: Record<Exclude<ThemeName, 'sekarang'>, { label: string; desc: string; tokens: Tokens; heroGradient?: string; outer: string; swatch: string[] }> = {
  samudra: {
    label: 'A · Samudra',
    desc: 'Biru dongker logo sebagai warna utama, hijau logo untuk tombol & aksen, latar putih kebiruan.',
    outer: '#c9dbe6',
    swatch: ['#0B4A66', '#1E62A0', '#2E9078', '#EAF3F7', '#FFFFFF'],
    tokens: base({
      paper: '#eaf3f7',
      'paper-sunk': '#dbe9f0',
      surface: '#ffffff',
      ink: '#082f44',
      'ink-muted': '#4b6676',
      'ink-faint': '#86a0ae',
      line: '#c8dce6',
      'kelp-950': '#0b4a66',
      'kelp-900': '#0f5677',
      'kelp-800': '#16658a',
      'kelp-700': '#0b4a66',
      'kelp-500': '#1e62a0',
      'kelp-300': '#a6c8da',
      'kelp-200': '#9fd6c4',
      'kelp-100': '#dcefe9',
      'sun-600': '#23806a',
      'sun-500': '#2e9078',
      'sun-300': '#8fe0c5',
      'sun-100': '#ddf2ea',
      'tide-600': '#1c92c2',
      'tide-100': '#dcf0f8',
    }),
  },
  pesisir: {
    label: 'B · Pesisir',
    desc: 'Teal-hijau logo sebagai warna utama, cyan untuk tombol & aksen, latar putih kehijauan.',
    outer: '#c4dedb',
    swatch: ['#187878', '#2E9078', '#1C92C2', '#ECF6F4', '#FFFFFF'],
    tokens: base({
      paper: '#ecf6f4',
      'paper-sunk': '#dcede9',
      surface: '#ffffff',
      ink: '#0b2c2f',
      'ink-muted': '#4a6966',
      'ink-faint': '#86a29e',
      line: '#c5ddd8',
      'kelp-950': '#126565',
      'kelp-900': '#167070',
      'kelp-800': '#1b7f7d',
      'kelp-700': '#0f5757',
      'kelp-500': '#2e9078',
      'kelp-300': '#a7d3cc',
      'kelp-200': '#9ad3e8',
      'kelp-100': '#dcf0ee',
      'sun-600': '#167fab',
      'sun-500': '#1c92c2',
      'sun-300': '#9fdcf3',
      'sun-100': '#dcf1fa',
      'tide-600': '#1e62a0',
      'tide-100': '#dde9f6',
    }),
  },
  gradasi: {
    label: 'C · Gradasi Logo',
    desc: 'Kartu utama memakai gradasi biru→hijau persis seperti logo, latar putih bersih, aksen hijau.',
    outer: '#d3e3ea',
    swatch: ['#0B4A66', '#187878', '#2E9078', '#F4F8FA', '#FFFFFF'],
    heroGradient: 'linear-gradient(135deg, #0b4a66 0%, #1e62a0 38%, #187878 72%, #2e9078 100%)',
    tokens: base({
      paper: '#f4f8fa',
      'paper-sunk': '#e6eff3',
      surface: '#ffffff',
      ink: '#0a2c3f',
      'ink-muted': '#4c6574',
      'ink-faint': '#8aa1ad',
      line: '#d2e1e8',
      'kelp-950': '#0b4a66',
      'kelp-900': '#105578',
      'kelp-800': '#16658a',
      'kelp-700': '#0b4a66',
      'kelp-500': '#187878',
      'kelp-300': '#b1d3e0',
      'kelp-200': '#a3dccb',
      'kelp-100': '#ddf1ea',
      'sun-600': '#23806a',
      'sun-500': '#2e9078',
      'sun-300': '#9ae6c8',
      'sun-100': '#dff4ec',
      'tide-600': '#1c92c2',
      'tide-100': '#dcf0f8',
    }),
  },
}

const KEY = 'artanaya-tema-preview'

/** Dipanggil sekali saat aplikasi mulai: terapkan ?tema= (dan ingat selama tab terbuka). */
export function applyPreviewTheme() {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  const q = url.searchParams.get('tema') as ThemeName | null
  const as = url.searchParams.get('as')
  if (as) useStore.getState().login(as)
  const inFrame = window.self !== window.top
  if (q && !inFrame) sessionStorage.setItem(KEY, q)
  const name = (q ?? (inFrame ? null : sessionStorage.getItem(KEY))) as ThemeName | null
  if (!name || name === 'sekarang' || !(name in THEMES)) return
  const t = THEMES[name as Exclude<ThemeName, 'sekarang'>]
  const root = document.documentElement
  for (const [k, v] of Object.entries(t.tokens)) root.style.setProperty(`--color-${k}`, v)
  const style = document.createElement('style')
  style.dataset.tema = name
  style.textContent = `
    [data-outer] { background-color: ${t.outer} !important; }
    ${t.heroGradient ? `[data-hero] { background-image: ${t.heroGradient}; }` : ''}
    /* Teks di atas warna aksen memakai putih agar kontras pada biru/hijau. */
    .bg-sun-500.text-kelp-950, .bg-sun-500 .text-kelp-950 { color: #ffffff !important; }
  `
  document.head.appendChild(style)
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t.tokens['kelp-950'])
}
