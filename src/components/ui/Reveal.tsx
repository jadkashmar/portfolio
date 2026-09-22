import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const ease = [0.16, 1, 0.3, 1] as const

type RevealProps = {
  children: ReactNode
  className?: string
  as?: 'div' | 'section'
  y?: number
  duration?: number
  delay?: number
}

/*
 * Block-level scroll reveal: fades/slides the whole wrapper up once, the
 * first time it enters the viewport. For a staggered list of items, animate
 * each item directly with its own `whileInView` and an index-based delay
 * instead (see Skills.tsx, Contact.tsx, BeyondTheCode.tsx, Projects.tsx) -
 * that's a plain Motion pattern with no separate stagger API to learn here.
 *
 * `once: true` matches WordReveal/DrawLine elsewhere on the site: content
 * stays revealed once shown, it doesn't fade back out scrolling past it again.
 */
export function Reveal({ children, className, as = 'div', y = 40, duration = 0.8, delay = 0 }: RevealProps) {
  const reducedMotion = useReducedMotion()
  const Component = motion[as]

  if (reducedMotion) {
    const Static = as
    return <Static className={className}>{children}</Static>
  }

  return (
    <Component
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration, delay, ease }}
      className={className}
    >
      {children}
    </Component>
  )
}
