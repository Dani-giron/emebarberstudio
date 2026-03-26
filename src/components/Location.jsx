import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CONTACT } from '../contact'
import styles from './Location.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function Location() {
  const infoRef = useRef(null)
  const mapRef  = useRef(null)

  useEffect(() => {
    gsap.fromTo(infoRef.current.children,
      { x: -40, opacity: 0 },
      {
        x: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: infoRef.current, start: 'top 80%' },
      }
    )
    gsap.fromTo(mapRef.current,
      { x: 40, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: mapRef.current, start: 'top 80%' },
      }
    )
  }, [])

  return (
    <section className={styles.location} id="ubicacion">
      <div className={`container ${styles.inner}`}>

        {/* Info */}
        <div ref={infoRef} className={styles.info}>
          <span className="section-label">Encuéntranos</span>
          <h2 className="section-title">Dónde estamos</h2>
          <div className="divider" />

          {/* Dirección */}
          <div className={styles.block}>
            <span className={styles.blockIcon} aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </span>
            <div>
              <p className={styles.blockTitle}>Dirección</p>
              <p className={styles.blockVal}>{CONTACT.address}</p>
              <p className={styles.blockVal}>{CONTACT.city}</p>
            </div>
          </div>

          {/* Teléfono */}
          <div className={styles.block}>
            <span className={styles.blockIcon} aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            </span>
            <div>
              <p className={styles.blockTitle}>Teléfono</p>
              <a href={`tel:${CONTACT.phone}`} className={styles.blockLink}>{CONTACT.phone}</a>
            </div>
          </div>

          {/* Horario */}
          <div className={styles.block}>
            <span className={styles.blockIcon} aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </span>
            <div>
              <p className={styles.blockTitle}>Horario</p>
              {CONTACT.schedule.map((s) => (
                <div key={s.day} className={styles.schedRow}>
                  <span className={styles.schedDay}>{s.day}</span>
                  <span className={`${styles.schedHours} ${s.hours === 'Cerrado' ? styles.closed : ''}`}>
                    {s.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <a
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn btn-primary ${styles.cta}`}
          >
            Reservar ahora
          </a>
        </div>

        {/* Mapa */}
        <div ref={mapRef} className={styles.mapWrap}>
          <iframe
            title="Ubicación EME Studio Barber"
            src={CONTACT.mapSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

      </div>
    </section>
  )
}
