import { useState } from 'react'
import { projects, type Project } from '../data/projects'
import { ProjectCard } from './ProjectCard'
import { ProjectModal } from './ProjectModal'
import { Reveal } from './ui/Reveal'
import { WordReveal } from './ui/WordReveal'
import { DrawLine } from './ui/DrawLine'

const [featured, ...rest] = projects

export function Projects() {
  const [activeProject, setActiveProject] = useState<Project | null>(null)

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
          <ProjectCard project={featured} onOpen={setActiveProject} featured />
        </Reveal>

        <Reveal stagger=".project-item" y={40} className="mt-24 grid gap-x-12 gap-y-20 md:grid-cols-2">
          {rest.map((project) => (
            <div key={project.slug} className="project-item">
              <ProjectCard project={project} onOpen={setActiveProject} />
            </div>
          ))}
        </Reveal>
      </div>

      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </section>
  )
}
