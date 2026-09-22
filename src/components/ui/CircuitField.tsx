import { useCallback, useRef } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/*
 * CircuitField - the hero's cursor-reactive backdrop.
 *
 * A PCB-style routing schematic, nodding to the digital-logic side of the work
 * without showing any project. Three things happen on pointer move:
 *
 *   1. PARALLAX - three depth bands (grid, traces, nodes) drift by different
 *      amounts, so the field gains depth rather than sliding as one sheet.
 *   2. ENERGISE - a second, accent-coloured copy of the traces sits on top,
 *      revealed only through a radial mask that follows the cursor. The effect
 *      reads as current flowing through whichever traces you are near.
 *   3. SETTLE   - springs return everything to rest when the pointer leaves.
 *
 * On load the traces draw themselves in (pathLength 0 -> 1), staggered, so the
 * board assembles rather than appearing.
 *
 * Performance: pointer position lives in motion values, so tracking never
 * re-renders React. The rect is cached on pointer enter, so the move handler
 * never calls getBoundingClientRect. Only transform / opacity / mask animate.
 *
 * Accessibility: under prefers-reduced-motion nothing tracks, nothing draws,
 * and the field renders as a static schematic. It is decorative, so it is fully
 * hidden from assistive tech.
 */

const SPRING = { stiffness: 140, damping: 24, mass: 0.7 } as const

// Orthogonal routes with 45-degree bends, the way real board traces are laid out.
const TRACES = [
  'M -20 96 H 150 L 196 142 H 420',
  'M -20 168 H 96 L 150 222 H 300 L 340 182 H 520',
  'M -20 250 H 210 L 254 294 H 470',
  'M -20 336 H 120 L 172 284 H 366 L 410 328 H 560',
  'M -20 420 H 250 L 296 374 H 480',
  'M -20 500 H 168 L 214 546 H 430 L 472 504 H 620',
  'M 300 -20 V 88 L 352 140 V 260',
  'M 452 -20 V 132 L 404 180 V 300',
  'M 560 620 V 470 L 512 422 V 300',
  'M 620 96 H 700 L 744 140 V 300',
  'M 470 294 H 596 L 640 338 H 820',
  'M 430 546 H 590 L 634 502 H 820',
]

// Junction pads. Placed on trace corners so they read as real connections.
const NODES = [
  [196, 142],
  [150, 222],
  [340, 182],
  [254, 294],
  [172, 284],
  [410, 328],
  [296, 374],
  [214, 546],
  [472, 504],
  [352, 140],
  [404, 180],
  [512, 422],
  [744, 140],
  [640, 338],
  [634, 502],
]

