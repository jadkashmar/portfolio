import { useCallback, useEffect, useRef, useState } from 'react'
import { useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import { useReducedMotion } from './useReducedMotion'

/*
 * Shared cursor-tilt model.
 *
 * One pointer position (normalised to -0.5..0.5 inside the element) drives
 * three coordinated effects: tilt, layered parallax, and a specular highlight.
 *
 * Performance: the position lives in motion values, never React state, so
 * moving the cursor never re-renders the tree. There is no per-event render
 * work to throttle. The element's rect is measured once on pointer enter and
 * cached, so the move handler never calls getBoundingClientRect and never
 * forces a layout pass.
 *
 * Touch: with no hover-capable pointer there is no cursor to follow, and a
 * scrolling finger cancels pointer events. On those devices the same motion
 * values are driven by the card's scroll progress through the viewport, so the
 * cards still tilt, drift and catch the glare as they pass.
 *
 * Accessibility: when prefers-reduced-motion is set, `enabled` is false, the
 * handlers are no-ops, every spring stays at rest, and consumers should skip
 * applying the returned styles entirely.
 */

// Settles in roughly 300ms with no overshoot. Overshoot reads playful; this is
// a developer portfolio, so motion decelerates and stops.
const TRACKING_SPRING = { stiffness: 180, damping: 22, mass: 0.6 } as const

type UseTiltOptions = {
  /** Peak rotation in degrees at the element's corners. Kept low on purpose. */
  maxTilt?: number
  /** Radius of the specular highlight. */
  glareSize?: string
  /** Strength of the accent in the highlight. */
  glareStrength?: number
}

export function useTilt({
  maxTilt = 6.5,
  glareSize = '32rem',
  glareStrength = 22,
}: UseTiltOptions = {}) {
  const reducedMotion = useReducedMotion()
  const [touchOnly] = useState(() => window.matchMedia('(hover: none)').matches)
  const ref = useRef<HTMLElement>(null)
  const rectRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null)

  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  useEffect(() => {
    if (!touchOnly || reducedMotion) return
    // 0 as the card enters, 0.5 centred (flat), 1 as it leaves. Vertical tilt
    // follows the scroll; a slow sway on X keeps it from reading as a plain fade.
    const drive = (p: number) => {
      pointerY.set((p - 0.5) * 0.9)
      pointerX.set(Math.sin(p * Math.PI * 2) * 0.35)
    }
    drive(scrollYProgress.get())
    return scrollYProgress.on('change', drive)
  }, [touchOnly, reducedMotion, scrollYProgress, pointerX, pointerY])

  const springX = useSpring(pointerX, TRACKING_SPRING)
  const springY = useSpring(pointerY, TRACKING_SPRING)

  // rotateX is inverted: pushing the cursor down drops the far edge away.
  const rotateX = useTransform(springY, [-0.5, 0.5], [maxTilt, -maxTilt])
  const rotateY = useTransform(springX, [-0.5, 0.5], [-maxTilt, maxTilt])

  // Two depth bands. Larger travel reads as nearer the viewer.
  const farX = useTransform(springX, [-0.5, 0.5], [8, -8])
  const farY = useTransform(springY, [-0.5, 0.5], [6, -6])
  const nearX = useTransform(springX, [-0.5, 0.5], [-14, 14])
  const nearY = useTransform(springY, [-0.5, 0.5], [-9, 9])

  const glareX = useTransform(springX, [-0.5, 0.5], ['0%', '100%'])
  const glareY = useTransform(springY, [-0.5, 0.5], ['0%', '100%'])
  const glare = useMotionTemplate`radial-gradient(${glareSize} circle at ${glareX} ${glareY}, color-mix(in srgb, var(--accent) ${glareStrength}%, transparent), transparent 55%)`

  // Measured in page space (rect + current scroll) so the cached box stays
  // valid while the user scrolls. Paired with pageX/pageY below.
  const measure = useCallback(() => {
    const box = ref.current?.getBoundingClientRect()
    if (!box) return null
    const rect = {
      left: box.left + window.scrollX,
      top: box.top + window.scrollY,
      width: box.width,
      height: box.height,
    }
    rectRef.current = rect
    return rect
  }, [])

  const onPointerEnter = useCallback(() => {
    measure()
  }, [measure])

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      // Lazily measure: if the page loads with the cursor already inside the
      // element, pointerenter never fires and there would be nothing cached.
      const rect = rectRef.current ?? measure()
      if (!rect || rect.width === 0 || rect.height === 0) return
      pointerX.set((event.pageX - rect.left) / rect.width - 0.5)
      pointerY.set((event.pageY - rect.top) / rect.height - 0.5)
    },
    [measure, pointerX, pointerY],
  )

  const onPointerLeave = useCallback(() => {
    // Springs carry the surface back to rest rather than snapping.
    pointerX.set(0)
    pointerY.set(0)
  }, [pointerX, pointerY])

  const enabled = !reducedMotion
  const pointerDriven = enabled && !touchOnly

  return {
    ref,
    enabled,
    /** Spread onto the tilting element. No-ops under reduced motion. */
    handlers: pointerDriven ? { onPointerEnter, onPointerMove, onPointerLeave } : {},
    /** Spread into the tilting element's `style`. */
    tilt: { rotateX, rotateY, transformStyle: 'preserve-3d' as const, willChange: 'transform' },
    /** Background layers: drift against the tilt. */
    far: { x: farX, y: farY },
    /** Foreground layers: drift with it, further, so they separate. */
    near: { x: nearX, y: nearY },
    glare,
  }
}
