import React from "react"
import { Flipped } from "../src/Flipped"
import TestRenderer from "react-test-renderer"

describe("Flipped Component", () => {
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

    expect(testRenderer.toJSON().props["data-flip-opacity"]).toBe(true)
    expect(testRenderer.toJSON().props["data-flip-scale"]).toBe(true)
    expect(testRenderer.toJSON().props["data-flip-translate"]).toBe(true)
  })

  it("doesn't add any additional transform attributes if at least one was specified", () => {
    const testRenderer = TestRenderer.create(
      <Flipped flipId="foo" scale>
        <div />
      </Flipped>
    )

    expect(testRenderer.toJSON().props["data-flip-scale"]).toBe(true)
    expect(testRenderer.toJSON().props["data-flip-opacity"]).toBe(undefined)
    expect(testRenderer.toJSON().props["data-flip-translate"]).toBe(undefined)

    const testRenderer2 = TestRenderer.create(
      <Flipped flipId="foo" opacity>
        <div />
      </Flipped>
    )

    expect(testRenderer2.toJSON().props["data-flip-opacity"]).toBe(true)
    expect(testRenderer2.toJSON().props["data-flip-scale"]).toBe(undefined)
    expect(testRenderer2.toJSON().props["data-flip-translate"]).toBe(undefined)
  })

  it("adds scale transforms", () => {
    const testRenderer = TestRenderer.create(
      <Flipped flipId="foo" scale>
        <div />
      </Flipped>
    )

    expect(testRenderer.toJSON().props["data-flip-scale"]).toBe(true)
    expect(testRenderer.toJSON().props["data-flip-opacity"]).toBe(undefined)
    expect(testRenderer.toJSON().props["data-flip-translate"]).toBe(undefined)
  })

  it("adds translate transforms", () => {
    const testRenderer = TestRenderer.create(
      <Flipped flipId="foo" translate>
        <div />
      </Flipped>
    )

    expect(testRenderer.toJSON().props["data-flip-scale"]).toBe(undefined)
    expect(testRenderer.toJSON().props["data-flip-opacity"]).toBe(undefined)
    expect(testRenderer.toJSON().props["data-flip-translate"]).toBe(true)
  })

 describe('spring props', () => {

  it('if it detects the ', () => {
    
  });

 });
})
