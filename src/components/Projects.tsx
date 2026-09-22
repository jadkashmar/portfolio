import { lazy, Suspense, useState } from 'react'
import { motion } from 'motion/react'
import { projects, type Project } from '../data/projects'
import { ProjectCard } from './ProjectCard'
import { Reveal } from './ui/Reveal'
import { WordReveal } from './ui/WordReveal'
import { DrawLine } from './ui/DrawLine'
import { useReducedMotion } from '../hooks/useReducedMotion'

const ease = [0.16, 1, 0.3, 1] as const

// Split out of the main bundle: the modal (gallery, keyboard nav, crossfade)
// is only needed once someone actually opens a project, not on first paint.
const ProjectModal = lazy(() => import('./ProjectModal').then((m) => ({ default: m.ProjectModal })))

const [featured, ...rest] = projects

export function Projects() {
  const reducedMotion = useReducedMotion()
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  // Stays false until the first open, so the modal chunk (and its own
  // internal AnimatePresence close-fade) never loads until it's needed -
  // then stays mounted so future opens/closes animate normally.
  const [modalMounted, setModalMounted] = useState(false)

  const openProject = (project: Project) => {
    setModalMounted(true)
    setActiveProject(project)
  }

  return (
    <section id="projects" className="relative bg-paper px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="relative flex flex-wrap items-baseline justify-between gap-4 pb-8">
            <WordReveal
              text="Things I've built"
              className="text-[clamp(2rem,5vw,4rem)] leading-[1.05] font-medium tracking-[-0.035em] text-ink"
            />
            <span className="font-mono text-[11px] tracking-[0.14em] text-faint uppercase">
              {String(projects.length).padStart(2, '0')} projects
            </span>
            <span aria-hidden="true" className="absolute inset-x-0 bottom-0">
              <DrawLine />
            </span>
          </div>
        </Reveal>

        <Reveal y={40} className="mt-16">
          <ProjectCard project={featured} onOpen={openProject} featured />
        </Reveal>

        <div className="mt-24 grid gap-x-12 gap-y-20 md:grid-cols-2">
          {rest.map((project, index) => (
            <motion.div
              key={project.slug}
              initial={reducedMotion ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -12% 0px' }}
              transition={{ duration: 0.8, delay: index * 0.12, ease }}
              className="project-item"
            >
              <ProjectCard project={project} onOpen={openProject} />
            </motion.div>
          ))}
        </div>
      </div>

      {modalMounted && (
        <Suspense fallback={null}>
          <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
        </Suspense>
      )}
    </section>
  )
}
