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
    align: 'left',
  },
  {
    src: '/images/barberiabuena2.webp',
    pos: 'center center',
    label: 'Donde el estilo nace.',
    align: 'right',
  },
]

export default function Studio() {
  const labelsRef = useRef([])

  useEffect(() => {
    labelsRef.current.forEach(el => {
      if (!el) return
      gsap.fromTo(el.querySelectorAll('span'),
        { y: '110%', opacity: 0 },
        {
          y: '0%', opacity: 1,
          stagger: 0.035, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
        }
      )
    })
  }, [])

  return (
    <section className={styles.studio}>
      <div className="container">
        <div className={styles.stack}>
          {PHOTOS.map((p, i) => (
            <div key={i} className={styles.block}>
              <div
                ref={el => { labelsRef.current[i] = el }}
                className={`${styles.label} ${styles[p.align]}`}
              >
                {p.label.split('').map((char, j) => (
                  <span key={j} className={styles.char}>
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </div>
              <div className={styles.photo}>
                <img src={p.src} alt="EME Studio Barber" style={{ objectPosition: p.pos }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
