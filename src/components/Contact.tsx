import { motion } from 'motion/react'
import { ArrowUpRight, EnvelopeSimple, FilePdf, GithubLogo, LinkedinLogo } from '@phosphor-icons/react'
import { contact } from '../data/resume'
import { Reveal } from './ui/Reveal'
import { WordReveal } from './ui/WordReveal'
import { useReducedMotion } from '../hooks/useReducedMotion'

const ease = [0.16, 1, 0.3, 1] as const

type Channel = {
  label: string
  value: string
  href: string
  Icon: typeof EnvelopeSimple
  external: boolean
  /** Suggested filename for a save-as download, instead of navigating. */
  download?: string
}

const channels: Channel[] = [
  {
    label: 'Email',
    value: contact.email,
    href: `mailto:${contact.email}`,
    Icon: EnvelopeSimple,
    external: false,
  },
  {
    label: 'GitHub',
    value: 'jadkashmar',
    href: contact.github,
    Icon: GithubLogo,
    external: true,
  },
  {
    label: 'LinkedIn',
    value: 'in/jad-kashmar-1980a13b0',
    href: contact.linkedin,
    Icon: LinkedinLogo,
    external: true,
  },
  {
    label: 'Resume',
    value: 'Download CV (PDF)',
    href: contact.resumeUrl,
    Icon: FilePdf,
    external: false,
    download: 'Jad-Kashmar-CV.pdf',
  },
]

export function Contact() {
  const reducedMotion = useReducedMotion()
  return (
    <section id="contact" className="relative bg-paper px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
      <div className="mx-auto grid max-w-[1400px] gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <WordReveal text="Let's build something together" className="max-w-[14ch] text-[clamp(2.25rem,6vw,5rem)] leading-[1.02] font-medium tracking-[-0.04em] text-balance text-ink" />

          <Reveal>
            <p className="measure mt-8 text-pretty text-lg leading-[1.65] text-muted">
              Based in {contact.location}. Open to internships, collaborations, and interesting
              problems, reach out directly and I'll get back to you.
            </p>
          </Reveal>

          <Reveal>
            <a
              href={`mailto:${contact.email}`}
              className="group mt-12 inline-flex items-baseline gap-3 text-[clamp(1.125rem,3vw,2rem)] font-medium tracking-[-0.02em] text-ink transition-colors duration-200 hover:text-accent"
            >
              <span className="link-draw">{contact.email}</span>
              <ArrowUpRight
                size={24}
                weight="bold"
                className="shrink-0 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </a>
          </Reveal>
        </div>

        <div className="lg:col-span-5 lg:pt-4">
          <div>
            {channels.map(({ label, value, href, Icon, external, download }, index) => (
              <motion.a
                key={label}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer' : undefined}
                download={download}
                initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -12% 0px' }}
                whileHover={{ x: 5, transition: { duration: 0.2, ease: 'easeOut' } }}
                transition={{ duration: 0.8, delay: index * 0.12, ease }}
                className="channel group flex items-center gap-5 border-t border-line-strong py-6 last:border-b"
              >
                <Icon
                  size={20}
                  weight="light"
                  className="shrink-0 text-faint transition-colors duration-200 group-hover:text-accent"
                />
                <span className="min-w-0 flex-1">
                  <span className="label block">{label}</span>
                  <span className="mt-1.5 block truncate text-base text-ink transition-colors duration-200 group-hover:text-accent">
                    {value}
                  </span>
                </span>
                <ArrowUpRight
                  size={16}
                  weight="bold"
                  className="shrink-0 text-line-strong transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
