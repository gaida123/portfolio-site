import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { search } from './content'
import { find, suggestions, type Entry } from './search'

/** Spotlight-style search: type to filter, ↑/↓ to pick, Enter to open, Esc to close. */
export default function Search({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [picked, setPicked] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLDivElement>(null)

  const results = find(query)
  const typed = query.trim() !== ''
  // With nothing typed, or nothing found, fall back to the suggestions.
  const rows = results.length ? results : suggestions
  const label = !typed ? search.suggested : results.length ? search.results : `${search.none} “${query.trim()}”. ${search.tryInstead}`

  useEffect(() => input.current?.focus(), [])
  useEffect(() => {
    const el = list.current
    const row = el?.querySelector<HTMLElement>(`#search-row-${picked}`)
    if (!el || !row) return
    const listBox = el.getBoundingClientRect()
    const rowBox = row.getBoundingClientRect()
    if (rowBox.top < listBox.top) el.scrollTop -= listBox.top - rowBox.top
    else if (rowBox.bottom > listBox.bottom) el.scrollTop += rowBox.bottom - listBox.bottom
  }, [picked])

  const open = (e: Entry) => {
    onClose()
    if (e.href) window.open(e.href, e.href.startsWith('mailto:') ? '_self' : '_blank', 'noreferrer')
    else if (e.to) navigate(e.to, { state: e.state })
  }

  const onKeyDown = (e: KeyboardEvent) => {
    e.stopPropagation() // Esc here closes search; it must not also act as "back" on the page behind
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      setPicked((p) => (p + (e.key === 'ArrowDown' ? 1 : -1) + rows.length) % rows.length)
    } else if (e.key === 'Enter') {
      if (rows[picked]) open(rows[picked])
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div className="search" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="search-panel" role="dialog" aria-modal="true" aria-label={search.placeholder} tabIndex={-1} onKeyDown={onKeyDown}>
        <div className="search-field">
          <img src="/assets/icon-search.svg" alt="" aria-hidden="true" />
          <input
            ref={input}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="search-list"
            aria-activedescendant={rows[picked] ? `search-row-${picked}` : undefined}
            aria-label={search.placeholder}
            placeholder={search.placeholder}
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPicked(0)
            }}
          />
          <button className="kbd" onClick={onClose} aria-label={search.close} tabIndex={-1}>
            esc
          </button>
        </div>
        <p className={`search-label${typed && !results.length ? ' search-note' : ''}`} aria-live="polite">
          {label}
        </p>
        <div ref={list} className="search-list" id="search-list" role="listbox" aria-label={label}>
          {rows.map((e, i) => (
            // The highlight follows `picked` only (keys and pointer share it), never :hover.
            <button
              key={`${e.kind}:${e.title}:${e.detail}`}
              id={`search-row-${i}`}
              className="search-row"
              role="option"
              aria-selected={i === picked}
              tabIndex={-1}
              onPointerMove={() => setPicked(i)}
              onClick={() => open(e)}
            >
              <span className="search-text">
                <span className="search-title">{e.title}</span>
                <span className="search-detail">{e.detail}</span>
              </span>
              <span className="search-kind">{e.kind}</span>
            </button>
          ))}
        </div>
        <p className="search-foot" aria-hidden="true">
          <span>
            <kbd className="kbd">↑</kbd>
            <kbd className="kbd">↓</kbd>
            {search.hintMove}
          </span>
          <span>
            <kbd className="kbd">↵</kbd>
            {search.hintOpen}
          </span>
          <span>
            <kbd className="kbd">esc</kbd>
            {search.close}
          </span>
        </p>
      </div>
    </div>
  )
}
