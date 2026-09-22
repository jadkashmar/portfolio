import { motion, useMotionValue, useSpring } from 'motion/react'
import { type ReactNode, useRef } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

type MagneticButtonProps = {
  children: ReactNode
  strength?: number
  href: string
  target?: string
  rel?: string
  className?: string
  'aria-label'?: string
}

export function MagneticButton({ children, strength = 0.35, className, ...anchorProps }: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const reducedMotion = useReducedMotion()

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.4 })

  const handleMouseMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (reducedMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const relX = event.clientX - rect.left - rect.width / 2
    const relY = event.clientY - rect.top - rect.height / 2
    x.set(relX * strength)
    y.set(relY * strength)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      ref={ref}
      className={className}
      style={reducedMotion ? undefined : { x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.94 }}
      {...anchorProps}
    >
      {children}
    </motion.a>
  )
}
