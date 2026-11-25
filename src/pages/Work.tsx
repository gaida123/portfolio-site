import './work.css'
import { Link } from 'react-router-dom'
import { pageCtas, work } from '../content'
import { useFocus } from '../focus-context'
import { Heading } from '../ui'

export default function Work() {
  const { focusProps } = useFocus()
  return (
    <div className="frame sub wk">
      <section className="wk-jobs">
        <Heading label={work.label} />
        <ol className="wk-list">
          {work.jobs.map((j) => (
            <li key={j.company} className="wk-row wk-job">
              <span className="wk-plate">
                <img src={j.logo} alt="" />
              </span>
              <div className="wk-job-head">
                <h2>{j.company}</h2>
                <p className="wk-sub">{j.role}</p>
              </div>
              <p className="wk-when">
                {j.dates}
                {j.place && <span className="wk-sub">{j.place}</span>}
              </p>
              <p className="wk-summary">{j.summary}</p>
            </li>
          ))}
        </ol>
      </section>

      <footer className="wk-close">
        <p className="wk-more">{work.more}</p>
        <div className="about-ctas about-ctas-center work-ctas">
          {pageCtas('work').map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className={`pill-btn about-cta about-cta-${c.tone}`}
              {...focusProps(`work:${c.tone}`)}
            >
              {c.label}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  )
}
