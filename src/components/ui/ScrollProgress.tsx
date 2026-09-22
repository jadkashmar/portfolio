import { motion, useScroll, useSpring } from 'motion/react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/* Hairline reading-progress bar pinned to the top edge. */
export function ScrollProgress() {
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 160, damping: 24, mass: 0.4 })

  if (reducedMotion) return null
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX, zIndex: 'var(--z-nav)' }}
      className="pointer-events-none fixed inset-x-0 top-0 h-[2px] origin-left bg-accent"
    />
  )
}
