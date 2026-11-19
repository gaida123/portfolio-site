import './work.css'
import { Link } from 'react-router-dom'
import { work } from '../content'
import { useFocus } from '../focus-context'
import { Heading, rich } from '../ui'

export default function Work() {
  const { focusProps } = useFocus()
  return (
    <div className="frame sub wk">
      <section className="wk-jobs">
        <Heading label={work.label} subtitle={work.subtitle} />
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
              <p className="wk-summary">{rich(j.summary)}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="wk-awards">
        <Heading as="h2" label={work.awardsLabel} subtitle={work.awardsSubtitle} />
        <ul className="wk-list">
          {work.awards.map((a) => {
            const body = (
              <>
                <h3>{a.title}</h3>
                <span className="wk-year">{a.year}</span>
                <p className="wk-sub">{a.detail}</p>
              </>
            )
            return (
              <li key={a.detail}>
                {a.slug ? (
                  <Link to={`/projects/${a.slug}`} className="wk-row wk-award" {...focusProps(`award:${a.slug}`)}>
                    {body}
                  </Link>
                ) : (
                  <div className="wk-row wk-award">{body}</div>
                )}
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
