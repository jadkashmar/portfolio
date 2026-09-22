import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, CaretLeft, CaretRight, FilePdf, GithubLogo, X } from '@phosphor-icons/react'
import type { Project } from '../data/projects'

type ProjectModalProps = {
  project: Project | null
  onClose: () => void
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lastSlug, setLastSlug] = useState(project?.slug)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const gallery = project?.gallery ?? []

  // Reset the carousel during render when a different project opens
  if (project?.slug !== lastSlug) {
    setLastSlug(project?.slug)
    setActiveIndex(0)
  }

  useEffect(() => {
    if (!project) return
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (gallery.length < 2) return
      if (event.key === 'ArrowRight') setActiveIndex((i) => (i + 1) % gallery.length)
      if (event.key === 'ArrowLeft') setActiveIndex((i) => (i - 1 + gallery.length) % gallery.length)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [project, onClose, gallery.length])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="project-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          // Near-solid scrim: the page behind is fully cleared so the
          // screenshot is the only thing competing for attention.
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-[var(--scrim)] p-4 backdrop-blur-md sm:items-center sm:p-8"
          onClick={onClose}
        >
          {/* Sits on the viewport, not the panel, so it never lands on top of a
              dark screenshot and disappear. First in the tab order.
              It fades in and out with the scrim. */}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="fixed top-4 right-4 z-20 flex h-12 w-12 items-center justify-center rounded-[2px] border border-[var(--scrim-border)] bg-[var(--scrim-surface)] text-[var(--scrim-fg)] backdrop-blur transition-[colors,transform] duration-200 hover:border-accent hover:bg-accent hover:text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-95 sm:top-6 sm:right-6"
          >
            <X size={22} weight="bold" />
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.99 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-4xl rounded-[2px] border border-line bg-paper shadow-[var(--shadow-md)]"
          >
            {gallery.length > 0 && (
              <figure className="relative aspect-16/10 w-full overflow-hidden rounded-t-[2px] border-b border-line bg-surface-sunk">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={gallery[activeIndex].src}
                    src={gallery[activeIndex].src}
                    alt={`${project.title}, ${gallery[activeIndex].caption}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="h-full w-full object-cover object-top"
                  />
                </AnimatePresence>

                {gallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveIndex((i) => (i - 1 + gallery.length) % gallery.length)}
                      aria-label="Previous screenshot"
                      className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-[2px] bg-paper/90 text-ink backdrop-blur transition-colors duration-200 hover:bg-accent hover:text-accent-ink"
                    >
                      <CaretLeft size={16} weight="bold" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveIndex((i) => (i + 1) % gallery.length)}
                      aria-label="Next screenshot"
                      className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-[2px] bg-paper/90 text-ink backdrop-blur transition-colors duration-200 hover:bg-accent hover:text-accent-ink"
                    >
                      <CaretRight size={16} weight="bold" />
                    </button>

                    <figcaption className="absolute right-3 bottom-3 rounded-[2px] bg-paper/90 px-3 py-1.5 font-mono text-[11px] text-ink backdrop-blur">
                      {activeIndex + 1} / {gallery.length}
                    </figcaption>
                  </>
                )}
              </figure>
            )}

            <div className="max-h-[58vh] overflow-y-auto p-6 sm:p-9">
              <h3
                id="project-modal-title"
                className="text-2xl font-medium tracking-[-0.02em] text-ink sm:text-3xl"
              >
                {project.title}
              </h3>
              <p className="mt-2 font-mono text-[11px] tracking-[0.12em] text-accent uppercase">
                {project.stackSummary}
              </p>

              {gallery.length > 0 && (
                <p className="mt-5 font-mono text-xs text-muted">{gallery[activeIndex].caption}</p>
              )}

              <p className="measure mt-4 text-pretty text-sm leading-[1.7] text-muted">
                {project.description}
              </p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-[2px] border border-line px-2.5 py-1 font-mono text-[10.5px] tracking-wide text-faint"
                  >
                    {tech}
                  </li>
                ))}
              </ul>

              {gallery.length > 1 && (
                <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
                  {gallery.map((shot, index) => (
                    <button
                      key={shot.src}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-label={`View screenshot ${index + 1}: ${shot.caption}`}
                      aria-current={index === activeIndex}
                      className={`h-14 w-24 shrink-0 overflow-hidden rounded-[2px] border transition-colors duration-200 ${
                        index === activeIndex
                          ? 'border-accent'
                          : 'border-line hover:border-line-strong'
                      }`}
                    >
                      <img
                        src={shot.src}
                        alt=""
                        className="h-full w-full object-cover object-top"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-6">
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
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
