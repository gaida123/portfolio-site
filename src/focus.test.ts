import { expect, test } from 'vitest'
import { keyAction, keyboardInput, movePointer, nextFocus, pointerInput, type Dir, type Rect } from './focus'

test('focus and input-mode logic', () => {
  // Keys
  expect(keyAction({ key: 'ArrowDown' }, false)).toBe('down')
  expect(keyAction({ key: 'A' }, false)).toBe('open')
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

  // Home spatial map, using the Figma frame's geometry
  const r = (left: number, top: number, w: number, h: number): Rect => ({ left, top, right: left + w, bottom: top + h })
  const home: Record<string, Rect> = {
    hero: r(40.5, 174, 753.75, 279),
    work: r(807.75, 176.25, 188.2, 274.5),
    projects: r(1009.5, 176.25, 188.2, 274.5),
    community: r(1211.25, 176.25, 188.2, 274.5),
    nature: r(40.5, 600, 441, 189),
    iea: r(499.5, 600, 441, 189),
    forex: r(958.5, 600, 441, 189),
  }
  const go = (from: string, dir: Dir) =>
    nextFocus(
      home[from],
      Object.keys(home)
        .filter((id) => id !== from)
        .map((id) => ({ id, rect: home[id] })),
      dir,
    )?.id ?? null

  expect(go('hero', 'right')).toBe('work')
  expect(go('work', 'right')).toBe('projects')
  expect(go('projects', 'right')).toBe('community')
  expect(go('community', 'right')).toBeNull()
  expect(go('community', 'left')).toBe('projects')
  expect(go('work', 'left')).toBe('hero')
  expect(go('hero', 'down')).toBe('nature')
  expect(go('work', 'down')).toBe('iea')
  expect(go('community', 'down')).toBe('forex')
  expect(go('nature', 'right')).toBe('iea')
  expect(go('nature', 'up')).toBe('hero')
  expect(go('hero', 'up')).toBeNull()
  // Edges stay put: a card lower down is not "to the left"
  expect(go('hero', 'left')).toBeNull()
  expect(go('nature', 'left')).toBeNull()
  expect(go('forex', 'right')).toBeNull()
  expect(go('forex', 'down')).toBeNull()
})
