import { expect, test } from 'vitest'
import { keyAction, keyboardInput, movePointer, nextFocus, pointerInput, type Dir, type Rect } from './focus'

test('focus and input-mode logic', () => {
  // Keys
  expect(keyAction({ key: 'ArrowDown' }, false)).toBe('down')
  expect(keyAction({ key: 'A' }, false)).toBe('open')
  expect(keyAction({ key: 'Q' }, false)).toBe('menu')
  expect(keyAction({ key: 'Backspace' }, false)).toBe('back')
  expect(keyAction({ key: 'Backspace' }, true)).toBeNull() // typing in an input
  expect(keyAction({ key: 'a', ctrlKey: true }, false)).toBeNull()
  expect(keyAction({ key: 'Shift' }, false)).toBeNull() // modifier-only

  // Keyboard mode survives a still cursor and jitter, and ends after more than 4px of real movement
  let input = movePointer(keyboardInput, 0, 0)
  expect(input).toBe(keyboardInput)
  input = movePointer(input, 2, 0)
  input = movePointer(input, 0, 2)
  expect(input.mode).toBe('keyboard')
  input = movePointer(input, 1, 0)
  expect(input).toBe(pointerInput)

  // Current Home spatial map — geometry from styles.css (1440 frame, 72px gutter).
  // Top row: hero + three capsules; below: four equal reading-rail cards.
  const r = (left: number, top: number, w: number, h: number): Rect => ({ left, top, right: left + w, bottom: top + h })
  const gap = 13.5
  const capW = 188.229
  const capH = 274.5
  const rowTop = 174
  const capTop = rowTop + (279 - capH) / 2
  const heroLeft = 72
  const heroW = 690.75
  const railTop = 560
  const railH = 132
  const railGap = 18
  const railW = (1296 - railGap * 3) / 4
  const homeLayout: Record<string, Rect> = {
    hero: r(heroLeft, rowTop, heroW, 279),
    projects: r(heroLeft + heroW + gap, capTop, capW, capH),
    community: r(heroLeft + heroW + gap + capW + gap, capTop, capW, capH),
    work: r(heroLeft + heroW + gap + (capW + gap) * 2, capTop, capW, capH),
    read0: r(heroLeft, railTop, railW, railH),
    read1: r(heroLeft + railW + railGap, railTop, railW, railH),
    read2: r(heroLeft + (railW + railGap) * 2, railTop, railW, railH),
    read3: r(heroLeft + (railW + railGap) * 3, railTop, railW, railH),
  }
  const go = (from: string, dir: Dir) =>
    nextFocus(
      homeLayout[from],
      Object.keys(homeLayout)
        .filter((id) => id !== from)
        .map((id) => ({ id, rect: homeLayout[id] })),
      dir,
    )?.id ?? null

  expect(go('hero', 'right')).toBe('projects')
  expect(go('projects', 'right')).toBe('community')
  expect(go('community', 'right')).toBe('work')
  expect(go('work', 'right')).toBeNull()
  expect(go('work', 'left')).toBe('community')
  expect(go('projects', 'left')).toBe('hero')
  // Wide hero: its centre sits between the first two rail cards; spatial nav picks read1.
  expect(go('hero', 'down')).toBe('read1')
  expect(go('projects', 'down')).toBe('read2')
  expect(go('community', 'down')).toBe('read3')
  expect(go('work', 'down')).toBe('read3')
  expect(go('read0', 'right')).toBe('read1')
  expect(go('read2', 'right')).toBe('read3')
  expect(go('read0', 'up')).toBe('hero')
  expect(go('hero', 'up')).toBeNull()
  // Edges stay put: a card lower down is not "to the left"
  expect(go('hero', 'left')).toBeNull()
  expect(go('read0', 'left')).toBeNull()
  expect(go('read3', 'right')).toBeNull()
  expect(go('read3', 'down')).toBeNull()
})
