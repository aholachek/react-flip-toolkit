import { shouldApplyTransform } from "../index"

describe("shouldApplyTransform", () => {
  it("returns true if either id passes the flipComponentIdFilter", () => {
    expect(shouldApplyTransform(["foo", "bar"], "foo", "whooaa")).toBe(true)
    expect(shouldApplyTransform(["foo", "bar"], "huh", "bar")).toBe(true)
    expect(shouldApplyTransform("bar", "huh", "bar")).toBe(true)
  })

  it("returns false if neither id passes the flipComponentIdFilter", () => {
    expect(shouldApplyTransform(["foo", "bar"], "foot", "whooaa")).toBe(false)
    expect(shouldApplyTransform("bar", "huh", "bart")).toBe(false)
  })
})
