import type { ReactNode } from 'react'

/** The one heading style for every sub-page: caps label + one-line subtitle. */
export function Heading({ as: Tag = 'h1', label, subtitle }: { as?: 'h1' | 'h2'; label: string; subtitle: string }) {
  return (
    <header className="heading">
      <Tag className="heading-label">{label}</Tag>
      <p className="heading-sub">{subtitle}</p>
    </header>
  )
}

/** Renders **highlighted** words from content.ts as <strong>. */
export const rich = (text: string): ReactNode =>
  text.split('**').map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part))