export function CircuitField() {
  const reducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const rectRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null)

  // Raw pixel position drives the mask; normalised position drives parallax.
  const rawX = useMotionValue(-600)
  const rawY = useMotionValue(-600)
  const normX = useMotionValue(0)
  const normY = useMotionValue(0)

  const maskX = useSpring(rawX, SPRING)
  const maskY = useSpring(rawY, SPRING)
  const springX = useSpring(normX, SPRING)
  const springY = useSpring(normY, SPRING)

  const gridX = useTransform(springX, [-0.5, 0.5], [10, -10])
  const gridY = useTransform(springY, [-0.5, 0.5], [8, -8])
  const traceX = useTransform(springX, [-0.5, 0.5], [-18, 18])
  const traceY = useTransform(springY, [-0.5, 0.5], [-12, 12])
  const nodeX = useTransform(springX, [-0.5, 0.5], [-30, 30])
  const nodeY = useTransform(springY, [-0.5, 0.5], [-20, 20])

  // Reveal window for the energised copy of the schematic.
  const mask = useMotionTemplate`radial-gradient(20rem circle at ${maskX}px ${maskY}px, #000 0%, rgba(0,0,0,0.55) 45%, transparent 72%)`

  // Measured in page space (rect + current scroll) so the cached box survives
  // scrolling. Paired with pageX/pageY below.
  const measure = useCallback(() => {
    const box = containerRef.current?.getBoundingClientRect()
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

  const cacheRect = useCallback(() => {
    measure()
  }, [measure])

  const handleMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      // Lazily measure: if the page loads with the cursor already over the hero,
      // pointerenter never fires and there would be nothing cached.
      const rect = rectRef.current ?? measure()
      if (!rect || rect.width === 0 || rect.height === 0) return
      const x = event.pageX - rect.left
      const y = event.pageY - rect.top
      rawX.set(x)
      rawY.set(y)
      normX.set(x / rect.width - 0.5)
      normY.set(y / rect.height - 0.5)
    },
    [measure, rawX, rawY, normX, normY],
  )

  const handleLeave = useCallback(() => {
    // Park the reveal window off-canvas and let the parallax settle to centre.
    rawX.set(-600)
    rawY.set(-600)
    normX.set(0)
    normY.set(0)
  }, [rawX, rawY, normX, normY])

  const svgProps = {
    viewBox: '0 0 800 600',
    preserveAspectRatio: 'xMidYMid slice',
    className: 'h-full w-full',
  } as const

  return (
    <div
      ref={containerRef}
      onPointerEnter={reducedMotion ? undefined : cacheRect}
      onPointerMove={reducedMotion ? undefined : handleMove}
      onPointerLeave={reducedMotion ? undefined : handleLeave}
      className="absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Depth 1 - hairline grid */}
      <motion.div
        className="blueprint absolute inset-[-3%] opacity-45"
        style={reducedMotion ? undefined : { x: gridX, y: gridY }}
      />

      {/* Depth 2 - the schematic at rest */}
      <motion.div
        className="absolute inset-[-3%]"
        style={reducedMotion ? undefined : { x: traceX, y: traceY, willChange: 'transform' }}
      >
        <svg {...svgProps}>
          <g fill="none" stroke="var(--line-strong)" strokeWidth={1.25} strokeLinecap="square">
            {TRACES.map((d, i) => (
              <motion.path
                key={d}
                d={d}
                initial={reducedMotion ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : { duration: 1.1, delay: 0.15 + i * 0.05, ease: [0.16, 1, 0.3, 1] }
                }
              />
            ))}
          </g>
        </svg>
      </motion.div>

      {/* Depth 2b - energised copy, revealed only under the cursor */}
      {!reducedMotion && (
        <motion.div
          className="absolute inset-[-3%]"
          style={{
            x: traceX,
            y: traceY,
            maskImage: mask,
            WebkitMaskImage: mask,
            willChange: 'transform, mask-image',
          }}
        >
          <svg {...svgProps}>
            <g fill="none" stroke="var(--accent)" strokeWidth={1.6} strokeLinecap="square">
              {TRACES.map((d) => (
                <path key={d} d={d} />
              ))}
            </g>
            <g fill="var(--accent)">
              {NODES.map(([cx, cy]) => (
                <rect key={`${cx}-${cy}`} x={cx - 3.5} y={cy - 3.5} width={7} height={7} />
              ))}
            </g>
          </svg>
        </motion.div>
      )}

      {/* Depth 3 - junction pads, nearest the viewer */}
      <motion.div
        className="absolute inset-[-3%]"
        style={reducedMotion ? undefined : { x: nodeX, y: nodeY }}
      >
        <svg {...svgProps}>
          <g fill="var(--paper)" stroke="var(--line-strong)" strokeWidth={1.25}>
            {NODES.map(([cx, cy], i) => (
              <motion.rect
                key={`${cx}-${cy}`}
                x={cx - 3.5}
                y={cy - 3.5}
                width={7}
                height={7}
                initial={reducedMotion ? false : { opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ transformOrigin: `${cx}px ${cy}px` }}
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : { duration: 0.4, delay: 0.7 + i * 0.03, ease: [0.16, 1, 0.3, 1] }
                }
              />
            ))}
          </g>
        </svg>
      </motion.div>

      {/* Scrims: keep the headline side readable and fade the field into the page */}
      <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/75 to-transparent lg:via-paper/40" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-paper" />
    </div>
  )
}
