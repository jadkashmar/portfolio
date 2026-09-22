import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { List, X } from '@phosphor-icons/react'

const links = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#beyond', label: 'Beyond the Code' },
  { href: '#contact', label: 'Contact' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string>('')
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Sentinel at the top of the page: leaving it means we have scrolled.
  // IntersectionObserver instead of a scroll listener (no per-frame work).
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting), {
      rootMargin: '-24px 0px 0px 0px',
    })
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  // Track which section owns the middle of the viewport. The observer root is a
  // thin band at centre screen; visible ids are kept in a set and resolved in
  // document order so boundaries never flicker to the wrong section.
  useEffect(() => {
    const sections = links
      .map((link) => document.querySelector(link.href))
      .filter((el): el is Element => el !== null)
    if (sections.length === 0) return

    const visible = new Set<string>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        const current = links.find((link) => visible.has(link.href.slice(1)))
        if (current) setActive(current.href)
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="absolute top-0 h-px w-full" />

      <header
        className={`fixed inset-x-0 top-0 z-[50] transition-colors duration-300 ${
          scrolled ? 'border-b border-line bg-paper/90 backdrop-blur-md' : 'border-b border-transparent'
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 sm:px-10 lg:px-16"
        >
          <a
            href="#home"
            className="font-mono text-sm font-medium tracking-[0.12em] text-ink transition-colors duration-200 hover:text-accent"
          >
            JK<span className="text-accent">/</span>
          </a>

          <ul className="hidden items-center gap-9 md:flex">
            {links.map((link) => {
              const isActive = active === link.href
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={isActive ? 'true' : undefined}
                    className={`link-draw font-mono text-[11px] tracking-[0.14em] uppercase transition-colors duration-200 ${
                      isActive ? 'text-accent' : 'text-muted hover:text-ink'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="relative z-10 -mr-2 p-2 text-ink transition-colors duration-200 hover:text-accent md:hidden"
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={open}
          >
            {open ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
          </button>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-0 top-16 bottom-0 flex flex-col justify-center gap-1 overflow-y-auto bg-paper px-8 pb-20 md:hidden"
            >
              {links.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.34, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-line last:border-b-0"
                >
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 py-5 text-2xl text-ink transition-colors duration-200 hover:text-accent"
                  >
                    <span className="font-mono text-[11px] text-faint">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
