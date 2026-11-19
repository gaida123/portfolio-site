import { Link } from 'react-router-dom'
import { about } from '../content'
import { useFocus } from '../focus-context'

export default function About() {
  const { focusProps } = useFocus()
  return (
    <>
      <div className="about-photo">
        <img src="/assets/about-portrait.jpg" alt={about.photoAlt} />
      </div>
      <div className="frame sub about">
        <h1 className="about-name">{about.name}</h1>
        <p className="about-lead">{about.subtitle}</p>
        <dl className="facts about-facts">
          {about.facts.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
          <div>
            <dt>{about.elsewhereLabel}</dt>
            <dd className="facts-links">
              {about.elsewhere.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  {...(l.href.startsWith('http') && { target: '_blank', rel: 'noreferrer' })}
                  {...focusProps(`about:${l.label}`)}
                >
                  {l.label}
                </a>
              ))}
            </dd>
          </div>
        </dl>
        <section className="stack">
          <h2 className="stack-label">{about.stackLabel}</h2>
          {/* Same table form as the facts above: group in the label column, tools on a shared column grid */}
          <dl className="facts">
            {about.stack.map((g) => (
              <div key={g.group}>
                <dt>{g.group}</dt>
                <dd>
                  <ul className="stack-tools">
                    {g.tools.map((t) => (
                      <li key={t.name}>{t.name}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </section>
        <div className="about-ctas">
          {about.ctas.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className={`pill-btn about-cta about-cta-${c.tone}`}
              {...focusProps(`about:${c.tone}`)}
            >
              {c.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
