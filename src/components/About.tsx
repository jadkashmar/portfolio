import { personal, education, spokenLanguages } from '../data/resume'
import { Reveal } from './ui/Reveal'
import { ClipReveal } from './ui/ClipReveal'

// The summary is typeset with hierarchy rather than rewritten: the opening
// sentence carries at display size, the remainder reads as body copy.
const splitAt = personal.summary.indexOf('. ')
const lead = splitAt === -1 ? personal.summary : personal.summary.slice(0, splitAt + 1)
const rest = splitAt === -1 ? '' : personal.summary.slice(splitAt + 2)

export function About() {
  return (
    <section id="about" className="relative bg-paper px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="sr-only">About</h2>

        <ClipReveal as="div" direction="up">
          <p className="max-w-[20ch] text-[clamp(1.75rem,4vw,3.25rem)] leading-[1.12] font-medium tracking-[-0.03em] text-balance text-ink">
            {lead}
          </p>
        </ClipReveal>

        <div className="mt-16 grid gap-14 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-7">
            <p className="measure text-pretty text-lg leading-[1.7] text-muted">{rest}</p>
          </Reveal>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1 lg:gap-12">
            <Reveal>
              <div className="border-t border-line-strong pt-5">
                <h3 className="label">Education</h3>
                <p className="mt-4 text-lg leading-snug font-medium text-ink">{education.degree}</p>
                <p className="mt-2 text-sm text-muted">
                  {education.school}
                  <span className="mx-2 text-line-strong">/</span>
                  {education.location}
                </p>
                <p className="mt-3 font-mono text-xs tracking-wide text-accent">{education.graduation}</p>
              </div>
            </Reveal>

            <Reveal>
              <div className="border-t border-line-strong pt-5">
                <h3 className="label">Academics</h3>
                <p className="mt-4 font-mono text-sm text-ink">{education.satScore}</p>
              </div>
            </Reveal>

            <Reveal>
              <div className="border-t border-line-strong pt-5">
                <h3 className="label">Languages</h3>
                <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
                  {spokenLanguages.map((lang) => (
                    <div key={lang.name} className="flex items-baseline justify-between gap-3">
                      <dt className="text-sm text-ink">{lang.name}</dt>
                      <dd className="font-mono text-[11px] tracking-wide text-faint">{lang.level}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
