import tweenUpdate, { getEasingName } from "../tween"
import { Tweenable } from "../../../shifty/tweenable"

jest.mock("../../../shifty/tweenable")

const mockTweenThen = jest.fn(() => {
  return {
    catch: () => {}
  }
})

Tweenable.prototype.tween = jest.fn(() => {
  return {
    then: mockTweenThen
  }
})

describe("tweenUpdate", () => {
  it("should call setConfig with the appropriate config", () => {
    const fakeOnUpdate = () => {}
    tweenUpdate({
      duration: 1000,
      easing: "nonexistentEasing",
      onAnimationEnd: () => {},
      getOnUpdateFunc: () => {
        return fakeOnUpdate
      }
    })
    expect(Tweenable.prototype.setConfig).toBeCalledWith({
      duration: 1000,
      easing: "easeOutExpo",
      from: {
        currentValue: 0
      },
      step: fakeOnUpdate,
      to: {
        currentValue: 1
      }
    })
  })
  it("should call tween", () => {
    tweenUpdate({
      onAnimationEnd: () => {},
      getOnUpdateFunc: () => {}
    })
    expect(Tweenable.prototype.tween).toBeCalled()
  })

  it("should return a stop function that calls Tweenable.stop", () => {
    expect(Tweenable.prototype.stop).not.toBeCalled()
    const returnedFunc = tweenUpdate({
      onAnimationEnd: () => {},
      getOnUpdateFunc: () => {}
    })

    returnedFunc()

    expect(Tweenable.prototype.stop).toBeCalled()
  })

  it("should delay calling tween for the proper amount of time if delay argument is provided", () => {
    jest.useFakeTimers()
    Tweenable.prototype.tween.mockClear()

    tweenUpdate({
      onAnimationEnd: () => {},
      getOnUpdateFunc: () => {},
      delay: 1000
    })

    expect(Tweenable.prototype.tween).not.toBeCalled()
    jest.advanceTimersByTime(500)
    expect(Tweenable.prototype.tween).not.toBeCalled()
    jest.advanceTimersByTime(501)
    expect(Tweenable.prototype.tween).toBeCalled()
  })

  it("the stop function should clear the timeout and prevent it from triggering if it hasnt yet", () => {
    Tweenable.prototype.tween.mockClear()

    const returnedFunc = tweenUpdate({
      onAnimationEnd: () => {},
      getOnUpdateFunc: () => {},
      delay: 10
    })

    returnedFunc()

    expect(Tweenable.prototype.tween).not.toBeCalled()

    jest.advanceTimersByTime(50)

    expect(Tweenable.prototype.tween).not.toBeCalled()
  })
})

describe("getEasingName", () => {
  it("returns provided ease if it exists in shifty", () => {
    expect(getEasingName("easeInQuad")).toBe("easeInQuad")
  })

  it("defaults to easeOut if neither FlippedEase or FlipperEase are valid", () => {
    expect(getEasingName("fakeEase")).toBe("easeOutExpo")
  })
})
