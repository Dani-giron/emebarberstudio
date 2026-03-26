// Gallery — slider 1:1 con la referencia (scriptrefe.js / stylesrefe.css)
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import styles from './Gallery.module.css'

gsap.registerPlugin(CustomEase)
// Ease del slider (diferente al "hop" del preloader)
CustomEase.create('sliderHop', 'M0,0 C0.488,0.02 0.467,0.286 0.5,0.5 0.532,0.712 0.58,1 1,1')

const SLIDES = [
  { name: 'Buzzcut',     img: '/images/buzzcut.webp'         },
  { name: 'Mid Fade',    img: '/images/midfade.webp'         },
  { name: 'High Fade',   img: '/images/highfade.webp'        },
  { name: 'Mullet',      img: '/images/mullet.webp'          },
  { name: 'Taper Fade',  img: '/images/taper%20fade.webp'   },
]
const TOTAL = SLIDES.length

const wrap = i => ((i % TOTAL) + TOTAL) % TOTAL

export default function Gallery() {
  const sliderRef  = useRef(null)
  const titleRef   = useRef(null)
  const previewRef = useRef(null)
  const counterRef = useRef(null)
  const itemsRef   = useRef(null)
  const animating  = useRef(false)
  const current    = useRef(0)   // índice 0-based activo
  const lightboxPopupRef = useRef(null)
  const [lightbox, setLightbox] = useState(null)
  const setLightboxRef = useRef(setLightbox)
  setLightboxRef.current = setLightbox

  // Animar entrada del lightbox
  useEffect(() => {
    if (lightbox && lightboxPopupRef.current) {
      gsap.fromTo(lightboxPopupRef.current,
        { scale: 0.88, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.35, ease: 'power2.out' })
    }
  }, [lightbox])

  const closeLightbox = () => {
    if (lightboxPopupRef.current) {
      gsap.to(lightboxPopupRef.current, {
        scale: 0.88, opacity: 0, duration: 0.25, ease: 'power2.in',
        onComplete: () => setLightbox(null),
      })
    } else {
      setLightbox(null)
    }
  }

  useLayoutEffect(() => {
    const slider = sliderRef.current

    const clip = {
      closed: 'polygon(25% 30%, 75% 30%, 75% 70%, 25% 70%)',
      open:   'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    }
    const pos = {
      prev:   { left: '15%', rotation: -90 },
      active: { left: '50%', rotation:   0 },
      next:   { left: '85%', rotation:  90 },
    }

    // ── Setup inicial ────────────────────────────────────────────────────
    ;['prev', 'active', 'next'].forEach(p => {
      const el = slider.querySelector(`[data-pos="${p}"]`)
      gsap.set(el, { ...pos[p], xPercent: -50, yPercent: -50,
        clipPath: p === 'active' ? clip.open : clip.closed })
      if (p !== 'active')
        gsap.set(el.querySelector(`.${styles.slideImg}`), { rotation: -pos[p].rotation })
    })

    // Título inicial: split por caracteres + entrada
    const initH1 = titleRef.current.querySelector('h1')
    splitChars(initH1)
    gsap.fromTo(initH1.querySelectorAll('span'), { y: 60 },
      { y: 0, duration: 1, stagger: 0.02, ease: 'sliderHop' })

    updateCounterAndHighlight(0)

    // ── Eventos ──────────────────────────────────────────────────────────
    slider.addEventListener('click', onSliderClick)
    itemsRef.current.querySelectorAll('p').forEach((item, i) => {
      item.addEventListener('click', () => {
        if (i !== current.current && !animating.current)
          transition(i > current.current ? 'next' : 'prev')
      })
    })

    // Reset posiciones al cambiar de resolución
    let resizeTimer
    function onResize() {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        if (animating.current) return
        slider.querySelectorAll('[data-pos]').forEach(el => {
          const p = el.dataset.pos
          if (!pos[p]) return
          gsap.set(el, { ...pos[p], xPercent: -50, yPercent: -50,
            clipPath: p === 'active' ? clip.open : clip.closed })
          if (p !== 'active') {
            const imgEl = el.querySelector(`.${styles.slideImg}`)
            if (imgEl) gsap.set(imgEl, { rotation: -pos[p].rotation })
          }
        })
      }, 150)
    }
    window.addEventListener('resize', onResize)

    return () => {
      slider.removeEventListener('click', onSliderClick)
      window.removeEventListener('resize', onResize)
      clearTimeout(resizeTimer)
      gsap.killTweensOf(slider.querySelectorAll('*'))
      slider.querySelectorAll('[data-pos]').forEach(el => gsap.set(el, { clearProps: 'all' }))
    }

    // ── Helpers ──────────────────────────────────────────────────────────
    function onSliderClick(e) {
      const el = e.target.closest('[data-pos]')
      if (!el || animating.current) return
      if (el.dataset.pos === 'active') {
        const img = el.querySelector('img')
        setLightboxRef.current({ src: img.src, alt: img.alt })
      } else if (el.dataset.pos === 'next') transition('next')
      else if (el.dataset.pos === 'prev') transition('prev')
    }

    function splitChars(el) {
      el.innerHTML = el.innerText.split('')
        .map(c => `<span>${c === ' ' ? '&nbsp;&nbsp;' : c}</span>`).join('')
    }

    function getIdx(offset) { return wrap(current.current + offset) }

    function animateSlideEl(el, props) {
      gsap.to(el, { ...props, duration: 2, ease: 'sliderHop' })
      gsap.to(el.querySelector(`.${styles.slideImg}`),
        { rotation: -props.rotation, duration: 2, ease: 'sliderHop' })
    }

    function createSlide(slide, dataPos) {
      const el = document.createElement('div')
      el.className = styles.slideContainer
      el.dataset.pos = dataPos
      el.innerHTML = `<div class="${styles.slideImg}">
        <img src="${slide.img}" alt="${slide.name}" /></div>`
      return el
    }

    function animateTitle(slide, direction) {
      const h1 = document.createElement('h1')
      h1.innerText = slide.name
      titleRef.current.appendChild(h1)
      splitChars(h1)

      const yOff = direction === 'next' ? 60 : -60
      gsap.set(h1.querySelectorAll('span'), { y: yOff })
      gsap.to(h1.querySelectorAll('span'),
        { y: 0, duration: 1.25, stagger: 0.02, ease: 'sliderHop', delay: 0.25 })

      const old = titleRef.current.querySelector('h1:not(:last-child)')
      if (old) {
        gsap.to(old.querySelectorAll('span'), {
          y: -yOff, duration: 1.25, stagger: 0.02, ease: 'sliderHop', delay: 0.25,
          onComplete: () => old.remove(),
        })
      }
    }

    function updatePreview(slide) {
      const img = document.createElement('img')
      img.src = slide.img
      img.alt = slide.name
      previewRef.current.appendChild(img)
      gsap.fromTo(img, { opacity: 0 }, {
        opacity: 1, duration: 1, ease: 'power2.inOut', delay: 0.5,
        onComplete: () => previewRef.current.querySelector('img:not(:last-child)')?.remove(),
      })
    }

    function updateCounterAndHighlight(idx) {
      counterRef.current.textContent = idx + 1
      itemsRef.current.querySelectorAll('p').forEach((p, i) =>
        p.classList.toggle(styles.activeItem, i === idx))
    }

    function transition(direction) {
      if (animating.current) return
      animating.current = true

      const [outPos, inPos] = direction === 'next' ? ['prev', 'next'] : ['next', 'prev']
      const outEl  = slider.querySelector(`[data-pos="${outPos}"]`)
      const actEl  = slider.querySelector('[data-pos="active"]')
      const inEl   = slider.querySelector(`[data-pos="${inPos}"]`)

      animateSlideEl(inEl,  { ...pos.active,    clipPath: clip.open })
      animateSlideEl(actEl, { ...pos[outPos],   clipPath: clip.closed })
      gsap.to(outEl, { scale: 0, opacity: 0, duration: 2, ease: 'sliderHop' })

      const newSlide = createSlide(SLIDES[getIdx(direction === 'next' ? 2 : -2)], inPos)
      slider.appendChild(newSlide)
      gsap.set(newSlide, { ...pos[inPos], xPercent: -50, yPercent: -50,
        scale: 0, opacity: 0, clipPath: clip.closed })
      gsap.to(newSlide, { scale: 1, opacity: 1, duration: 2, ease: 'sliderHop' })

      const nextIdx = getIdx(direction === 'next' ? 1 : -1)
      animateTitle(SLIDES[nextIdx], direction)
      updatePreview(SLIDES[nextIdx])

      setTimeout(() => updateCounterAndHighlight(nextIdx), 1000)
      setTimeout(() => {
        outEl.remove()
        actEl.dataset.pos = outPos
        inEl.dataset.pos  = 'active'
        newSlide.dataset.pos = inPos
        current.current = nextIdx
        animating.current = false
      }, 2000)
    }
  }, [])

  return (
    <section className={styles.gallery} id="galeria">
      {lightbox && (
        <div className={styles.lightboxBackdrop} onClick={closeLightbox}>
          <div
            ref={lightboxPopupRef}
            className={styles.lightboxPopup}
            onClick={e => e.stopPropagation()}
          >
            <button className={styles.lightboxClose} onClick={closeLightbox}>✕</button>
            <img src={lightbox.src} alt={lightbox.alt} />
          </div>
        </div>
      )}
      <div ref={sliderRef} className={styles.slider}>

        {/* Slides iniciales */}
        <div className={styles.slideContainer} data-pos="prev">
          <div className={styles.slideImg}>
            <img src={SLIDES[wrap(-1)].img} alt={SLIDES[wrap(-1)].name} />
          </div>
        </div>
        <div className={styles.slideContainer} data-pos="active">
          <div className={styles.slideImg}>
            <img src={SLIDES[0].img} alt={SLIDES[0].name} />
          </div>
        </div>
        <div className={styles.slideContainer} data-pos="next">
          <div className={styles.slideImg}>
            <img src={SLIDES[1].img} alt={SLIDES[1].name} />
          </div>
        </div>

        {/* Título animado por caracteres */}
        <div ref={titleRef} className={styles.sliderTitle}>
          <h1>{SLIDES[0].name}</h1>
        </div>

        {/* Contador */}
        <div className={styles.sliderCounter}>
          <p>
            <span ref={counterRef}>1</span>
            <span>/</span>
            <span>{TOTAL}</span>
          </p>
        </div>

        {/* Lista lateral */}
        <div ref={itemsRef} className={styles.sliderItems}>
          {SLIDES.map((s, i) => (
            <p key={i} className={i === 0 ? styles.activeItem : ''}>{s.name}</p>
          ))}
        </div>

        {/* Preview de fondo */}
        <div ref={previewRef} className={styles.sliderPreview}>
          <img src={SLIDES[0].img} alt="" />
        </div>

      </div>
    </section>
  )
}
