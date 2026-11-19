const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

/** Rp32.400.000 */
export function formatRupiah(value: number) {
  return rupiah.format(value).replace(/\s/g, '')
}

/** Rp14,5 M · Rp32,4 jt · Rp850 rb — untuk ruang sempit */
export function formatRupiahShort(value: number) {
  const abs = Math.abs(value)
  const sign = value < 0 ? '−' : ''
  const fmt = (n: number) => n.toLocaleString('id-ID', { maximumFractionDigits: 1 })
  if (abs >= 1e12) return `${sign}Rp${fmt(abs / 1e12)} T`
  if (abs >= 1e9) return `${sign}Rp${fmt(abs / 1e9)} M`
  if (abs >= 1e6) return `${sign}Rp${fmt(abs / 1e6)} jt`
  if (abs >= 1e3) return `${sign}Rp${fmt(abs / 1e3)} rb`
  return `${sign}Rp${abs}`
}

const dateFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

/** 15 Sep 2026 */
export function formatDate(d: Date | string | number) {
  return dateFmt.format(new Date(d)).replace('.', '')
}

/** 0x3f9a…c714 */
export function shortHash(hash: string, head = 6, tail = 4) {
  if (hash.length <= head + tail + 1) return hash
  return `${hash.slice(0, head)}…${hash.slice(-tail)}`
}
