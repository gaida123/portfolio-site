import './community.css'
import type { CSSProperties } from 'react'
import { community } from '../content'
import { useFocus } from '../focus-context'
import { Heading, rich } from '../ui'

export default function Community() {
  const { focusProps } = useFocus()

  return (
    <div className="frame sub">
      <Heading label={community.label} subtitle={community.subtitle} />
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
              {s.photo && <img src={s.photo} alt="" />}
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
    </div>
  )
}
