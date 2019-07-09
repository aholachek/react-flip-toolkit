import { tweenProp } from './'

describe('tweenProp', () => {
  it('interpolates a number from 0 - 1 to a given range ', () => {
    expect(tweenProp(5, 15, 0)).toBe(5)
    expect(tweenProp(5, 15, 1)).toBe(15)
    expect(tweenProp(5, 15, 0.5)).toBe(10)
    expect(tweenProp(5, 15, 0.75)).toBe(12.5)
  })
})
