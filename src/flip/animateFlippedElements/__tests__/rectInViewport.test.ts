import { rectInViewport } from '../index'

Object.defineProperty(window, 'innerHeight', {
  value: 100,
  writable: true
})

Object.defineProperty(window, 'innerWidth', {
  value: 100,
  writable: true
})

describe('rectInViewport', () => {
  it('returns true if rect is in viewport', () => {
    // @ts-ignore
    expect(rectInViewport({ top: 1, bottom: 99, left: 1, right: 99 })).toBe(
      true
    )
  })

  it('if rect isnt in viewport, returns false', () => {
    // @ts-ignore
    expect(rectInViewport({ top: 100, bottom: 101, left: 1, right: 99 })).toBe(
      false
    )
    // @ts-ignore
    expect(rectInViewport({ top: -1, bottom: 0, left: 1, right: 99 })).toBe(
      false
    )
    // @ts-ignore

    expect(rectInViewport({ top: 1, bottom: 99, left: 100, right: 101 })).toBe(
      false
    )
    // @ts-ignore

    expect(rectInViewport({ top: 1, bottom: 99, left: -1, right: 0 })).toBe(
      false
    )
  })
})
