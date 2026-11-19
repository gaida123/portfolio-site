import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { home, site } from '../content'
import { useFocus } from '../focus-context'

const lines = (text: string[]) => text.map((line, i) => [i > 0 && <br key={i} />, line])

// Home card ids are the route they open, so Back can restore focus to the card you came from.
export default function Home() {
  const { focusProps } = useFocus()
  return (
    <>
      <div className="backdrop" aria-hidden="true">
        <img src="/assets/backdrop.webp" alt="" />
      </div>
      <div className="frame home">
        <h1 className="sr-only">{site.name}</h1>
        <h2 className="home-explore">{home.explore}</h2>

        <div className="home-row">
          <Link to="/about" className="card hero" {...focusProps('/about')}>
            <span className="hero-portrait">
              <img src="/assets/portrait.webp" alt="" />
            </span>
            <span className="hero-title">{lines(home.hero.title)}</span>
          </Link>

          <Link to="/work" className="card capsule capsule-work" {...focusProps('/work')}>
            <img className="badge badge-sarong" src="/assets/logo-sarong.webp" alt="" />
            <span className="badge badge-gettook">
              <img src="/assets/logo-gettook.webp" alt="" />
            </span>
            <img className="badge badge-didik" src="/assets/logo-didik.webp" alt="" />
            <span className="capsule-title">{lines(home.work)}</span>
          </Link>

          <Link to="/projects" className="card capsule capsule-projects" {...focusProps('/projects')}>
            <img className="shot shot-dashboard" src="/assets/polterguide-dashboard.webp" alt="" />
            <img className="shot shot-sop" src="/assets/polterguide-sop.webp" alt="" />
            <img className="shot shot-lockout" src="/assets/lockout-session.webp" alt="" />
            <span className="capsule-title">{lines(home.projects)}</span>
          </Link>

          <Link to="/community" className="card capsule capsule-community" {...focusProps('/community')}>
            <img className="capsule-photo" src="/assets/community.webp" alt="" />
            <span className="capsule-title">{lines(home.community)}</span>
          </Link>
        </div>

        <p className="home-caption">{home.hero.caption}</p>
        <p className="home-location">
          <img src="/assets/icon-map-pin.svg" alt="" aria-hidden="true" />
          {site.location}
        </p>

        <h2 className="pill">{home.readingLabel}</h2>
        <ul className="rail">
          {home.reading.map((r) => (
            <li key={r.href}>
              <p className="rail-source">{r.source}</p>
              <a
                className="card reading"
                href={r.href}
                target="_blank"
                rel="noreferrer"
                style={{ '--glow': r.glow } as CSSProperties}
                {...focusProps(r.href)}
              >
                {'image' in r.cover ? (
                  <span className="reading-cover reading-cover-art" aria-hidden="true">
                    <img src={r.cover.image} alt="" />
                  </span>
                ) : (
                  <span
                    className="reading-cover"
                    aria-hidden="true"
                    style={{
                      backgroundImage: `linear-gradient(162.27deg, ${r.cover.from} 14.286%, ${r.cover.to} 85.714%)`,
                    }}
                  >
                    {r.cover.label}
                  </span>
                )}
                <span className="reading-title">{r.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
