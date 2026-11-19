import { FACILITATOR_WA } from '@/data/seed'

/**
 * Tautan WhatsApp ke fasilitator/pusat bantuan dengan pesan yang sudah terisi.
 * Pesan TIDAK terkirim otomatis — pengguna yang memutuskan menekan "Kirim" di WhatsApp.
 */
export function waLink(message: string, phone = FACILITATOR_WA) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

export function openWa(message: string, phone?: string) {
  window.open(waLink(message, phone), '_blank', 'noopener,noreferrer')
}
