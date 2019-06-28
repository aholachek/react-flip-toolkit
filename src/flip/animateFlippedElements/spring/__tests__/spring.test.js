import { normalizeSpeed } from '../index'

describe('normalizeSpeed', () => {
  it('if not provided a number, it returns 1.1', () => {
    expect(normalizeSpeed(null)).toBe(1.1)
    expect(normalizeSpeed(undefined)).toBe(1.1)
    expect(normalizeSpeed('string')).toBe(1.1)
  })
  it('if provided 1, returns 6', () => {
    expect(normalizeSpeed(1)).toBe(6)
  })

  it('if provided 10, returns 6', () => {
    expect(normalizeSpeed(10)).toBe(6)
  })

  it('if provided 0, returns 1', () => {
    expect(normalizeSpeed(0)).toBe(1)
  })

  it('if provided -1, returns 1', () => {
    expect(normalizeSpeed(-1)).toBe(1)
  })
})
