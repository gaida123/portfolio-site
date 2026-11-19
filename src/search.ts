// The search index: one flat list built from content.ts, so it never drifts from the pages.
import { about, community, home, nav, projects, prompts, search, site, work } from './content'

export type Entry = {
  title: string
  detail: string
  kind: string
  to?: string // in-site route
  state?: unknown // router state (which carousel slide to land on)
  href?: string // external link
  keywords?: string // matched but not shown
}

const k = search.kinds

export const entries: Entry[] = [
  ...nav.map((n) => ({
    title: n.label,
    detail: search.pageDetail,
    kind: k.page,
    to: n.path,
    keywords: n.path === '/about' ? `${about.name} ${about.subtitle} ${about.stackLabel} ${site.locationLines.join(' ')}` : undefined,
  })),
  ...projects.items.map((p) => ({
    title: p.name,
    detail: p.meta,
    kind: k.project,
    to: p.slug ? `/projects/${p.slug}` : '/projects',
    state: { slug: p.name },
    keywords: `${p.tags} ${p.summary}`,
  })),
  ...work.jobs.map((j) => ({ title: j.company, detail: j.role, kind: k.work, to: '/work', keywords: j.summary })),
  ...work.awards.map((a) => ({ title: a.title, detail: a.detail, kind: k.award, to: '/work' })),
  ...community.stops.map((s) => ({ title: s.name, detail: s.role, kind: k.community, to: '/community', keywords: s.blurb })),
  ...about.stack.flatMap((g) => g.tools.map((t) => ({ title: t.name, detail: g.group, kind: k.skill, to: '/about' }))),
  ...about.elsewhere.map((l) => ({
    title: l.href.startsWith('mailto:') ? prompts.email : l.label,
    detail: l.href.replace(/^(https?:\/\/|mailto:)/, ''),
    kind: k.link,
    href: l.href,
    keywords: 'contact',
  })),
  ...home.reading.map((r) => ({ title: r.title, detail: r.source, kind: k.reading, href: r.href })),
]

export const suggestions = search.suggestions.flatMap((title) => entries.find((e) => e.title === title) ?? [])

// Best first: title starts with the query, a word in the title starts with it, title contains it, then anything else.
export function find(query: string, limit = 7): Entry[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const rank = (e: Entry) => {
    const title = e.title.toLowerCase()
    if (title.startsWith(q)) return 0
    if (title.split(/[^a-z0-9]+/).some((word) => word.startsWith(q))) return 1
    if (title.includes(q)) return 2
    return `${e.detail} ${e.kind} ${e.keywords ?? ''} ${search.aliases[e.title] ?? ''}`.toLowerCase().includes(q) ? 3 : -1
  }
  return entries
    .map((e) => [rank(e), e] as const)
    .filter(([r]) => r >= 0)
    .sort((a, b) => a[0] - b[0])
    .slice(0, limit)
    .map(([, e]) => e)
}
