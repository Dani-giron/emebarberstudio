import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { CONTACT } from '../contact'
import styles from './CourseModal.module.css'

export default function CourseModal({ course, onClose }) {
  const overlayRef = useRef(null)
  const sheetRef = useRef(null)

  useEffect(() => {
    const scrollY = window.scrollY

document.body.style.position = 'fixed'
document.body.style.top = `-${scrollY}px`
document.body.style.left = '0'
document.body.style.right = '0'

    gsap.fromTo(overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 }
    )

    gsap.fromTo(sheetRef.current,
      { y: '100%' },
      { y: '0%', duration: 0.5, ease: 'power3.out' }
    )

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const handleClose = useCallback(() => {
    gsap.to(sheetRef.current, {
      y: '100%',
      duration: 0.4,
      ease: 'power3.in'
    })

    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        document.body.style.overflow = ''
        onClose()
      }
    })
  }, [onClose])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleClose])

  const wa = `${CONTACT.whatsappBase}?text=${encodeURIComponent(
    `Hola, quiero reservar una plaza en el ${course.title}`
  )}`
  useEffect(() => {
  const el = sheetRef.current

  const onWheel = (e) => {
    const scrollContainer = el.querySelector(`.${styles.body}`)
    if (!scrollContainer) return

    // Si el usuario puede scrollear dentro → lo hacemos manual
    const canScroll =
      scrollContainer.scrollHeight > scrollContainer.clientHeight

    if (canScroll) {
      e.preventDefault()
      scrollContainer.scrollTop += e.deltaY
    }
  }

  el.addEventListener('wheel', onWheel, { passive: false })

  return () => {
    el.removeEventListener('wheel', onWheel)
  }
}, [])

  return (
    <div ref={overlayRef} className={styles.overlay} onClick={handleClose}>
      <div
        ref={sheetRef}
        className={styles.sheet}
        onClick={(e) => e.stopPropagation()}
      >

        <div className={styles.bg}>
          <img src="/images/barberia%20buena.jpeg" alt="" />
        </div>

        <div className={styles.header}>
          <span className={styles.brand}>EME BARBER STUDIO</span>
          <button className={styles.close} onClick={handleClose}>✕</button>
        </div>

        <div className={styles.body}>
          <h2 className={styles.title}>{course.title}</h2>
          <p className={styles.price}>{course.price}</p>

          {course.program.map((section) => (
            <div key={section.label}>
              <h3 className={styles.sectionLabel}>{section.label}</h3>
              <ul>
                {section.items.map((item) => (
                  <li key={item} className={styles.item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}

          <div style={{ height: '6rem' }} />
        </div>

        <div className={styles.ctaBar}>
          <a href={wa} target="_blank" className={styles.ctaBtn}>
            RESERVAR POR WHATSAPP
          </a>
          <p className={styles.ctaSub}>Plazas limitadas</p>
        </div>

      </div>
    </div>
  )
}