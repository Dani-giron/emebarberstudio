import { CONTACT } from '../contact'
import styles from './Footer.module.css'

const NAV_LINKS = [
  { label: 'Inicio',    href: '#inicio' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Galería',   href: '#galeria' },
  { label: 'Nosotros',  href: '#nosotros' },
  { label: 'Cursos',    href: '#cursos' },
  { label: 'Ubicación', href: '#ubicacion' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>

        {/* Marca */}
        <div className={styles.brand}>
          <span className={styles.logo}>EME<span>Studio</span></span>
          <p className={styles.tagline}>
            Barbería premium en Zaragoza.<br />La experiencia que mereces.
          </p>
          {/* Redes sociales */}
          <div className={styles.social}>
            <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href={CONTACT.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.29 6.29 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.67a8.21 8.21 0 004.8 1.54V6.69a4.85 4.85 0 01-1.03 0z"/></svg>
            </a>
          </div>
        </div>

        {/* Navegación */}
        <nav className={styles.nav} aria-label="Footer navigation">
          <p className={styles.navTitle}>Navegación</p>
          <ul>
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contacto */}
        <div className={styles.contact}>
          <p className={styles.navTitle}>Contacto</p>
          <p>{CONTACT.address}</p>
          <p>{CONTACT.city}</p>
          <a href={`tel:${CONTACT.phone}`}>{CONTACT.phone}</a>
          <a
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn btn-primary ${styles.bookBtn}`}
          >
            Reservar cita
          </a>
        </div>

      </div>

      {/* Copyright */}
      <div className={styles.bottom}>
        <div className="container">
          <p>© {year} EME Studio Barber. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
