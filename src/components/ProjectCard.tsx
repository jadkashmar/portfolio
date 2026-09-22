import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight, FilePdf, GithubLogo, Images } from '@phosphor-icons/react'
import type { Project } from '../data/projects'
import { useTilt } from '../hooks/useTilt'
import { ClipReveal } from './ui/ClipReveal'

type ProjectCardProps = {
  project: Project
  onOpen: (project: Project) => void
  featured?: boolean
}

export function ProjectCard({ project, onOpen, featured = false }: ProjectCardProps) {
  const [imageError, setImageError] = useState(false)
  const isHardware = project.category === 'hardware'
  const hasGallery = (project.gallery?.length ?? 0) > 0
  const coverSrc = project.previewGif ?? project.image

  // The whole card tilts as one plane. A larger surface needs less rotation to
  // read as depth, so the angle is lower here than on a small element, and the
  // inner layers carry the effect through translateZ instead.
  const { ref, enabled, handlers, tilt, far, near, glare } = useTilt({
    maxTilt: featured ? 4.5 : 5.5,
    glareSize: featured ? '32rem' : '24rem',
  })

  return (
    <div className="h-full [perspective:1400px]">
      <motion.article
        ref={ref as never}
        {...handlers}
        whileHover={enabled ? { y: -6 } : undefined}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={enabled ? tilt : undefined}
        className={`group flex h-full flex-col ${featured ? 'lg:grid lg:grid-cols-12 lg:gap-12' : ''}`}
      >
        <div className={featured ? 'lg:col-span-7' : ''}>
          <ClipReveal direction="left" className="block">
          <motion.div
            role={hasGallery ? 'button' : undefined}
            tabIndex={hasGallery ? 0 : undefined}
            aria-label={hasGallery ? `View ${project.title} screenshots` : undefined}
            onClick={hasGallery ? () => onOpen(project) : undefined}
            onKeyDown={
              hasGallery
                ? (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      onOpen(project)
                    }
                  }
                : undefined
            }
            whileTap={enabled && hasGallery ? { scale: 0.99 } : undefined}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={enabled ? { translateZ: 26 } : undefined}
            className={`relative aspect-16/10 w-full overflow-hidden rounded-[2px] border border-line bg-surface shadow-[var(--shadow-sm)] transition-shadow duration-300 group-hover:shadow-[0_24px_52px_-22px_rgba(0,0,0,0.5)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${
              hasGallery ? 'cursor-pointer' : ''
            }`}
          >
          {!imageError ? (
            <motion.img
              src={coverSrc}
              alt={`${project.title}, ${project.stackSummary}`}
              loading="lazy"
              onError={() => setImageError(true)}
              // Slight overscale gives the parallax room to move without
              // exposing the panel edges.
              style={enabled ? { ...far, scale: 1.06 } : undefined}
              className="h-full w-full object-cover object-top"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface-sunk">
              <span className="label">Preview coming soon</span>
            </div>
          )}

          {/* Specular highlight. Only on hover, so a resting card stays flat. */}
          {enabled && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-300 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
              style={{ backgroundImage: glare }}
            />
          )}

          {hasGallery && (
            <div className="pointer-events-none absolute inset-0 flex items-end justify-start bg-surface-sunk/0 p-5 opacity-0 transition-all duration-300 group-hover:bg-surface-sunk/70 group-hover:opacity-100">
              <motion.span
                style={enabled ? { ...near, translateZ: 40 } : undefined}
                className="inline-flex items-center gap-2 rounded-[2px] bg-paper px-4 py-2.5 font-mono text-[11px] tracking-[0.12em] text-ink uppercase"
              >
                <Images size={14} weight="bold" />
                View screenshots
              </motion.span>
            </div>
          )}

          {isHardware && (
            <motion.span
              style={enabled ? { ...near, translateZ: 30 } : undefined}
              className="absolute top-4 left-4 rounded-[2px] border border-accent bg-paper/95 px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-accent uppercase"
            >
              Hardware
            </motion.span>
          )}
        </motion.div>
          </ClipReveal>
      </div>

        {/* Copy sits on its own depth layer so it separates from the media as
            the card turns, rather than looking painted onto the same plane. */}
        <motion.div
          style={enabled ? { translateZ: 44 } : undefined}
          className={`flex flex-1 flex-col ${featured ? 'lg:col-span-5 lg:justify-center' : ''}`}
        >
        <h3
          className={`mt-6 font-medium tracking-[-0.02em] text-ink ${
            featured ? 'text-3xl lg:mt-0 lg:text-[2.75rem] lg:leading-[1.05]' : 'text-xl'
          }`}
        >
          {project.title}
        </h3>
        <p className="mt-2 font-mono text-[11px] tracking-[0.12em] text-accent uppercase">
          {project.stackSummary}
        </p>

        <p
          className={`mt-5 text-pretty leading-[1.65] text-muted ${
            featured ? 'text-base lg:max-w-[46ch]' : 'text-sm'
          }`}
        >
          {project.description}
        </p>

        <ul className="mt-6 flex flex-wrap gap-x-2 gap-y-2">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-[2px] border border-line px-2.5 py-1 font-mono text-[10.5px] tracking-wide text-faint"
            >
              {tech}
            </li>
          ))}
        </ul>

        {/* Spacer grows so link rows align across cards of unequal content height */}
        <div className="min-h-8 flex-1" aria-hidden="true" />

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-5">
          {hasGallery && (
            <button
              type="button"
              onClick={() => onOpen(project)}
              className="link-draw inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.1em] text-ink uppercase transition-colors duration-200 hover:text-accent"
            >
              <Images size={13} weight="bold" />
              Screenshots
            </button>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="link-draw inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.1em] text-ink uppercase transition-colors duration-200 hover:text-accent"
            >
              <ArrowUpRight size={13} weight="bold" />
              Live site
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="link-draw inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.1em] text-ink uppercase transition-colors duration-200 hover:text-accent"
            >
              <GithubLogo size={13} weight="bold" />
              GitHub
            </a>
          )}
          {project.reportUrl && (
            <a
              href={project.reportUrl}
              target="_blank"
              rel="noreferrer"
              className="link-draw inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.1em] text-ink uppercase transition-colors duration-200 hover:text-accent"
            >
              <FilePdf size={13} weight="bold" />
              Read report
            </a>
          )}
          </div>
        </motion.div>
      </motion.article>
    </div>
  )
}
