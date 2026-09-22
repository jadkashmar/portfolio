import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { ArrowUp } from '@phosphor-icons/react'
import { useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/*
 * Floating "back to top" affordance for small screens, where scrolling back
 * up manually through a long single page is the most tedious. Desktop
 * already has a "Back to top" link in the footer within easy mouse reach,
 * so this stays mobile-only (md:hidden).
 *
 * Appears once you've scrolled roughly past the hero, not immediately -
 * showing it at the very top of the page would just be clutter with
 * nothing to scroll back up to.
 */
export function BackToTopButton() {
  const reducedMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const [visible, setVisible] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => {
    setVisible(y > window.innerHeight * 0.75)
  })

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="#home"
          aria-label="Back to top"
          initial={reducedMotion ? false : { opacity: 0, scale: 0.8, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, scale: 0.8, y: 8 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          whileTap={{ scale: 0.9 }}
          className="fixed right-5 bottom-5 z-[50] flex h-12 w-12 items-center justify-center rounded-[2px] border border-line-strong bg-paper/90 text-ink shadow-[var(--shadow-md)] backdrop-blur-md transition-colors duration-200 hover:border-accent hover:text-accent md:hidden"
        >
          <ArrowUp size={18} weight="bold" />
        </motion.a>
      )}
    </AnimatePresence>
  )
}
