import styles from './Studio.module.css'

const PHOTOS = [
  { src: '/images/barberia%20buena.jpeg', pos: 'center center' },
  { src: '/images/barberiabuena2.webp',   pos: 'center center' },
]

export default function Studio() {
  return (
    <section className={styles.studio}>
      {PHOTOS.map((p, i) => (
        <div key={i} className={styles.photo}>
          <img src={p.src} alt="EME Studio Barber" style={{ objectPosition: p.pos }} />
        </div>
      ))}
    </section>
  )
}
