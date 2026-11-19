import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { pageCtas, projects } from '../content'
import { useFocus } from '../focus-context'
import { peekProjectSlug, takeProjectSlug } from '../project-return'
import { Heading } from '../ui'

export default function Projects() {
  const { desktop, focusProps, focusedId, keys } = useFocus()
  const items = projects.items
  const n = items.length
  // Coming back from a detail page lands on that project's slide.
  // Search can also send you to a slide, by slug or name, even when you are already here.
  const location = useLocation()
  const wanted = () => {
    const from = location.state?.slug ?? peekProjectSlug()
    return from ? items.findIndex((p) => p.slug === from || p.name === from) : -1
  }
  const [index, setIndex] = useState(() => Math.max(0, wanted()))
  const [instant, setInstant] = useState(false)
  const active = useRef<HTMLDivElement>(null)

  const go = (to: number) => {
    const next = ((to % n) + n) % n
    const step = Math.abs(next - index)
    // Neighbours glide. A jump across several slides (the dots) cuts instead, because cards
    // that wrap around the loop would otherwise slide across the screen.
    setInstant(step > 1 && step < n - 1)
    setIndex(next)
  }

  // While the slide has the focus, ←/→ change the slide instead of moving focus.
  useEffect(() => {
    keys.current = (dir) => {
      if (focusedId !== 'slide' || (dir !== 'left' && dir !== 'right')) return false
      go(index + (dir === 'right' ? 1 : -1))
      return true
    }
    return () => {
      keys.current = null
    }
  })

  useEffect(() => {
    const i = wanted()
    if (i >= 0) {
      takeProjectSlug()
      setInstant(true)
      setIndex(i)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key])

  // Keep DOM focus on whichever card is now in the centre.
  useEffect(() => {
    if (document.activeElement?.classList.contains('slide')) active.current?.focus({ preventScroll: true })
  }, [index])

  return (
    <>
      <div className="frame sub projects">
        <div className="projects-head">
          <Heading label={projects.label} />
        </div>
        <div className="carousel-controls">
          <div className="dots" aria-hidden="true">
            {items.map((p, i) => (
              <button key={p.name} tabIndex={-1} onClick={() => go(i)}>
                <img src={i === index ? '/assets/dot-active.svg' : '/assets/dot.svg'} alt="" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Every card sits in the centre slot and is shifted by its distance from the current one,
          so the loop needs no cloned cards and the focus ring never has to move. */}
      <div className={`carousel${instant ? ' instant' : ''}`}>
        {items.map((p, i) => {
          let offset = (((i - index) % n) + n) % n
          if (offset > n / 2) offset -= n
          const on = i === index
          // Below 1280px the cards are a plain stacked list, so every card is live.
          const live = on || !desktop
          return (
            <div
              key={p.name}
              className={`slide${Math.abs(offset) <= 1 ? ' near' : ''}`}
              style={{ '--offset': offset } as CSSProperties}
              // Clicking a neighbour brings it to the centre. Only "Read more" opens the link.
              {...(!live && { 'aria-hidden': true, onClick: () => go(i) })}
              {...(on && desktop && { ref: active, 'data-focus-default': '', ...focusProps('slide') })}
            >
              <div className="slide-text">
                <h2>{p.name}</h2>
                <p className="slide-meta">{p.meta}</p>
                <p className="slide-summary">{p.summary}</p>
                <p className="slide-tags">{p.tags}</p>
                {p.slug && (
                  <Link
                    className="pill-btn"
                    to={`/projects/${p.slug}`}
                    // On desktop the card holds the focus and Enter / A presses this button.
                    tabIndex={desktop ? -1 : undefined}
                    onClick={(e) => !live && e.preventDefault()}
                  >
                    {projects.readMore}
                  </Link>
                )}
              </div>
              <div className={`slide-panel${p.image ? '' : ' slide-panel-empty'}`} aria-hidden="true">
                {p.image ? (
                  <img
                    src={p.image.src}
                    alt=""
                    style={{ width: p.image.width, height: p.image.height, left: p.image.left }}
                  />
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
      <div className="about-ctas about-ctas-center projects-ctas">
        {pageCtas('projects').map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className={`pill-btn about-cta about-cta-${c.tone}`}
            {...focusProps(`projects:${c.tone}`)}
          >
            {c.label}
          </Link>
        ))}
      </div>
    </>
  )
}
