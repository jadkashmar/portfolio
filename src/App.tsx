import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Skills } from './components/Skills'
import { Projects } from './components/Projects'
import { BeyondTheCode } from './components/BeyondTheCode'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { ScrollProgress } from './components/ui/ScrollProgress'
import { ContourField } from './components/ui/ContourField'
import { BackToTopButton } from './components/ui/BackToTopButton'

// Fixed, non-scrolling grain layer. Kept off scrolling containers so it never
// forces continuous GPU repaints.
const grain =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E"

function App() {
  return (
    <>
      <ContourField />

      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <ScrollProgress />
      <Nav />

      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <BeyondTheCode />
        <Contact />
      </main>

      <Footer />
      <BackToTopButton />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[200] opacity-[0.035] mix-blend-screen"
        style={{ backgroundImage: `url("${grain}")` }}
      />
    </>
  )
}

export default App
