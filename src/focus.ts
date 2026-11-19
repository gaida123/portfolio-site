// Pure focus / input-mode logic. No DOM here, so it can be tested on its own.

export type Mode = 'pointer' | 'keyboard'
export type Dir = 'up' | 'down' | 'left' | 'right'
export type Action = Dir | 'open' | 'alt' | 'back' | 'mail' | 'menu' | 'tab'

const KEYS: Record<string, Action> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  Enter: 'open',
  a: 'open',
  x: 'alt', // the X face button: a screen's secondary action
  b: 'back',
  Escape: 'back',
  Backspace: 'back',
  y: 'mail',
  q: 'menu',
  Tab: 'tab',
}

type KeyInfo = { key: string; ctrlKey?: boolean; metaKey?: boolean; altKey?: boolean }

// Typing in a field and browser shortcuts (Ctrl+A, Alt+←) are not ours to handle.
export function keyAction(e: KeyInfo, inEditable: boolean): Action | null {
  if (inEditable || e.ctrlKey || e.metaKey || e.altKey) return null
  return KEYS[e.key.length === 1 ? e.key.toLowerCase() : e.key] ?? null
}

export type Input = { mode: Mode; travel: number }
export const pointerInput: Input = { mode: 'pointer', travel: 0 }
export const keyboardInput: Input = { mode: 'keyboard', travel: 0 }

// Leave keyboard mode only after a real move of more than 4px in total:
// browsers fire zero-movement moves when content shifts under a still cursor.
export function movePointer(input: Input, dx: number, dy: number): Input {
  if (input.mode === 'pointer' || (dx === 0 && dy === 0)) return input
  const travel = input.travel + Math.hypot(dx, dy)
  return travel > 4 ? pointerInput : { mode: 'keyboard', travel }
}

export type Rect = { left: number; top: number; right: number; bottom: number }

const gap = (aMin: number, aMax: number, bMin: number, bMax: number) => Math.max(0, bMin - aMax, aMin - bMax)

// Spatial navigation: the nearest candidate in that direction, strongly preferring ones in line with `from`.
export function nextFocus<T extends { rect: Rect }>(from: Rect, candidates: T[], dir: Dir): T | null {
  const horizontal = dir === 'left' || dir === 'right'
  const sign = dir === 'right' || dir === 'down' ? 1 : -1
  const cx = (r: Rect) => (r.left + r.right) / 2
  const cy = (r: Rect) => (r.top + r.bottom) / 2
  let best: T | null = null
  let bestScore = Infinity
  for (const c of candidates) {
    const dx = cx(c.rect) - cx(from)
    const dy = cy(c.rect) - cy(from)
    // A candidate counts only if its centre is past `from`'s edge on that side.
    const past = horizontal
      ? sign * cx(c.rect) > sign * (sign > 0 ? from.right : from.left)
      : sign * cy(c.rect) > sign * (sign > 0 ? from.bottom : from.top)
    if (!past) continue
    const gapX = gap(from.left, from.right, c.rect.left, c.rect.right)
    const gapY = gap(from.top, from.bottom, c.rect.top, c.rect.bottom)
    const along = horizontal ? gapX : gapY
    const across = horizontal ? gapY : gapX
    // The centre distance only breaks ties between equally aligned candidates.
    const score = along + across * 2 + Math.hypot(dx, dy) / 1000
    if (score < bestScore) {
      best = c
      bestScore = score
    }
  }
  return best
}
