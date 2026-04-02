import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CONTACT } from '../contact'
import styles from './Services.module.css'

gsap.registerPlugin(ScrollTrigger)

const CATEGORIES = [
  {
    name: 'Cortes',
    items: [
      { name: 'Corte caballero con degradado',              price: '13 €+', time: '30 min' },
      { name: 'Corte caballero con degradado sin estructura', price: '17 €',  time: '45 min' },
      { name: 'Corte caballero básico con estructura',       price: '10 €+', time: '30 min' },
      { name: 'Corte caballero básico sin estructura',       price: '15 €',  time: '45 min' },
      { name: 'Corte de caballero solo tijera',              price: '20 €',  time: '30 min' },
    ],
  },
  {
    name: 'Barba',
    items: [
      { name: 'Corte + Barba',          price: '18 €', time: '45 min' },
      { name: 'Barba desde 0',          price: '10 €', time: '30 min' },
      { name: 'Repaso de barba',         price: '5 €',  time: '15 min' },
      { name: 'Marcar bigote y perilla', price: '3 €',  time: '5 min'  },
    ],
  },
]

export default function Services() {
  const headRef    = useRef(null)
  const sectionsRef = useRef([])

  useEffect(() => {
    gsap.fromTo(headRef.current.children,
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, stagger: 0.12, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: headRef.current, start: 'top 82%' },
      }
    )

    sectionsRef.current.forEach(section => {
      if (!section) return
      gsap.fromTo(section.querySelectorAll('[data-row]'),
        { y: 24, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.07, duration: 0.55, ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 82%' },
        }
      )
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <section className={styles.services} id="servicios">
      <div className="container">

        <div ref={headRef} className={styles.head}>
          <span className="section-label">Nuestros servicios</span>
          <h2 className="section-title">Cada detalle, <em>perfecto</em></h2>
          <div className="divider" />
        </div>

        {CATEGORIES.map((cat, ci) => (
          <div
            key={cat.name}
            ref={el => { sectionsRef.current[ci] = el }}
            className={styles.category}
          >
            <h3 className={styles.catTitle}>{cat.name}</h3>

            {cat.items.map((item) => (
              <div key={item.name} data-row className={styles.row}>
                <span className={styles.rowName}>{item.name}</span>
                <div className={styles.rowRight}>
                  <div className={styles.rowMeta}>
                    <span className={styles.rowPrice}>{item.price}</span>
                    <span className={styles.rowTime}>{item.time}</span>
                  </div>
                  <a
                    href={`${CONTACT.whatsappBase}?text=${encodeURIComponent('Hola, quiero reservar: ' + item.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.reserveBtn}
                  >
                    Reservar
                  </a>
                </div>
              </div>
            ))}
          </div>
        ))}

      </div>
    </section>
  )
}
