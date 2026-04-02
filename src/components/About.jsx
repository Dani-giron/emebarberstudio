import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './About.module.css'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { value: '1K+', label: 'Clientes satisfechos' },
  { value: '4.9', label: 'Valoración Google' },
]

export default function About() {
  const sectionRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(sectionRef.current.children,
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.12, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      }
    )
  }, [])

  return (
    <section className={styles.about} id="nosotros">
      <div className={`container ${styles.inner}`} ref={sectionRef}>

        <div className={styles.textBlock}>
          <span className="section-label">Sobre nosotros</span>
          <h2 className="section-title">
            Más que una barbería,<br />
            <em>una experiencia</em>
          </h2>
          <div className="divider" />
          <p>
            En EME barber studio combinamos técnica tradicional y tendencias modernas para
            ofrecerte el mejor look posible. Nuestro equipo perfecciona
            el arte del corte masculino en el corazón de Zaragoza.
          </p>
          <p>
            Usamos productos de alta calidad y nos actualizamos constantemente en las últimas
            técnicas del sector. Porque cada cliente merece un servicio único.
          </p>
        </div>

        <div className={styles.stats}>
          {STATS.map((s) => (
            <div key={s.label} className={styles.stat}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
