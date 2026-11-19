import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { site } from './content'
import { keyAction, keyboardInput, movePointer, nextFocus, pointerInput, type Action, type Input, type Mode } from './focus'

type FocusCtx = {
  mode: Mode
  /** False below 1280px: plain scrolling pages with no focus model, ring or key handling. */
  desktop: boolean
  /** The one highlighted item, or null while a control outside the model (Menu, Email, avatar) has keyboard focus. */
  focusedId: string | null
  focusProps: (id: string) => { 'data-focus-id': string; 'data-focused': '' | undefined; tabIndex: number | undefined }
  /** True when the current screen has focusable items (drives the Move / Open hints). */
  hasItems: boolean
  /** A screen can take over keys (carousel arrows, the detail page's A / X / B): return true when handled. */
  keys: RefObject<((action: Action) => boolean) | null>
  menuOpen: boolean
  openMenu: () => void
  closeMenu: () => void
  open: () => void
  back: () => void
}

const desktopQuery = matchMedia('(min-width: 1280px)')

const Ctx = createContext<FocusCtx | null>(null)
export const useFocus = () => useContext(Ctx)!

// The menu overlay, when open, is the only scope.
const items = () =>
  Array.from((document.querySelector('[data-focus-scope]') ?? document).querySelectorAll<HTMLElement>('[data-focus-id]'))
const focus = (el?: HTMLElement | null) => el?.focus({ preventScroll: true })

export function FocusProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const input = useRef<Input>(pointerInput)
  const [mode, setMode] = useState<Mode>('pointer')
  const [desktop, setDesktop] = useState(desktopQuery.matches)
  const [id, setId] = useState<string | null>(null)
  const [away, setAway] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hasItems, setHasItems] = useState(false)
  const wanted = useRef<string | null>(null)
  const beforeMenu = useRef<string | null>(null)
  const prevPath = useRef(pathname)
  const menuWas = useRef(menuOpen)
  const keys = useRef<((action: Action) => boolean) | null>(null)

  const current = () => items().find((el) => el.dataset.focusId === id) ?? null
  const openMenu = () => {
    beforeMenu.current = id
    wanted.current = `menu:${pathname}`
    setMenuOpen(true)
  }
  const closeMenu = () => {
    wanted.current = beforeMenu.current
    setMenuOpen(false)
  }
  const open = () => {
    const el = current()
    ;(el?.matches('a, button') ? el : el?.querySelector<HTMLElement>('a, button'))?.click()
  }
  // Back / Esc / B: previous page. Screens can still handle 'back' themselves (return true).
  // No in-app history (opened this URL cold) → Home. Focus restore on the destination is below.
  const back = () => {
    if (keys.current?.('back')) return
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0
    navigate(idx > 0 ? -1 : '/')
  }

  // After a route change or the menu opening/closing, decide where focus lands.
  useLayoutEffect(() => {
    const moved = prevPath.current !== pathname
    const menuClosed = menuWas.current && !menuOpen
    menuWas.current = menuOpen
    // Where focus goes when the screen has nothing in the focus model, so it is never lost to <body>.
    const fallback = () => {
      const h1 = document.querySelector<HTMLElement>('main h1')
      h1?.setAttribute('tabindex', '-1')
      return moved ? h1 : menuClosed ? document.querySelector<HTMLElement>('.prompt .hint') : null
    }
    // Home card ids are the route paths, so arriving from /work focuses the Work card.
    if (moved) {
      // /projects/etika counts as /projects here.
      wanted.current = prevPath.current.split('/').slice(0, 2).join('/')
      if (!desktop) window.scrollTo(0, 0)
    }
    prevPath.current = pathname
    if (!desktop) {
      // Mobile has no focus model; only move focus into the menu when it opens.
      setId(null)
      focus(menuOpen ? items()[0] : fallback())
      return
    }
    const all = items()
    const el =
      all.find((e) => e.dataset.focusId === wanted.current) ??
      all.find((e) => e.dataset.focusId === id && !(moved && id.startsWith('nav:'))) ??
      all.find((e) => 'focusDefault' in e.dataset) ??
      // Header items (Back) are never where a page starts; with nothing else, focus goes to the page title.
      all.find((e) => !e.dataset.focusId!.startsWith('nav:')) ??
      null
    wanted.current = null
    setId(el?.dataset.focusId ?? null)
    setAway(false)
    focus(el ?? fallback())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, menuOpen, desktop])

  useEffect(() => {
    document.documentElement.dataset.input = mode
  }, [mode])

  useEffect(() => {
    const onChange = () => setDesktop(desktopQuery.matches)
    desktopQuery.addEventListener('change', onChange)
    return () => desktopQuery.removeEventListener('change', onChange)
  }, [])

  // Items can appear after the route change (Community reveals its cards), so re-check on every render.
  useEffect(() => {
    if (!menuOpen) setHasItems(items().length > 0)
  })

  // Re-subscribed every render so the handlers always see current state.
  useEffect(() => {
    const root = document.documentElement
    const apply = (next: Input) => {
      input.current = next
      setMode(next.mode)
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (!desktop) {
        // Arrow keys must keep scrolling the page; Esc still closes the menu.
        if (e.key === 'Escape' && menuOpen) closeMenu()
        return
      }
      const t = e.target as HTMLElement
      const action = keyAction(e, t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))
      if (!action) return
      apply(keyboardInput)
      if (action === 'tab') return
      e.preventDefault()
      if (action === 'mail') {
        window.location.href = `mailto:${site.email}`
      } else if (action === 'back') {
        if (menuOpen) closeMenu()
        else if (pathname !== '/') back()
      } else if (!menuOpen && !(away && action === 'open') && keys.current?.(action)) {
        // handled by the current screen
      } else if (action === 'open') {
        if (e.repeat) return
        const el = away ? document.activeElement : current()
        // A focused card that is not itself a link opens the link inside it (Projects: "Read more").
        if (el instanceof HTMLElement) (el.matches('a, button') ? el : el.querySelector<HTMLElement>('a, button'))?.click()
      } else if (action !== 'alt') {
        const from = current()
        const all = items()
        if (away || !from) return focus(from ?? all[0])
        const rect = from.getBoundingClientRect()
        const others = all.filter((el) => el !== from).map((el) => ({ el, rect: el.getBoundingClientRect() }))
        focus(nextFocus(rect, others, action)?.el)
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      if (e.movementX === 0 && e.movementY === 0) return
      root.dataset.touch = String(e.pointerType === 'touch')
      apply(movePointer(input.current, e.movementX, e.movementY))
      if (!desktop || input.current.mode === 'keyboard' || e.pointerType === 'touch') return
      // Hover moves the one focus. Leaving the cards changes nothing, so the last focus stays.
      const el = e.target instanceof Element ? e.target.closest<HTMLElement>('[data-focus-id]') : null
      if (el) {
        setId(el.dataset.focusId!)
        setAway(false)
        focus(el)
      }
    }

    const onPointerDown = (e: PointerEvent) => {
      root.dataset.touch = String(e.pointerType === 'touch')
      apply(pointerInput)
      setAway(false)
    }

    // DOM focus is the source of truth for keyboard moves (arrows call .focus(), Tab moves it natively).
    const onFocusIn = (e: FocusEvent) => {
      const t = e.target as HTMLElement
      if (!desktop) return
      if (t.dataset.focusId) {
        setId(t.dataset.focusId)
        setAway(false)
      } else if (t.matches(':focus-visible')) {
        setAway(true)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('focusin', onFocusIn)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('focusin', onFocusIn)
    }
  })

  const focusedId = away ? null : id
  const focusProps = (itemId: string) => ({
    'data-focus-id': itemId,
    'data-focused': focusedId === itemId ? ('' as const) : undefined,
    // Roving tabindex on desktop; on mobile links keep their natural tab order.
    tabIndex: !desktop ? undefined : id === itemId ? 0 : -1,
  })

  return (
    <Ctx.Provider value={{ mode, desktop, focusedId, focusProps, hasItems, keys, menuOpen, openMenu, closeMenu, open, back }}>
      {children}
    </Ctx.Provider>
  )
}

