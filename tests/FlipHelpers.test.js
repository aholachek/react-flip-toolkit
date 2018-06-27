import { getEasingName } from "../src/flipHelpers"

describe("getEasingName", () => {
  it("flippedEase gets priority", () => {
    expect(getEasingName("easeInQuad", "linear")).toBe("easeInQuad")
  })

  it("otherwise, flipperEase wins", () => {
    expect(getEasingName(undefined, "linear")).toBe("linear")
  })

  it("defaults to easeOut if neither FlippedEase or FlipperEase are valid", () => {
    expect(getEasingName("fakeEase", "fakeEase2")).toBe("easeOutSine")
  })
})
