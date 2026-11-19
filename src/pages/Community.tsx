import './community.css'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { community, pageCtas } from '../content'
import { useFocus } from '../focus-context'
import { Heading, rich } from '../ui'

export default function Community() {
  const { focusProps } = useFocus()

  return (
    <div className="frame sub">
      <Heading label={community.label} />
      <ul className="cm-shelf">
        {community.stops.map((s, i) => (
          // Focus lands on the newest entry, the first one in reading order.
          <li
            key={s.name}
            className="cm-card"
            style={{ '--i': i } as CSSProperties}
            {...focusProps(`stop:${i}`)}
            {...(i === 0 && { 'data-focus-default': '' })}
          >
            {/* Without a photo the cover is the organisation's name set in display type */}
            <div className={`cm-cover${s.photo ? ' cm-has-photo' : ''}`}>
              {s.photo && (
                <img
                  src={s.photo}
                  alt=""
                  style={s.photoPosition ? { objectPosition: s.photoPosition } : undefined}
                />
              )}
              <h2 className="cm-name">{s.name}</h2>
            </div>
            <div className="cm-body">
              <p className="cm-role">{s.role}</p>
              <p className="cm-dates">{s.dates}</p>
              <p className="cm-blurb">{rich(s.blurb)}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="about-ctas about-ctas-center community-ctas">
        {pageCtas('community').map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className={`pill-btn about-cta about-cta-${c.tone}`}
            {...focusProps(`community:${c.tone}`)}
          >
            {c.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
