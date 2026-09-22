import { motion } from 'motion/react'
import { ArrowDown, ArrowUpRight } from '@phosphor-icons/react'
import { personal } from '../data/resume'
import { MagneticButton } from './ui/MagneticButton'

const ease = [0.16, 1, 0.3, 1] as const

/*
 * Minimal hero: the name, centered, plus the two primary CTAs. No nav,
 * tagline, or description here by design - those live in their own
 * sections. Change the displayed name in `src/data/resume.ts`
 * (`personal.name`), not here.
 *
 * No background here: the section is transparent on purpose, so the
 * page-wide `ContourField` (mounted once in App) shows through and keeps
 * tracking the cursor as you scroll past it.
 */
export function Hero() {
  return (
    <section
      id="home"
      aria-label={personal.name}
      className="name-hero relative isolate grid min-h-svh w-full place-items-center px-6 text-ink"
    >
      <div className="relative z-10 flex flex-col items-center gap-10 text-center">
        <h1 className="name-hero__name m-0">{personal.name}</h1>

        <motion.div
          initial={{ opacity: 0, y: 16, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: 0.5, ease }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <MagneticButton
            href="#projects"
            className="group inline-flex items-center gap-2.5 rounded-[2px] bg-accent px-7 py-3.5 text-sm font-medium text-accent-ink transition-colors duration-200 hover:bg-accent-hover active:bg-accent-active"
          >
            View Projects
            <ArrowDown
              size={15}
              weight="bold"
              className="transition-transform duration-200 group-hover:translate-y-0.5"
            />
          </MagneticButton>
          <MagneticButton
            href="#contact"
            className="group inline-flex items-center gap-2.5 rounded-[2px] border border-line-strong px-7 py-3.5 text-sm font-medium text-ink transition-colors duration-200 hover:border-accent hover:text-accent"
          >
            Get in touch
            <ArrowUpRight
              size={15}
              weight="bold"
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  )
}
