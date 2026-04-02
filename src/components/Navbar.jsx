import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import styles from './Navbar.module.css'

const LINKS = [
  { label: 'Nosotros',  href: '#nosotros' },
  { label: 'Galería',   href: '#galeria' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Cursos',    href: '#cursos' },
  { label: 'Ubicación', href: '#ubicacion' },
]

export default function Navbar() {
  const navRef     = useRef(null)
  const menuRef    = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    gsap.set(navRef.current, { opacity: 0, y: -12 })

    const onShow = () =>
      gsap.to(navRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })

    window.addEventListener('navbar-show', onShow)

    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('navbar-show', onShow)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  // Animar apertura/cierre del menú móvil
  useEffect(() => {
    if (!menuRef.current) return
    if (open) {
      document.body.style.overflow = 'hidden'
      gsap.fromTo(menuRef.current,
        { clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)', pointerEvents: 'none' },
        { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', pointerEvents: 'auto',
          duration: 0.6, ease: 'power3.inOut' }
      )
      gsap.fromTo(`.${styles.menuLink}`,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.07, duration: 0.5, ease: 'power3.out', delay: 0.25 }
      )
    } else {
      document.body.style.overflow = ''
      gsap.to(menuRef.current, {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
        pointerEvents: 'none',
        duration: 0.45, ease: 'power3.inOut',
      })
    }
  }, [open])

  const handleNav = (e, href) => {
    e.preventDefault()
    setOpen(false)
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }, 450)
  }

  return (
    <>
      <nav ref={navRef} className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <a href="#inicio" className={styles.logo} onClick={e => handleNav(e, '#inicio')}>
          <span className={styles.logoEme}>EME</span>
          <span className={styles.logoSub}>Barber Studio</span>
        </a>

        {/* Links desktop */}
        <ul className={styles.links}>
          {LINKS.map(({ label, href }) => (
            <li key={href}>
              <a href={href} className={styles.link} onClick={e => handleNav(e, href)}>
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Hamburger — solo móvil */}
        <button
          className={`${styles.hamburger} ${open ? styles.hamburgerOpen : ''}`}
          onClick={() => setOpen(v => !v)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Menú móvil overlay */}
      <div ref={menuRef} className={styles.mobileMenu}>
        <ul className={styles.menuLinks}>
          {LINKS.map(({ label, href }) => (
            <li key={href}>
              <a href={href} className={styles.menuLink} onClick={e => handleNav(e, href)}>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
