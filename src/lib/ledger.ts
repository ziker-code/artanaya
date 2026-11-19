/**
 * Ledger smart contract SIMULASI (PRD §9.3): hash chain SHA-256.
 * Setiap blok menyimpan hash blok sebelumnya; mengubah satu baris memutus rantai sesudahnya.
 */
export type LedgerType = 'investasi' | 'pencairan' | 'setoran' | 'distribusi'

export type LedgerPayload = {
  type: LedgerType
  projectId: string
  amount: number
  from: string
  to: string
  memo: string
  ts: string
}

export type LedgerBlock = LedgerPayload & { block: number; prevHash: string; hash: string }

export const GENESIS_HASH = '0x' + '0'.repeat(64)

function canonical(block: number, prevHash: string, p: LedgerPayload) {
  return [block, prevHash, p.type, p.projectId, p.amount, p.from, p.to, p.memo, p.ts].join('|')
}

export async function sha256(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return (
    '0x' +
    Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  )
}

export async function makeBlock(prev: LedgerBlock | undefined, payload: LedgerPayload): Promise<LedgerBlock> {
  const block = prev ? prev.block + 1 : 1
  const prevHash = prev ? prev.hash : GENESIS_HASH
  const hash = await sha256(canonical(block, prevHash, payload))
  return { ...payload, block, prevHash, hash }
}

export async function buildChain(payloads: LedgerPayload[]) {
  const chain: LedgerBlock[] = []
  for (const p of payloads) chain.push(await makeBlock(chain.at(-1), p))
  return chain
}

export type VerifyResult = { ok: true; checked: number } | { ok: false; checked: number; brokenAt: number; reason: string }

/** Menghitung ulang seluruh rantai di browser. */
export async function verifyChain(chain: LedgerBlock[]): Promise<VerifyResult> {
  let prevHash = GENESIS_HASH
  for (let i = 0; i < chain.length; i++) {
    const b = chain[i]
    if (b.prevHash !== prevHash) return { ok: false, checked: i, brokenAt: b.block, reason: 'Tautan ke blok sebelumnya tidak cocok' }
    const expect = await sha256(canonical(b.block, b.prevHash, b))
    if (expect !== b.hash) return { ok: false, checked: i, brokenAt: b.block, reason: 'Isi transaksi berubah setelah dicatat' }
    prevHash = b.hash
  }
  return { ok: true, checked: chain.length }
}
