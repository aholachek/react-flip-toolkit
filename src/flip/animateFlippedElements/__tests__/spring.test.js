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
        stiffness: 1,
        damping: 1,
        mass: 1,
        initialVelocity: 1,
        allowsOverdamping: true,
        overshootClamping: true,
        illegalVar: 1,
        anotherIllegalVar: 2
      }
    })
    expect(Spring.mock.calls[0][0]).toEqual({
      damping: 1,
      mass: 1,
      overshootClamping: true,
      stiffness: 1
    })
  })
  it("should call start", () => {
    springUpdate({
      getOnUpdateFunc: () => {}
    })
    expect(Spring.prototype.start).toBeCalled()
  })

  it("should return a stop function that calls spring.stop", () => {
    expect(Spring.prototype.stop).not.toBeCalled()
    const returnedFunc = springUpdate({
      getOnUpdateFunc: () => {}
    })

    returnedFunc()

    expect(Spring.prototype.stop).toBeCalled()
  })

  it("should delay calling start for the proper amount of time if delay argument is provided", () => {
    jest.useFakeTimers()

    springUpdate({
      getOnUpdateFunc: () => {},
      delay: 1000
    })

    Spring.prototype.start.mockClear()

    expect(Spring.prototype.start).not.toBeCalled()

    jest.advanceTimersByTime(500)

    expect(Spring.prototype.start).not.toBeCalled()

    jest.advanceTimersByTime(501)

    expect(Spring.prototype.start).toBeCalled()
  })

  it("the stop function should clear the timeout and prevent it from triggering if it hasnt yet", () => {
    Spring.prototype.start.mockClear()

    const returnedFunc = springUpdate({
      getOnUpdateFunc: () => {},
      delay: 10
    })

    returnedFunc()

    expect(Spring.prototype.start).not.toBeCalled()

    jest.advanceTimersByTime(50)

    expect(Spring.prototype.start).not.toBeCalled()
  })
})
