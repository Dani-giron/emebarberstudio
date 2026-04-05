import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CONTACT } from '../contact'
import styles from './Courses.module.css'

gsap.registerPlugin(ScrollTrigger)

const COURSES = [
  {
    level: 'Iniciación · Perfeccionamiento',
    title: 'Curso intensivo de 1 día',
    desc: 'Jornada completa enfocada a las técnicas fundamentales del barbero. Ideal tanto para quienes dan sus primeros pasos como para profesionales que quieren afinar su técnica.',
    price: '100 €',
    duration: '8 h',
    format: 'Presencial',
    tags: ['One to One', 'Un alumno vs un profesor'],
  },
  {
    level: 'Formación completa',
    title: 'Curso de 1 mes',
    desc: 'Programa completo teórico-práctico con acceso a clientes reales desde el primer momento. Al finalizar estarás listo para trabajar en cualquier barbería.',
    price: '800 €',
    duration: '60 h',
    format: 'Teórico + Práctico + Clientes reales',
    featured: true,
    tags: ['One to One', 'Un alumno vs un profesor', 'Disponibilidad mañanas y tardes'],
  },
  {
    level: 'Formación profesional',
    title: 'Curso de 3 meses',
    desc: 'De cero a barbero formado. Formación intensiva con material de barbero incluido. Saldrás con todo lo necesario para ejercer el oficio desde el primer día.',
    price: '2.900 €',
    duration: '180 h',
    format: 'Teórico + Práctico + Clientes reales',
    featured: true,
    topBadge: 'Material incluido',
    tags: ['One to One', 'Un alumno vs un profesor', 'Material de barbero incluido', 'De principiante a formado'],
  },
]

export default function Courses() {
  const headRef  = useRef(null)
  const cardsRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(headRef.current.children,
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.12, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: headRef.current, start: 'top 82%' },
      }
    )
    gsap.fromTo(cardsRef.current.children,
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.15, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: cardsRef.current, start: 'top 78%' },
      }
    )
  }, [])

  return (
    <section className={styles.courses} id="cursos">

      {/* Cabecera */}
      <div ref={headRef} className={styles.head}>
        <span className="section-label">Formación</span>
        <h2 className="section-title">Aprende el oficio<br /><em>de los mejores</em></h2>
        <div className="divider" />
        <p className="section-subtitle">
          Cursos presenciales en Zaragoza impartidos por profesionales con años de experiencia en el sector.
        </p>
      </div>

      {/* Cards */}
      <div ref={cardsRef} className={styles.split}>
        {COURSES.map((c) => (
          <article
            key={c.title}
            className={`${styles.panel} ${c.featured ? styles.panelFeatured : ''}`}
          >
            {c.topBadge && <span className={styles.badgeTop}>{c.topBadge}</span>}

            <div className={styles.top}>
              <span className={styles.level}>{c.level}</span>

              <p className={styles.price}>{c.price}</p>
              <h3 className={styles.cardTitle}>{c.title}</h3>
              <p className={styles.cardDesc}>{c.desc}</p>

              {/* Tags específicos del curso */}
              <div className={styles.tags}>
                {c.tags.map((t) => (
                  <span key={t} className={styles.tag}>{t}</span>
                ))}
              </div>
            </div>

            <div className={styles.bottom}>
              <ul className={styles.meta}>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  {c.duration}
                </li>
                <li>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
                  {c.format}
                </li>
              </ul>
              <a
                href={`${CONTACT.whatsappBase}?text=${encodeURIComponent('Hola, me interesa el curso: ' + c.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn ${c.featured ? 'btn-primary' : 'btn-outline'} ${styles.cardBtn}`}
              >
                Solicitar información
              </a>
            </div>
          </article>
        ))}
      </div>

    </section>
  )
}
