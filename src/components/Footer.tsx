import { ArrowUp } from '@phosphor-icons/react'

const links = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#beyond', label: 'Beyond the Code' },
  { href: '#contact', label: 'Contact' },
]

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-5 text-center md:flex-row md:items-center md:justify-between md:gap-8 md:text-left">
        <p className="font-mono text-[11px] tracking-wide text-faint">
          © {new Date().getFullYear()} Jad Kashmar. All rights reserved.
        </p>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 md:justify-start">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="link-draw font-mono text-[11px] tracking-[0.12em] text-muted uppercase transition-colors duration-200 hover:text-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Redundant with the floating BackToTopButton on mobile, so this
            stays a desktop-only convenience within easy mouse reach. */}
        <a
          href="#home"
          className="group hidden items-center gap-2 font-mono text-[11px] tracking-[0.12em] text-muted uppercase transition-colors duration-200 hover:text-accent md:inline-flex"
        >
          Back to top
          <ArrowUp
            size={13}
            weight="bold"
            className="transition-transform duration-200 group-hover:-translate-y-0.5"
          />
        </a>
      </div>
    </footer>
  )
}
