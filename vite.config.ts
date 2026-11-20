import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.ico', 'brand/logo-mark-128.png', 'apple-touch-icon-180x180.png'],
      manifest: {
        id: '/',
        name: 'ARTANAYA — Modal Syariah Pesisir',
        short_name: 'ARTANAYA',
        description: 'Pembiayaan syariah untuk nelayan dan pembudidaya pesisir: skor AI, ledger smart contract, dan radar keamanan.',
        lang: 'id',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ecf6f4',
        theme_color: '#126565',
        categories: ['finance', 'business'],
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        shortcuts: [
          { name: 'Masuk sebagai Nelayan', short_name: 'Nelayan', url: '/nelayan', icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }] },
          { name: 'Masuk sebagai Investor', short_name: 'Investor', url: '/investor', icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }] },
        ],
      },
      workbox: {
        // Tampilan (shell) + aset tersimpan di HP → aplikasi tetap terbuka saat sinyal lemah.
        globPatterns: ['**/*.{js,css,html,svg,ico,png,webp,jpg}', 'assets/poppins-latin-*.woff2'],
        globIgnores: ['**/poppins-*-ext-*', '**/poppins-devanagari-*'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
        // Data Supabase TIDAK di-cache: selalu ambil yang terbaru (aplikasi punya mode lokal sendiri bila offline).
        runtimeCaching: [],
      },
      devOptions: { enabled: false },
    }),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
