import { motion } from 'motion/react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const ease = [0.16, 1, 0.3, 1] as const

/* Hairline rule that draws in from the left when it scrolls into view.
   Place inside a `relative` parent; sits on the parent's top edge. */
export function DrawLine({ delay = 0 }: { delay?: number }) {
  const reducedMotion = useReducedMotion()
  return (
    <motion.span
      aria-hidden="true"
      initial={reducedMotion ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 1, delay, ease }}
      className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left bg-line-strong"
    />
  )
}
