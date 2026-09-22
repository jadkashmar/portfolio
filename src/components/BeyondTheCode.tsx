import { motion } from 'motion/react'
import { beyondTheCode } from '../data/beyondTheCode'
import { Reveal } from './ui/Reveal'
import { useReducedMotion } from '../hooks/useReducedMotion'

const ease = [0.16, 1, 0.3, 1] as const

const kindLabels: Record<string, string> = {
  work: 'Work',
  interest: 'Interest',
  community: 'Community',
}

// Deliberately broken grid: entries step across the 12-column field instead of
// stacking in a predictable rhythm.
const placements = [
  'lg:col-start-1 lg:col-span-6',
  'lg:col-start-7 lg:col-span-6 lg:mt-20',
  'lg:col-start-2 lg:col-span-6 lg:-mt-8',
  'lg:col-start-8 lg:col-span-5 lg:mt-12',
]

export function BeyondTheCode() {
  const reducedMotion = useReducedMotion()
  return (
    <section id="beyond" className="relative px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <h2 className="max-w-[18ch] text-[clamp(2rem,5vw,4rem)] leading-[1.05] font-medium tracking-[-0.035em] text-balance text-ink">
            Who I am outside the editor
          </h2>
        </Reveal>

        <div className="mt-20 grid gap-14 lg:grid-cols-12 lg:gap-x-12">
          {beyondTheCode.map((entry, index) => (
            <motion.article
              key={entry.title}
              initial={reducedMotion ? false : { opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -12% 0px' }}
              whileHover={{ x: 6, transition: { duration: 0.25, ease: 'easeOut' } }}
              transition={{ duration: 0.8, delay: index * 0.12, ease }}
              className={`beyond-item group ${placements[index] ?? 'lg:col-span-6'}`}
            >
              <div className="flex items-start gap-6">
                <span className="font-mono text-[clamp(2rem,4vw,3.5rem)] leading-none font-light text-line-strong transition-colors duration-300 group-hover:text-accent">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="flex-1 border-t border-line-strong pt-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-medium tracking-[-0.015em] text-ink">{entry.title}</h3>
                    <span className="rounded-[2px] border border-line px-2 py-0.5 font-mono text-[10px] tracking-[0.14em] text-faint uppercase">
                      {kindLabels[entry.kind]}
                    </span>
                  </div>
                  <p className="mt-2 font-mono text-[11px] tracking-[0.08em] text-accent">
                    {entry.subtitle}
                  </p>
                  <p className="measure mt-4 text-pretty text-sm leading-[1.7] text-muted">
                    {entry.description}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
