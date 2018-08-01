import { getStaggerConfig } from "../index"

describe("getStaggerConfig", () => {
  it("should allow user to pass in true and assign defaults", () => {
    expect(getStaggerConfig(true)).toEqual({
      key: "all",
      triggerNext: 0.15,
      drag: true
    })
  })

  it("should allow user to proved a stagger key and otherwise assign defaults", () => {
    expect(getStaggerConfig("staggerKey")).toEqual({
      key: "staggerKey",
      triggerNext: 0.15,
      drag: true
    })
  })

  it("should allow user to provide a config object and fill in missing sections with defaults", () => {
    expect(getStaggerConfig({ triggerNext: 0.8 })).toEqual({
      key: "all",
      triggerNext: 0.8,
      drag: true
    })

    expect(getStaggerConfig({ drag: false })).toEqual({
      key: "all",
      triggerNext: 0.15,
      drag: false
    })
  })
})
