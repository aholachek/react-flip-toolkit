import React from "react"
import Flipper from "../src/Flipper"
import TestRenderer from "react-test-renderer"

describe("Flipper Component", () => {
  it("allows you to customize the rendered component", () => {
    const testRenderer = TestRenderer.create(<Flipper element="ul" />)
    expect(testRenderer.toJSON().type).toEqual("ul")
  })
  it("renders a div by default", () => {
    const testRenderer = TestRenderer.create(<Flipper />)
    expect(testRenderer.toJSON().type).toEqual("div")
  })
  it("allows you to pass in a className string prop", () => {
    const testRenderer = TestRenderer.create(<Flipper className="foo-bar" />)
    expect(testRenderer.toJSON().props["className"]).toEqual("foo-bar")
  })
})
