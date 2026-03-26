import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Reviews.module.css'

gsap.registerPlugin(ScrollTrigger)

const REVIEWS = [
  {
    name:   'Esteban Albán',
    time:   'Hace 2 meses',
    text:   'Estoy muy agradecido con mi nuevo estilista. Me transmite mucha confianza con sus sugerencias y me encantan los resultados. Sin duda, se nota la experiencia.',
  },
  {
    name:   'Luis Izquierdo',
    time:   'Hace 3 semanas',
    text:   'Gran profesional. Cuida el corte al máximo detalle, dedicándole el tiempo que sea necesario. Además tiene un trato muy agradable.',
  },
  {
    name:   'Gabii Bueno',
    time:   'Hace un mes',
    text:   'Una experiencia personalizada y muy recomendada. Si tenéis algún evento especial —una graduación, una boda— este es el mejor sitio para hacerte tu corte favorito 🤙🏼',
  },
  {
    name:   'Mario Plou',
    time:   'Hace 2 meses',
    text:   'Muy buen servicio, muy amable. Te va preguntando durante el corte para que quede exactamente a tu gusto.',
  },
  {
    name:   'Ser Az Az',
    time:   'Hace 3 meses',
    text:   'Me aconsejó muy bien y el servicio fue muy bueno. El trato fue muy agradable. Se está muy a gusto durante el corte.',
  },
]

// 5 estrellas SVG reutilizable
function Stars() {
  return (
    <div className={styles.stars} aria-label="5 de 5 estrellas">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  )
}

export default function Reviews() {
  const headRef  = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(headRef.current.children,
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: headRef.current, start: 'top 82%' },
      }
    )

    gsap.fromTo(trackRef.current.children,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.1, duration: 0.65, ease: 'power3.out',
        scrollTrigger: { trigger: trackRef.current, start: 'top 82%' },
      }
    )

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <section className={styles.reviews} id="resenas">
      <div className="container">

        <div ref={headRef} className={styles.head}>
          <span className="section-label">Reseñas</span>
          <h2 className="section-title">Lo que dicen<br /><em>nuestros clientes</em></h2>
          <div className="divider" />
        </div>

        <div ref={trackRef} className={styles.grid}>
          {REVIEWS.map((r) => (
            <article key={r.name} className={styles.card}>

              {/* Cabecera: avatar inicial + nombre + Google */}
              <div className={styles.cardHead}>
                <div className={styles.avatar}>
                  {r.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className={styles.reviewer}>{r.name}</p>
                  <div className={styles.meta}>
                    <span className={styles.source}>Reseña de Google</span>
                    <span className={styles.dot}>·</span>
                    <span className={styles.time}>{r.time}</span>
                  </div>
                </div>
              </div>

              <Stars />
              <p className={styles.text}>{r.text}</p>

            </article>
          ))}
        </div>

      </div>
    </section>
  )
}
