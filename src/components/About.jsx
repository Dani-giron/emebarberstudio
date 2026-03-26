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
  const imgRef  = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    // Imagen entra desde la izquierda
    gsap.fromTo(imgRef.current,
      { x: -60, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: imgRef.current, start: 'top 80%' },
      }
    )

    // Texto entra desde la derecha
    gsap.fromTo(textRef.current.children,
      { x: 40, opacity: 0 },
      {
        x: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: textRef.current, start: 'top 80%' },
      }
    )
  }, [])

  return (
    <section className={styles.about} id="nosotros">
      <div className={`container ${styles.inner}`}>

        {/* Imagen */}
        <div ref={imgRef} className={styles.imgWrap}>
          <img
            src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=900&q=80"
            alt="Interior de EME Studio Barber"
          />
          {/* Badge flotante */}
          <div className={styles.badge}>
            <span className={styles.badgeYear}>2018</span>
            <span className={styles.badgeText}>Est.</span>
          </div>
        </div>

        {/* Texto */}
        <div ref={textRef} className={styles.text}>
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

          {/* Estadísticas */}
          <div className={styles.stats}>
            {STATS.map((s) => (
              <div key={s.label} className={styles.stat}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
