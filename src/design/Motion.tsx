import { useEffect, useRef, useState, type ReactNode } from 'react'
import { animate, motion, useReducedMotion } from 'motion/react'

/** Muncul naik bertahap — bungkus item daftar, beri `i` untuk jeda berurutan. */
export function Reveal({ children, i = 0, className }: { children: ReactNode; i?: number; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(i, 10) * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/** Angka berhitung naik saat tampil / berubah (saldo, total dana). */
export function CountUp({ value, format }: { value: number; format: (n: number) => string }) {
  const reduce = useReducedMotion()
  const [shown, setShown] = useState(reduce ? value : 0)
  const from = useRef(reduce ? value : 0)
  useEffect(() => {
    if (reduce) {
      setShown(value)
      return
    }
    const controls = animate(from.current, value, {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setShown(Math.round(v)),
    })
    from.current = value
    return () => controls.stop()
  }, [value, reduce])
  return <>{format(shown)}</>
}
