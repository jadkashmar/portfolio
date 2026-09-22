import { motion } from 'motion/react'
import { skillCategories } from '../data/resume'
import { WordReveal } from './ui/WordReveal'
import { DrawLine } from './ui/DrawLine'
import { useReducedMotion } from '../hooks/useReducedMotion'

const ease = [0.16, 1, 0.3, 1] as const

export function Skills() {
  const reducedMotion = useReducedMotion()
  return (
    <section id="skills" className="relative px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
      <div className="mx-auto max-w-[1400px]">
        <WordReveal text="What I work with" className="max-w-[16ch] text-[clamp(2rem,5vw,4rem)] leading-[1.05] font-medium tracking-[-0.035em] text-balance text-ink" />

        <div className="mt-16">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={reducedMotion ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -12% 0px' }}
              transition={{ duration: 0.8, delay: index * 0.12, ease }}
              className="skill-row relative grid gap-5 py-8 lg:grid-cols-12 lg:gap-8"
            >
              <DrawLine />
              <div className="flex items-baseline gap-4 lg:col-span-3">
                <span className="font-mono text-[11px] text-faint">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="text-base font-medium text-ink">{category.title}</h3>
              </div>

              <ul className="flex flex-wrap gap-x-2.5 gap-y-3 lg:col-span-9">
                {category.skills.map((skill, skillIndex) => (
                  <motion.li
                    key={skill}
                    initial={reducedMotion ? false : { opacity: 0, y: 10, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: '0px 0px -8% 0px' }}
                    whileHover={{ y: -2, transition: { duration: 0.18, ease: 'easeOut' } }}
                    transition={{ duration: 0.5, delay: 0.25 + skillIndex * 0.035, ease: [0.16, 1, 0.3, 1] }}
                    className="cursor-default rounded-[2px] border border-line bg-paper px-3.5 py-2 text-sm text-muted transition-colors duration-200 hover:border-accent hover:text-accent"
                  >
                    {skill}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