/** The single ring. It lives in the stage and slides between targets in design pixels. */
export function FocusRing() {
  const { focusedId } = useFocus()
  const { pathname } = useLocation()
  const ref = useRef<HTMLDivElement>(null)
  const lastPath = useRef(pathname)

  useLayoutEffect(() => {
    const ring = ref.current!
    const el = focusedId ? document.querySelector<HTMLElement>(`[data-focus-id="${CSS.escape(focusedId)}"]`) : null
    const place = (jump: boolean) => {
      if (!el) {
        ring.style.opacity = '0'
        return
      }
      // offset* ignores transforms, so neither the stage scale nor the card's own grow skews the numbers.
      let x = 0
      let y = 0
      for (let n: HTMLElement | null = el; n && n !== ring.offsetParent; n = n.offsetParent as HTMLElement | null) {
        x += n.offsetLeft
        y += n.offsetTop
      }
      // The ring wraps the card at its focused size and position (grown, or lifted on Community).
      const css = getComputedStyle(el)
      const scale = parseFloat(css.getPropertyValue('--focus-scale')) || 1
      y -= parseFloat(css.getPropertyValue('--focus-lift')) || 0
      const w = el.offsetWidth * scale
      const h = el.offsetHeight * scale
      if (jump) ring.style.transition = 'none'
      ring.style.width = `${w}px`
      ring.style.height = `${h}px`
      ring.style.transform = `translate(${x - (w - el.offsetWidth) / 2}px, ${y - (h - el.offsetHeight) / 2}px)`
      ring.style.opacity = '1'
      if (jump) {
        void ring.offsetWidth // flush, so the jump is not animated
        ring.style.transition = ''
      }
    }
    // Slide between targets on one screen; jump when appearing, changing screen, or the window resizes.
    place(ring.style.opacity !== '1' || lastPath.current !== pathname)
    lastPath.current = pathname
    const onResize = () => place(true)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  })

  return <div ref={ref} className="ring" aria-hidden="true" />
}
