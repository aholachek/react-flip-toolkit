import { getEasingName } from "../tween"

describe("getEasingName", () => {
  it("returns provided ease if it exists in shifty", () => {
    expect(getEasingName("easeInQuad")).toBe("easeInQuad")
  })

  it("defaults to easeOut if neither FlippedEase or FlipperEase are valid", () => {
    expect(getEasingName("fakeEase")).toBe("easeOutExpo")
  })
})
