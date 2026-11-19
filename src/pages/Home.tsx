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
            <img className="capsule-cover" src="/assets/home-work.webp" alt="" />
            <span className="capsule-title">{lines(home.work)}</span>
          </Link>

          <Link to="/projects" className="card capsule capsule-projects" {...focusProps('/projects')}>
            <img className="capsule-cover" src="/assets/home-projects.jpg" alt="" />
            <span className="capsule-title">{lines(home.projects)}</span>
          </Link>

          <Link to="/community" className="card capsule capsule-community" {...focusProps('/community')}>
            <img className="capsule-cover" src="/assets/home-community.png" alt="" />
            <span className="capsule-title">{lines(home.community)}</span>
          </Link>
        </div>

        <h2 className="home-explore">{home.readingLabel}</h2>
        <ul className="rail">
          {home.reading.map((r) => (
            <li key={r.href}>
              <a
                className="card reading"
                href={r.href}
                target="_blank"
                rel="noreferrer"
                {...focusProps(r.href)}
              >
                <span className="rail-source">{r.source}</span>
                <span className="reading-title">{r.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
