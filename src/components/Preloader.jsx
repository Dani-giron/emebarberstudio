// Preloader/Hero — 1:1 con la referencia
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { CONTACT } from '../contact'
import styles from './Preloader.module.css'

gsap.registerPlugin(CustomEase)
CustomEase.create('hop', '0.85, 0, 0.15, 1')

const IMGS = [
  '/images/lado1.webp',   // lateral izquierdo
  '/images/lado2.webp',   // lateral izquierdo interior
  '/images/centro.webp',  // imagen central (se queda y se expande)
  '/images/lado1.webp',   // lateral derecho interior (se repite)
  '/images/lado2.webp',   // lateral derecho
]
const HERO_IDX = 2

export default function Preloader() {
  const overlayRef     = useRef(null)
  const counterRef     = useRef(null)
  const overlayTextRef = useRef(null)
  const imagesRef      = useRef(null)
  const imgRefs        = useRef([])
  const emeRef         = useRef(null)
  const subRef         = useRef(null)
  const ctaRef         = useRef(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const counter = { value: 0 }

    // ── 1. Contador ────────────────────────────────────────────────────────
    const counterTl = gsap.timeline({ delay: 0.5 })
    counterTl.to(counter, {
      value: 100,
      duration: 5,
      ease: 'power2.out',
      onUpdate() {
        if (counterRef.current)
          counterRef.current.querySelector('span').textContent = Math.floor(counter.value)
      },
    })

    // ── 2. Palabras ciclando ───────────────────────────────────────────────
    const textTrack = overlayTextRef.current.querySelector(`.${styles.overlayText}`)
    const overlayTextTl = gsap.timeline({ delay: 0.75 })
    overlayTextTl
      .to(textTrack, { y: '0',     duration: 0.75, ease: 'hop' })
      .to(textTrack, { y: '-2rem', duration: 0.75, ease: 'hop', delay: 0.75 })
      .to(textTrack, { y: '-4rem', duration: 0.75, ease: 'hop', delay: 0.75 })
      .to(textTrack, { y: '-6rem', duration: 0.75, ease: 'hop', delay: 1 })

    // ── 3. Reveal + wipe + título + CTAs ──────────────────────────────────
    const nonHeroImgs = imgRefs.current.filter((_, i) => i !== HERO_IDX)
    const heroImg     = imgRefs.current[HERO_IDX]

    const revealTl = gsap.timeline({ delay: 0.5 })

    revealTl.to(imgRefs.current, {
      y: 0, opacity: 1, stagger: 0.05, duration: 1, ease: 'hop',
    })

    revealTl.to(imagesRef.current, {
      gap: '0.75vw', duration: 1, delay: 0.5, ease: 'hop',
    })
    revealTl.to(imgRefs.current, {
      scale: 1, duration: 1, ease: 'hop',
    }, '<')

    revealTl.to(nonHeroImgs, {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
      duration: 1, stagger: 0.1, ease: 'hop',
    })

    // Escala según breakpoint actual
    const getScale = () => window.innerWidth <= 600 ? 3 : 1.3

    revealTl.to(heroImg, {
      scale: getScale(), duration: 1, ease: 'hop',
      onComplete() {
        // 1. force3D:false convierte matrix3d → scale() 2D
        //    → libera la capa GPU → Safari re-rasteriza a resolución nativa
        gsap.set(heroImg, { force3D: false, scale: getScale() })
        // 2. Quitar will-change del contenedor e imagen
        heroImg.style.willChange = 'auto'
        heroImg.querySelector('img').style.willChange = 'auto'
      },
    })

    // Corregir scale si el usuario cambia de resolución (DevTools / resize)
    const onResize = () => gsap.set(heroImg, { scale: getScale() })
    window.addEventListener('resize', onResize)

    // Desvanecer contador y texto al empezar el wipe
    revealTl.to([counterRef.current, overlayTextRef.current], {
      opacity: 0, duration: 0.4, ease: 'power2.out',
    })

    // Overlay wipe
    revealTl.to(overlayRef.current, {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
      duration: 1, ease: 'hop',
    }, '<0.1')

    // EME sube — en este momento también aparece la navbar
    revealTl.to(emeRef.current, {
      y: '0%', duration: 0.75, ease: 'power3.out',
      onStart: () => window.dispatchEvent(new CustomEvent('navbar-show')),
    }, '-=0.5')

    // BARBER STUDIO sube
    revealTl.to(subRef.current, {
      y: '0%', duration: 0.75, ease: 'power3.out',
    }, '-=0.6')

    // CTAs aparecen
    revealTl.to(ctaRef.current, {
      y: '0rem', opacity: 1, duration: 0.6, ease: 'power3.out',
    }, '-=0.4')

    revealTl.call(() => {
      document.body.style.overflow = ''
      window.dispatchEvent(new CustomEvent('preloader-done'))
    })

    return () => {
      counterTl.kill()
      overlayTextTl.kill()
      revealTl.kill()
      window.removeEventListener('resize', onResize)
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <section className={styles.hero} id="inicio">

      {/* Foto de fondo */}
      <div className={styles.bgPhoto}>
        <img src="/images/barberia%20buena.jpeg" alt="" aria-hidden="true" />
      </div>

      {/* Overlay oscuro */}
      <div ref={overlayRef} className={styles.heroOverlay} />

      {/* Contador — z:5 */}
      <div ref={counterRef} className={styles.counter}>
        <h1><span>0</span></h1>
      </div>

      {/* Texto ciclante — z:5 */}
      <div ref={overlayTextRef} className={styles.overlayTextContainer}>
        <div className={styles.overlayText}>
          <p>Corte</p>
          <p>Estilo</p>
          <p>Bienvenido</p>
        </div>
      </div>

      {/* Imágenes — z:2 */}
      <div ref={imagesRef} className={styles.heroImages}>
        {IMGS.map((src, i) => (
          <div
            key={i}
            ref={el => { imgRefs.current[i] = el }}
            className={`${styles.img} ${i === HERO_IDX ? styles.heroImg : ''}`}
          >
            <img src={src} alt="EME Studio Barber" />
          </div>
        ))}
      </div>

      {/* Título + CTAs — z:3 */}
      <div className={styles.heroHeader}>
        <div className={styles.emeMask}>
          <div ref={emeRef} className={styles.eme}>EME</div>
        </div>
        <div className={styles.subMask}>
          <div ref={subRef} className={styles.sub}>Barber Studio</div>
        </div>

        {/* CTAs — aparecen justo después del título */}
        <div ref={ctaRef} className={styles.cta}>
          <a
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.ctaBtn} ${styles.ctaBtnPrimary}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Reservar cita
          </a>
          <a
            href={`tel:${CONTACT.phone}`}
            className={`${styles.ctaBtn} ${styles.ctaBtnOutline}`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.45 2 2 0 0 1 3.57 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 6.29 6.29l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            Llamar ahora
          </a>
        </div>
      </div>

    </section>
  )
}
