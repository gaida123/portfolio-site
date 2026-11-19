import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { projectDetails, projectPage, projects } from '../content'
import { useFocus } from '../focus-context'
import { stashProjectSlug } from '../project-return'

export default function ProjectDetail() {
  const { slug = '' } = useParams()
  // The key resets scroll position and the gallery when moving to the next project.
  return projectDetails[slug] ? <Detail key={slug} slug={slug} /> : <Navigate to="/projects" replace />
}

function Detail({ slug }: { slug: string }) {
  const navigate = useNavigate()
  const d = projectDetails[slug]
  const withPages = projects.items.filter((p) => p.slug && projectDetails[p.slug])
  const at = withPages.findIndex((p) => p.slug === slug)
  const project = withPages[at]
  const next = withPages[(at + 1) % withPages.length]

  const { keys } = useFocus()
  const [shot, setShot] = useState(0)
  const scroller = useRef<HTMLDivElement>(null)
  const github = useRef<HTMLAnchorElement>(null)
  const devpost = useRef<HTMLAnchorElement>(null)
  const upNext = useRef<HTMLAnchorElement>(null)
  const n = d.media.length
  const step = (by: number) => setShot((s) => (s + by + n) % n)
  const active = () => document.activeElement
  const nextSelected = () => active() === upNext.current
  const onActions = () => active() === github.current || active() === devpost.current
  const atBottom = () => {
    const el = scroller.current
    return !!el && el.scrollTop + el.clientHeight >= el.scrollHeight - 4
  }
  const select = (el: HTMLAnchorElement | null) => {
    el?.focus({ preventScroll: true })
    el?.scrollIntoView({ block: 'nearest' })
  }
  // Leave the action row / up-next and return to reading so ↓ can keep scrolling.
  const toReading = () => scroller.current?.focus({ preventScroll: true })

  // This page scrolls, so instead of a focus ring the keys act directly:
  // ←/→ gallery then GitHub → Devpost (stops), ↑/↓ scroll, A / Enter opens the selected control, X Devpost, B back.
  useEffect(() => {
    keys.current = (action) => {
      if (action === 'back') {
        // Prefer history back so Home → Projects → Detail becomes Home → Projects
        // (not Home → Projects → Projects). Cold-opened detail URLs have no prior entry.
        const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0
        if (idx > 0) {
          stashProjectSlug(slug)
          navigate(-1)
        } else {
          navigate('/projects', { state: { slug } })
        }
        return true
      }
      if (action === 'alt') {
        devpost.current?.click()
        return true
      }
      if (document.activeElement?.getAttribute('data-focus-id') === 'nav:back') {
        // On the header's Back button: ↓ returns to reading, Enter / A presses Back, other arrows do nothing.
        if (action === 'down') toReading()
        return action !== 'open'
      }
      if (action === 'up') {
        if (nextSelected() || onActions()) {
          toReading()
          return true
        }
        // At the top of the page, ↑ moves focus up to the Back button.
        if (!scroller.current?.scrollTop) return false
        scroller.current.scrollBy({ top: -240 })
        return true
      }
      if (action === 'down') {
        if (onActions()) toReading()
        if (nextSelected()) return true
        if (atBottom()) {
          select(upNext.current)
          return true
        }
        scroller.current?.scrollBy({ top: 240 })
        // After the last scroll step, land on "See the next project".
        if (atBottom()) select(upNext.current)
        return true
      }
      if (action === 'right') {
        if (active() === github.current) {
          select(devpost.current)
          return true
        }
        if (active() === devpost.current || nextSelected()) return true // end of the row
        // After the last shot, or once you've scrolled into the write-up, → picks GitHub.
        if (shot >= n - 1 || (scroller.current?.scrollTop ?? 0) > 0) {
          select(github.current)
          return true
        }
        step(1)
        return true
      }
      if (action === 'left') {
        if (active() === devpost.current) {
          select(github.current)
          return true
        }
        if (active() === github.current) {
          toReading()
          return true
        }
        if (nextSelected() || shot <= 0) return true
        step(-1)
        return true
      }
      if (action === 'open') {
        if (nextSelected()) upNext.current?.click()
        else if (active() === devpost.current) devpost.current?.click()
        else github.current?.click()
      }
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
              <a className="btn btn-primary" ref={github} href={d.github} target="_blank" rel="noreferrer" tabIndex={-1}>
                <span className="face" aria-hidden="true">A</span>
                {projectPage.github}
              </a>
              <a className="btn" ref={devpost} href={d.devpost} target="_blank" rel="noreferrer" tabIndex={-1}>
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

        <Link className="up-next" ref={upNext} to={`/projects/${next.slug}`} tabIndex={-1}>
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
