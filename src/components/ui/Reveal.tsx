import { useEffect, useRef, type ReactNode } from 'react'
import { ensureGsapRegistered, gsap } from '../../lib/gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'

type RevealProps = {
  children: ReactNode
  className?: string
  /** CSS selector (relative to the container) for items to stagger. Defaults to direct children. */
  stagger?: string
  as?: 'div' | 'section'
  y?: number
  duration?: number
  delay?: number
  start?: string
}

export function Reveal({
  children,
  className,
  stagger,
  as = 'div',
  y = 40,
  duration = 0.8,
  delay = 0,
  start = 'top 82%',
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (!ref.current) return
    if (reducedMotion) return

    ensureGsapRegistered()

    const targets = stagger
      ? ref.current.querySelectorAll(stagger)
      : (Array.from(ref.current.children) as Element[])

    const items = targets.length > 0 ? targets : [ref.current]

    const ctx = gsap.context(() => {
      gsap.set(items, { opacity: 0, y })
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: 'power3.out',
        stagger: items.length > 1 ? 0.12 : 0,
        scrollTrigger: {
          trigger: ref.current,
          start,
          toggleActions: 'play none none reverse',
        },
      })
    }, ref)

    return () => ctx.revert()
  }, [reducedMotion, stagger, y, duration, delay, start])

  const Component = as
  return (
    <Component ref={ref as never} className={className}>
      {children}
    </Component>
  )
}
