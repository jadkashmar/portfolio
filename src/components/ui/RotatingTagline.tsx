import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

type RotatingTaglineProps = {
  items: string[]
  interval?: number
  className?: string
}

export function RotatingTagline({ items, interval = 2600, className }: RotatingTaglineProps) {
  const [index, setIndex] = useState(0)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % items.length)
    }, interval)
    return () => clearInterval(id)
  }, [items.length, interval, reducedMotion])

  if (reducedMotion) {
    return <span className={className}>{items[0]}</span>
  }

  return (
    <span className={`relative inline-grid ${className ?? ''}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={items[index]}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="col-start-1 row-start-1"
        >
          {items[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
