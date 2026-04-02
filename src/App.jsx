// Componente raíz — orquesta todas las secciones
import { useEffect } from 'react'
import Lenis from 'lenis'
import Preloader from './components/Preloader'
import Navbar    from './components/Navbar'
import Studio    from './components/Studio'
import Services  from './components/Services'
import Gallery   from './components/Gallery'
import About     from './components/About'
import Courses   from './components/Courses'
import Reviews   from './components/Reviews'
import Location  from './components/Location'
import Footer    from './components/Footer'


export default function App() {
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)

    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    if (isTouchDevice) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenis.stop()

    const onReady = () => lenis.start()
    window.addEventListener('preloader-done', onReady, { once: true })

    const raf = time => {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => {
      window.removeEventListener('preloader-done', onReady)
      lenis.destroy()
    }
  }, [])

  return (
    <>
      <Navbar />
      <Preloader />
      <Studio />
      <Gallery />
      <Services />
      <Courses />
     <About />
      <Reviews />
      <Location />
      <Footer />
    </>
  )
}
