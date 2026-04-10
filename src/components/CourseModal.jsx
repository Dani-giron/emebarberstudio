import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { CONTACT } from '../contact'
import styles from './CourseModal.module.css'

export default function CourseModal({ course, onClose }) {
  const overlayRef = useRef(null)
  const sheetRef = useRef(null)
  const scrollYRef = useRef(0)

useEffect(() => {
    // 1. Guardamos la posición exacta del scroll
    scrollYRef.current = window.scrollY

    // 2. Bloqueo nuclear: Fijamos el body para que NO se pueda mover nada de atrás
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollYRef.current}px`
    document.body.style.width = '100%'
    document.body.style.overflow = 'hidden'

    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
    gsap.fromTo(sheetRef.current, { y: '100%' }, { y: '0%', duration: 0.5, ease: 'power3.out' })

    return () => {
      // 3. Al desmontar, limpiamos los estilos y devolvemos al usuario a donde estaba
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
      
      // Hacemos el scroll instantáneo de vuelta (sin animación)
      window.scrollTo({
        top: scrollYRef.current,
        behavior: 'instant'
      })
    }
  }, [])

  const handleClose = useCallback(() => {
    gsap.to(sheetRef.current, { y: '100%', duration: 0.4, ease: 'power3.in' })
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, onComplete: onClose })
  },)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && handleClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  },)

  const wa = `${CONTACT.whatsappBase}?text=${encodeURIComponent(`Hola, quiero reservar una plaza en el ${course.title}`)}`

  return (
    <div ref={overlayRef} className={styles.overlay} onClick={handleClose}>
      <div ref={sheetRef} className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        
        {/* Fondo contenido en la parte superior */}
        <div className={styles.bg}>
          <img src="/images/barberia%20buena.jpeg" alt="" />
          <div className={styles.overlayGradient} />
        </div>

        <div className={styles.header}>
          <span className={styles.brand}>EME BARBER STUDIO</span>
          <button className={styles.close} onClick={handleClose}>✕</button>
        </div>

        {/*contenedor con scroll real */}
        <div className={styles.body}>
          <h2 className={styles.title}>{course.title}</h2>
          <div className={styles.priceBadge}>{course.price}</div>

          <div className={styles.content}>
            {course.program.map((section) => (
              <div key={section.label} className={styles.section}>
                <h3 className={styles.sectionLabel}>{section.label}</h3>
                <ul className={styles.list}>
                  {section.items.map((item) => (
                    <li key={item} className={styles.item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {/* Espaciador para que el CTA flotante no tape el texto al final del scroll */}
          <div className={styles.spacer} />
        </div>

        <div className={styles.ctaBar}>
          <a href={wa} target="_blank" rel="noopener noreferrer" className={styles.ctaBtn}>
            RESERVAR PLAZA
          </a>
          <p className={styles.ctaSub}>Respuesta inmediata por WhatsApp</p>
        </div>
      </div>
    </div>
  )
}