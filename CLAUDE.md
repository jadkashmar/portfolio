# Jad Kashmar Portfolio

Personal portfolio site for Jad Kashmar. Single-page React app.

## Stack

- React 19, Vite 8, TypeScript 6
- Tailwind CSS v4 (`@tailwindcss/vite`, tokens in `src/index.css` via `@theme inline`)
- Motion (`motion/react`) for interaction and entrance animation; GSAP (`src/lib/gsap.ts`) for scroll work
- Phosphor icons (`@phosphor-icons/react`)
- Lint: oxlint

## Commands

- `npm run dev`: dev server (previously run on port 5200)
- `npm run build`: `tsc -b && vite build` (must stay clean)
- `npm run lint`: oxlint (must stay clean)

## Structure

- `src/data/`: all content (`resume.ts`, `projects.ts`, `beyondTheCode.ts`). Edit copy here, not in components.
- `src/components/`: page sections (Nav, Hero, About, Projects, Skills, BeyondTheCode, Contact, Footer) plus `ProjectCard` and `ProjectModal`.
- `src/components/ui/`: `CircuitField` (hero backdrop), `MagneticButton`, `Reveal`, `RotatingTagline`.
- `src/hooks/`: `useReducedMotion`, `useTilt` (shared 3D tilt model).
- `public/`: project images, GIF previews, gallery screenshots, PDFs.

## Design system (keep to it)

- Style: precision-instrument / technical-editorial. Geist and Geist Mono.
- One accent, crimson (`--accent`: `#DC143C`, hover `#BB0028`, active `#A00022`). No second accent.
- Sharp 2px radius everywhere (`rounded-[2px]`).
- Single dark theme (charcoal `#2B2B2B`, white ink, crimson accent); no light mode. Use CSS variable tokens (`paper`, `surface`, `ink`, `muted`, `faint`, `line`, `accent`, …), never raw colors.
- `--scrim*` tokens are deliberately dark in BOTH themes (used by the project modal). Don't use theme-inverting colors like `bg-ink/95` for overlays; they turn white in dark mode.
- Documented z-index scale in `:root` (`--z-nav`, `--z-overlay`, `--z-modal`, `--z-grain`).
- Easing: `[0.16, 1, 0.3, 1]`. Springs for pointer tracking: stiffness about 140–180, damping 22–24, with no overshoot.
- No em-dashes in user-facing copy.
- Every motion effect must be gated by `useReducedMotion` (static fallback).

## Current state of key features

### Hero (`Hero.tsx` and `ui/CircuitField.tsx`)
- Independent of any project; do not feature a project in the hero.
- CircuitField is a PCB-trace schematic with:
  - three parallax depth bands (grid, traces, nodes)
  - an accent copy of the traces revealed through a radial mask that follows the cursor
  - traces that draw in (`pathLength`) on load
  - scrims on the left and bottom for readability
- Pointer tracking lives in motion values (no React re-renders). The rect is cached in page space (rect plus scroll) and measured lazily on the first move, because `pointerenter` doesn't fire if the cursor is already over the hero at load.
- The hero copy wrapper is `pointer-events-none` so the field gets the cursor everywhere; the CTA row opts back in with `pointer-events-auto`.

### Project cards (`ProjectCard.tsx` and `hooks/useTilt.ts`)
- ALL project cards use the tilt style, and the WHOLE card tilts (media and copy together).
- The root is a `div` with `[perspective:1400px]`. The `motion.article` carries the tilt style, the pointer handlers and hover `y: -6`.
- Max tilt is 4.5 on the featured card and 5.5 on the rest.
- Depth layers use `translateZ`:
  - media at 26
  - copy at 44
  - overlay chips at 30 and 40
- The cover image uses the `far` parallax with scale 1.06, plus a glare layer on hover.
- `useTilt` returns `{ ref, enabled, handlers, tilt, far, near, glare }`.

### Project modal (`ProjectModal.tsx`)
- Near-solid dark scrim (`bg-[var(--scrim)] backdrop-blur-md`), so the page behind is cleared.
- The X close button is fixed to the viewport, top-right, 48px, light-on-dark, and turns accent on hover. It is the only close control and gets focus when the modal opens.
- Esc, a click outside the panel, and the X all close it. Body scroll is locked while open.
- Gallery with previous/next buttons, arrow keys, thumbnails and a crossfade (`AnimatePresence mode="wait"`).

## Working notes

- Ask before deleting any file the user created. Don't commit unless asked.
- After UI changes, verify in the browser preview, then run build and lint.
- Testing gotcha: when the app window/preview is hidden, requestAnimationFrame is paused, so Motion exit animations never finish and overlays look "stuck" in tests. That is a test artifact, not a bug. Verify via state (body overflow, focus) or with the window visible.

## Knowledge graph (graphify)

- A code graph lives in `graphify-out/` (`graph.json`, `GRAPH_REPORT.md`). For questions about structure or how pieces connect, run `/graphify query "<question>"` first instead of re-reading files.
- Read `graphify-out/GRAPH_REPORT.md` at the start of a session for orientation.
- Built from code only (no images/docs). After significant code changes, refresh with `/graphify . --update`.

## Possible next steps

- Visually confirm the modal close fade with the preview window visible.
- Anything new from the user.
