import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { projectDetails, projectPage, projects } from '../content'
import { useFocus } from '../focus-context'

export default function ProjectDetail() {
  const { slug = '' } = useParams()
  // The key resets scroll position and the gallery when moving to the next project.
  return projectDetails[slug] ? <Detail key={slug} slug={slug} /> : <Navigate to="/projects" replace />
}

function Detail({ slug }: { slug: string }) {
  const d = projectDetails[slug]
  const withPages = projects.items.filter((p) => p.slug && projectDetails[p.slug])
  const at = withPages.findIndex((p) => p.slug === slug)
  const project = withPages[at]
  const next = withPages[(at + 1) % withPages.length]

  const { keys } = useFocus()
  const navigate = useNavigate()
  const [shot, setShot] = useState(0)
  const scroller = useRef<HTMLDivElement>(null)
  const github = useRef<HTMLAnchorElement>(null)
  const devpost = useRef<HTMLAnchorElement>(null)
  const n = d.media.length
  const step = (by: number) => setShot((s) => (s + by + n) % n)

  // This page scrolls, so instead of a focus ring the keys act directly:
  // ←/→ gallery, ↑/↓ scroll, A / Enter GitHub, X Devpost, B back to the carousel on this project.
  useEffect(() => {
    keys.current = (action) => {
      if (action === 'back') {
        navigate('/projects', { state: { slug } })
        return true
      }
      if (action === 'alt') {
        devpost.current?.click()
        return true
      }
      if (document.activeElement?.getAttribute('data-focus-id') === 'nav:back') {
        // On the header's Back button: ↓ returns to reading, Enter / A presses Back, other arrows do nothing.
        if (action === 'down') scroller.current?.focus({ preventScroll: true })
        return action !== 'open'
      }
      // At the top of the page, ↑ moves focus up to the Back button.
      if (action === 'up' && !scroller.current?.scrollTop) return false
      if (action === 'left' || action === 'right') step(action === 'right' ? 1 : -1)
      else if (action === 'up' || action === 'down') scroller.current?.scrollBy({ top: action === 'down' ? 240 : -240 })
      else if (action === 'open') github.current?.click()
      return true
    }
    return () => {
      keys.current = null
    }
  })

  return (
    <div className="detail-scroll" ref={scroller} tabIndex={-1}>
      <article className="detail">
        <h1>{project.name}</h1>
        <p className="detail-tagline">{d.tagline}</p>

        <div className="detail-main">
          <div className="detail-left">
            <div className="media-slide">
              <img src={d.media[shot].src} alt={d.media[shot].alt} />
              {n > 1 && (
                <>
                  <button className="media-arrow media-prev" aria-label={projectPage.prev} onClick={() => step(-1)}>
                    <img src="/assets/chevron-prev.svg" alt="" />
                  </button>
                  <button className="media-arrow media-next" aria-label={projectPage.nextImage} onClick={() => step(1)}>
                    <img src="/assets/chevron-next.svg" alt="" />
                  </button>
                  <p className="media-count">
                    {shot + 1} / {n}
                  </p>
                </>
              )}
            </div>
            {n > 1 && (
              <div className="media-thumbs">
                {d.media.map((m, i) => (
                  <button key={m.src} aria-label={m.alt} aria-current={i === shot || undefined} onClick={() => setShot(i)}>
                    <img src={m.src} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            )}

            <div className="detail-about">
              <h2>{projectPage.about}</h2>
              {d.sections.map((s) => (
                <section key={s.title}>
                  <h3>{s.title}</h3>
                  {s.blocks.map((b, i) =>
                    typeof b === 'string' ? (
                      <p key={i}>{b}</p>
                    ) : (
                      <ul key={i}>
                        {b.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ),
                  )}
                </section>
              ))}
            </div>
          </div>

          <aside className="detail-side">
            <img className="detail-cover" src={d.cover} alt="" />
            <p className="detail-summary">{d.summary}</p>
            <dl className="detail-facts">
              {d.facts.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
            <ul className="tags">
              {d.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <div className="detail-actions">
              <a className="btn btn-primary" ref={github} href={d.github} target="_blank" rel="noreferrer">
                <span className="face" aria-hidden="true">A</span>
                {projectPage.github}
              </a>
              <a className="btn" ref={devpost} href={d.devpost} target="_blank" rel="noreferrer">
                <span className="face" aria-hidden="true">X</span>
                {projectPage.devpost}
              </a>
            </div>
            <section className="highlights">
              <h2>{projectPage.highlights}</h2>
              <ul>
                {d.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </section>
          </aside>
        </div>

        <Link className="up-next" to={`/projects/${next.slug}`}>
          <img src={projectDetails[next.slug!].thumb ?? projectDetails[next.slug!].cover} alt="" />
          <div>
            <h2>{next.name}</h2>
            <p>{next.meta}</p>
          </div>
          <span className="btn">{projectPage.next}</span>
        </Link>
      </article>
    </div>
  )
}
