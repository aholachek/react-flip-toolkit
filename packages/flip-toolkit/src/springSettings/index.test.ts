import { getSpringConfig, springPresets } from './index'

describe('getSpringConfig', () => {
  it('should default to noWobble settings if nothing is provided', () => {
    expect(getSpringConfig()).toEqual(springPresets.noWobble)
  })

  it('should allow the use of a valid spring referring to a preset ', () => {
    expect(
      getSpringConfig({
        flipperSpring: 'wobbly',
        flippedSpring: undefined
      })
    ).toEqual(springPresets.wobbly)

    expect(
      getSpringConfig({
        flippedSpring: undefined,
        flipperSpring: 'stiff'
      })
    ).toEqual(springPresets.stiff)
  })

  it('should allow the passing in of an object, and use noWobble to fill in missing keys', () => {
    expect(
      getSpringConfig({
        flippedSpring: undefined,
        flipperSpring: { stiffness: 400 }
      })
    ).toEqual({
      stiffness: 400,
      damping: 26
    })
  })

  it('should always override what is provided in flippedSpring with the data in flipperSpring if it exists', () => {
    expect(
      getSpringConfig({
        flipperSpring: { stiffness: 400, damping: 700 },
        flippedSpring: 'stiff'
      })
    ).toEqual(springPresets.stiff)
  })
})
