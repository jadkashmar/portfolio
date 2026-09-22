import { useEffect, useRef } from 'react'

/*
 * Page-wide charcoal field of flowing contour lines that bend around the
 * cursor. Mounted once in App, fixed behind everything: sections with an
 * opaque background (About, Projects, Contact, Footer) simply paint over it,
 * sections left transparent (Hero, Skills, BeyondTheCode) let it show
 * through, so the same animated backdrop and cursor tracking continue
 * underneath them as you scroll.
 *
 * Coordinates are viewport-relative throughout (clientX/clientY), which
 * matches this element's `fixed inset-0` box exactly, so no bounding-rect
 * lookups are needed the way a section-scoped version would need.
 *
 * The canvas draws outside React state entirely: a single
 * requestAnimationFrame loop reads/writes plain closured variables, so
 * pointer movement never triggers a re-render. Colors below are literal to
 * match the canvas API (no CSS var interpolation inside a 2D context); they
 * mirror the `--ink` / `--accent` tokens in `index.css` and should be kept
 * in sync if those change.
 */
export function ContourField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
    let width = 0
    let height = 0
    let frame = 0
    let lastTime = 0
    let elapsed = 0
    let active = false
    let strength = 0
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 }

    const draw = () => {
      context.clearRect(0, 0, width, height)
      const radius = Math.min(width * 0.45, 340)

      // Soft light follows the eased pointer underneath the contour lines.
      const glow = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, radius * 1.8)
      glow.addColorStop(0, `rgba(220,20,60,${0.055 + strength * 0.07})`)
      glow.addColorStop(0.48, 'rgba(220,20,60,0.025)')
      glow.addColorStop(1, 'rgba(220,20,60,0)')
      context.fillStyle = glow
      context.fillRect(0, 0, width, height)

      const lines = 42
      const step = Math.max(10, width / 120)
      const amplitude = Math.min(height * 0.23, 190)
      const focus = Math.min(0.85, Math.max(0.15, pointer.x / width))

      // Reuse two gradients across every line instead of allocating one per path.
      const inks = [false, true].map((accent) => {
        const ink = context.createLinearGradient(0, 0, width, 0)
        ink.addColorStop(0, 'rgba(255,255,255,0)')
        ink.addColorStop(
          Math.max(0.01, focus - 0.3),
          accent ? 'rgba(220,20,60,0.025)' : 'rgba(255,255,255,0.035)',
        )
        ink.addColorStop(
          focus,
          accent ? `rgba(220,20,60,${0.24 + strength * 0.2})` : `rgba(255,255,255,${0.085 + strength * 0.025})`,
        )
        ink.addColorStop(
          Math.min(0.99, focus + 0.3),
          accent ? 'rgba(220,20,60,0.025)' : 'rgba(255,255,255,0.035)',
        )
        ink.addColorStop(1, 'rgba(255,255,255,0)')
        return ink
      })

      for (let line = 0; line < lines; line++) {
        const offset = (line - (lines - 1) / 2) / lines
        context.beginPath()
        for (let x = -20; x <= width + step; x += step) {
          const t = x / width
          const spread = 0.55 + Math.sin(t * Math.PI) * 0.65
          const wave = Math.sin(t * Math.PI * 2 - 0.7 + elapsed * 0.12)
          let y = height * 0.53 + wave * amplitude + offset * height * 0.58 * spread
          y += Math.sin(t * Math.PI * 3 + offset * 2 + elapsed * 0.09) * 22

          // Gaussian falloff bends nearby lines around the cursor. Bounded
          // displacement prevents sharp spikes, even with fast pointer motion.
          const dx = x - pointer.x
          const dy = y - pointer.y
          const influence = Math.exp(-(dx * dx + dy * dy) / (radius * radius))
          y += dy * influence * strength * 0.8
          if (x === -20) context.moveTo(x, y)
          else context.lineTo(x, y)
        }
        const accent = line >= 18 && line <= 22
        context.strokeStyle = inks[accent ? 1 : 0]
        context.lineWidth = accent ? 1 : 0.75
        context.stroke()
      }
    }

    const animate = (time: number) => {
      frame = 0
      // Frame-rate-independent easing feels consistent at 60Hz and 144Hz.
      // Events only store targets; requestAnimationFrame throttles rendering.
      const delta = Math.min((time - (lastTime || time)) / 1000, 0.05)
      lastTime = time
      elapsed += delta
      const ease = 1 - Math.exp(-delta * 6)
      pointer.x += (pointer.targetX - pointer.x) * ease
      pointer.y += (pointer.targetY - pointer.y) * ease
      strength += ((active ? 1 : 0) - strength) * ease
      draw()
      if (!document.hidden && !reducedMotion.matches) frame = requestAnimationFrame(animate)
    }

    const start = () => {
      if (!frame && !document.hidden && !reducedMotion.matches) {
        lastTime = 0
        frame = requestAnimationFrame(animate)
      }
    }

    const resize = () => {
      width = Math.max(window.innerWidth, 1)
      height = Math.max(window.innerHeight, 1)
      // Cap pixel density to keep the full-bleed canvas light on mobile GPUs.
      const dpr = Math.min(devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      pointer.x = pointer.targetX = width * 0.62
      pointer.y = pointer.targetY = height * 0.52
      draw()
    }

    const move = (event: PointerEvent) => {
      if (reducedMotion.matches) return
      pointer.targetX = event.clientX
      pointer.targetY = event.clientY
      active = true
    }

    // Fires when the pointer leaves the document entirely (relatedTarget is
    // null), i.e. the cursor exits the browser window.
    const outsideWindow = (event: PointerEvent) => {
      if (event.relatedTarget === null) leave()
    }

    const leave = () => {
      active = false
      pointer.targetX = width * 0.62
      pointer.targetY = height * 0.52
    }

    const syncMotion = () => {
      cancelAnimationFrame(frame)
      frame = 0
      if (reducedMotion.matches) {
        strength = 0
        elapsed = 0
        leave()
        pointer.x = pointer.targetX
        pointer.y = pointer.targetY
        draw()
      } else start()
    }

    window.addEventListener('resize', resize)
    // Listened on window (bubble phase) rather than the canvas, which is
    // pointer-events-none, so pointer position keeps updating no matter what
    // element - a button, a card - is directly under the cursor.
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', move, { passive: true })
    document.addEventListener('pointerout', outsideWindow)
    reducedMotion.addEventListener('change', syncMotion)
    document.addEventListener('visibilitychange', syncMotion)
    resize()
    start()

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', move)
      document.removeEventListener('pointerout', outsideWindow)
      reducedMotion.removeEventListener('change', syncMotion)
      document.removeEventListener('visibilitychange', syncMotion)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="contour-field pointer-events-none fixed inset-0 h-full w-full bg-paper"
      style={{ zIndex: 'var(--z-field)' }}
    />
  )
}
