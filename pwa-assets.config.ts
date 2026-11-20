import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

// Ikon aplikasi dibuat dari emblem logo resmi (public/brand/logo-mark.png), latar putih.
export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: {
    ...minimal2023Preset,
    transparent: { ...minimal2023Preset.transparent, padding: 0.05, resizeOptions: { background: '#ffffff' } },
    maskable: { ...minimal2023Preset.maskable, padding: 0.22, resizeOptions: { background: '#ffffff' } },
    apple: { ...minimal2023Preset.apple, padding: 0.18, resizeOptions: { background: '#ffffff' } },
  },
  images: ['public/brand/logo-mark.png'],
})
