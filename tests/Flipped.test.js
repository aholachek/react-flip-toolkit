import React from "react"
import { Flipped } from "../src/Flipped"
import TestRenderer from "react-test-renderer"

describe("Component", () => {
  it("adds a data-flip-id prop", () => {
    const testRenderer = TestRenderer.create(
      <Flipped flipId="foo">
        <div />
      </Flipped>
    )
    expect(testRenderer.toJSON().props["data-flip-id"]).toEqual("foo")
  })
  it("adds all data transform attributes if none are specified", () => {
    const testRenderer = TestRenderer.create(
      <Flipped flipId="foo">
        <div />
      </Flipped>
    )

    expect(testRenderer.toJSON().props["data-opacity"]).toBe(true)
    expect(testRenderer.toJSON().props["data-scale-x"]).toBe(true)
    expect(testRenderer.toJSON().props["data-scale-y"]).toBe(true)
    expect(testRenderer.toJSON().props["data-translate-x"]).toBe(true)
    expect(testRenderer.toJSON().props["data-translate-y"]).toBe(true)
  })

  it("doesn't add any additional transform attributes if at least one was specified", () => {
    const testRenderer = TestRenderer.create(
      <Flipped flipId="foo" scaleX>
        <div />
      </Flipped>
    )

    expect(testRenderer.toJSON().props["data-scale-x"]).toBe(true)
    expect(testRenderer.toJSON().props["data-opacity"]).toBe(undefined)
    expect(testRenderer.toJSON().props["data-scale-y"]).toBe(undefined)
    expect(testRenderer.toJSON().props["data-translate-x"]).toBe(undefined)
    expect(testRenderer.toJSON().props["data-translate-y"]).toBe(undefined)
  })
})
