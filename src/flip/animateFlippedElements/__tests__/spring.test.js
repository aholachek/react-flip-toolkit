import { Spring } from "wobble"
import springUpdate from "../spring"

jest.mock("wobble")

beforeEach(() => {
  Spring.mockClear()
})

describe("springUpdate", () => {
  it("should only allow whitelisted keys to be passed in as a springConfig ", () => {
    springUpdate({
      getOnUpdateFunc: () => {},
      springConfig: {
        stiffness: 50,
        damping: 20,
        mass: 200,
        initialVelocity: 1,
        allowsOverdamping: true,
        overshootClamping: true,
        illegalVar: 1,
        anotherIllegalVar: 2
      }
    })
    expect(Spring.mock.calls[0][0]).toEqual({
      damping: 20,
      mass: 1,
      overshootClamping: true,
      stiffness: 50
    })
  })
  it("should call start", () => {
    springUpdate({
      getOnUpdateFunc: () => {}
    })
    expect(Spring.prototype.start).toBeCalled()
  })

  it("should return the spring", () => {
    expect(Spring.prototype.stop).not.toBeCalled()
    const returnedSpringInstance = springUpdate({
      getOnUpdateFunc: () => {}
    })

    expect(returnedSpringInstance).toBeInstanceOf(Spring)

    returnedSpringInstance.stop()

    expect(Spring.prototype.stop).toBeCalled()
  })
})
