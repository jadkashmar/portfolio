import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

// Motion tokens, from the transitions.dev scale: emphasis/reveal moments
// (this site's equivalent of "text reveal") read at 500ms on a smooth-out
// curve - the same tier WordReveal already uses, so a clip wipe and a word
// wipe never feel like they're running on two different clocks.
const duration = 0.5
const ease = [0.22, 1, 0.36, 1] as const

type Direction = 'up' | 'down' | 'left' | 'right'

// clip-path inset(top right bottom left): each value below starts the
// rectangle collapsed to a zero-size sliver at the edge the reveal grows
// from, so as it animates to inset(0 0 0 0) the content uncovers from that
// edge toward its opposite.
const clipFrom: Record<Direction, string> = {
  up: 'inset(100% 0% 0% 0%)', // sliver at the bottom, grows upward (mask exits the top - matches WordReveal's rise)
  down: 'inset(0% 0% 100% 0%)', // sliver at the top, grows downward (mask exits the bottom, like a blind unrolling)
  left: 'inset(0% 100% 0% 0%)', // sliver at the left, grows rightward
  right: 'inset(0% 0% 0% 100%)', // sliver at the right, grows leftward
}

type ClipRevealProps = {
  children: ReactNode
  className?: string
  direction?: Direction
  delay?: number
  as?: 'div' | 'span'
}

/*
 * Reveals its content through an animated clip-path wipe rather than a
 * plain fade - for moments that want more presence than the site's
 * standard Reveal (block fade) or WordReveal (per-word rise): project
 * imagery, and text blocks that follow the hero in prominence.
 *
 * `once: true` matches every other scroll reveal on the site: content stays
 * revealed, it doesn't wipe back out scrolling past it again.
 */
export function ClipReveal({ children, className, direction = 'up', delay = 0, as = 'div' }: ClipRevealProps) {
  const reducedMotion = useReducedMotion()
  const Component = motion[as]

  if (reducedMotion) {
    const Static = as
    return <Static className={className}>{children}</Static>
  }

  return (
    <Component
      initial={{ clipPath: clipFrom[direction] }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration, delay, ease }}
      className={className}
    >
      {children}
    </Component>
  )
}
