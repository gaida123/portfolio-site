import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Link, Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { nav, projects, prompts, search, site } from './content'
import { FocusProvider, FocusRing, useFocus } from './focus-context'
import About from './pages/About'
import Community from './pages/Community'
import Home from './pages/Home'
import ProjectDetail from './pages/ProjectDetail'
import Projects from './pages/Projects'
import Work from './pages/Work'
import Search from './SearchPanel'

export default function App() {
  return (
    <BrowserRouter>
      <FocusProvider>
        <Shell />
      </FocusProvider>
    </BrowserRouter>
  )
}

function Shell() {
  const { menuOpen } = useFocus()
  const { pathname } = useLocation()

  useEffect(() => {
    const slug = pathname.split('/')[2]
    const page = slug ? projects.items.find((p) => p.slug === slug)?.name : nav.find((n) => n.path === pathname)?.label
    document.title = page && pathname !== '/' ? `${page} · ${site.name}` : site.name
  }, [pathname])
  const [searchOpen, setSearchOpen] = useState(false)
  const lastFocus = useRef<HTMLElement | null>(null)

  const openSearch = () => {
    lastFocus.current = document.activeElement as HTMLElement | null
    setSearchOpen(true)
  }

  // "/" opens search from anywhere, except while typing or in the menu.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey || menuOpen || searchOpen) return
      if (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return
      e.preventDefault()
      openSearch()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  // Closing puts focus back where it was (if that element is still on screen).
  useEffect(() => {
    if (!searchOpen) lastFocus.current?.focus({ preventScroll: true })
  }, [searchOpen])

  return (
    <div className="stage">
      <div inert={menuOpen || searchOpen}>
        <Header onSearch={openSearch} />
        <main className="page">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/work" element={<Work />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/community" element={<Community />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <PromptBar />
      </div>
      {menuOpen && <Menu />}
      {searchOpen && <Search onClose={() => setSearchOpen(false)} />}
      <FocusRing />
    </div>
  )
}

function Clock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return <time className="clock" aria-hidden="true">{now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</time>
}

function Header({ onSearch }: { onSearch: () => void }) {
  const { focusProps, back } = useFocus()
  const onSubPage = useLocation().pathname !== '/'
  return (
    <header className="header">
      <div className="header-left">
        {/* In the focus model, so ↑ from the top of any page reaches it and Enter / A presses it */}
        {onSubPage && (
          <button className="header-back" onClick={back} {...focusProps('nav:back')}>
            <img src="/assets/chevron-prev.svg" alt="" />
            {prompts.back}
          </button>
        )}
        <button className="header-search" onClick={onSearch} aria-label={search.open} aria-keyshortcuts="/">
        <img src="/assets/icon-search.svg" alt="" />
        <kbd className="kbd key-hint">/</kbd>
        </button>
      </div>
      <div className="status">
        <img src="/assets/icon-settings.svg" alt="" aria-hidden="true" />
        <img src="/assets/icon-bell.svg" alt="" aria-hidden="true" />
        <img src="/assets/icon-wifi.svg" alt="" aria-hidden="true" />
        <span className="battery" aria-hidden="true" />
        <Clock />
        <Link to="/" className="avatar" aria-label="Home">
          <img src="/assets/backdrop.webp" alt="" />
        </Link>
      </div>
    </header>
  )
}

function PromptBar() {
  const { hasItems, focusedId, openMenu, open, back } = useFocus()
  // "Open" only when the focused item is, or contains, a link or button (Community cards and image-less slides are not).
  const focused = focusedId ? document.querySelector(`[data-focus-id="${CSS.escape(focusedId)}"]`) : null
  const canOpen = !!focused?.matches('a, button, :has(a, button)')
  const onSubPage = useLocation().pathname !== '/'
  return (
    <footer className="prompt">
      <button className="hint" onClick={openMenu}>
        <img src="/assets/glyph-menu.svg" alt="" aria-hidden="true" />
        {prompts.menu}
      </button>
      <div className="hints">
        {hasItems && (
          <span className="hint key-hint">
            <img src="/assets/glyph-dpad.svg" alt="" aria-hidden="true" />
            {prompts.move}
          </span>
        )}
        {canOpen && (
          // Mouse convenience only: keyboard users press Enter or A.
          <button className="hint key-hint" tabIndex={-1} onClick={open}>
            <span className="face" aria-hidden="true">A</span>
            {prompts.open}
          </button>
        )}
        {onSubPage && (
          <button className="hint key-hint" onClick={back}>
            <span className="face" aria-hidden="true">B</span>
            {prompts.back}
          </button>
        )}
        <a className="hint" href={`mailto:${site.email}`}>
          <span className="face" aria-hidden="true">Y</span>
          {prompts.email}
        </a>
      </div>
    </footer>
  )
}

function Menu() {
  const { focusProps, closeMenu } = useFocus()
  return (
    <div className="menu" onClick={(e) => e.target === e.currentTarget && closeMenu()}>
      <div className="menu-panel" role="dialog" aria-modal="true" aria-label={prompts.menu} data-focus-scope>
        <p className="menu-label" aria-hidden="true">{prompts.menu}</p>
        <nav>
          <ul>
            {nav.map((n) => (
              <li key={n.path}>
                <NavLink to={n.path} end className="menu-item" onClick={closeMenu} {...focusProps(`menu:${n.path}`)}>
                  {n.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <button className="hint menu-close" onClick={closeMenu} {...focusProps('menu:close')}>
          <span className="face" aria-hidden="true">B</span>
          {prompts.close}
        </button>
      </div>
    </div>
  )
}
