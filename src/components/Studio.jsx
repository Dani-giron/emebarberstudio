import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Studio.module.css'

gsap.registerPlugin(ScrollTrigger)

const PHOTOS = [
  {
    src: '/images/barberia%20buena.jpeg',
    pos: 'center center',
    label: 'El Studio',
    align: 'topLeft',
  },
  {
    src: '/images/barberiabuena2.webp',
    pos: 'center center',
    label: 'Donde el estilo nace.',
    align: 'topRight',
  },
]

export default function Studio() {
  const overlaysRef = useRef([])

  useEffect(() => {
    overlaysRef.current.forEach((el) => {
      if (!el) return
      const chars = el.querySelectorAll('span')
      gsap.fromTo(chars,
        { y: '110%', opacity: 0 },
        {
          y: '0%', opacity: 1,
          stagger: 0.035,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        }
      )
    })
  }, [])

  return (
    <section className={styles.studio}>
      {PHOTOS.map((p, i) => (
        <div key={i} className={styles.photo}>
          <img src={p.src} alt="EME Studio Barber" style={{ objectPosition: p.pos }} />
          <div
            ref={el => overlaysRef.current[i] = el}
            className={`${styles.overlay} ${styles[p.align]}`}
            aria-label={p.label}
          >
            {p.label.split('').map((char, j) => (
              <span key={j} className={styles.char}>
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
