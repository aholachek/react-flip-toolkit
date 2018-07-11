import React from "../../../../../Library/Caches/typescript/2.9/node_modules/@types/react"
import { Flipped } from "../../src/Flipped"
import TestRenderer from "../../../../../Library/Caches/typescript/2.9/node_modules/@types/react-test-renderer"

describe("Flipped Component", () => {
  it("adds a data-flip-id prop", () => {
    const testRenderer = TestRenderer.create(
      <Flipped flipId="foo">
        <div />
      </Flipped>
    )
    expect(testRenderer.toJSON().props["data-flip-id"]).toEqual("foo")
  })
  it("adds a data-inverse-flip-id prop", () => {
    const testRenderer = TestRenderer.create(
      <Flipped inverseFlipId="foo2">
        <div />
      </Flipped>
    )
    expect(testRenderer.toJSON().props["data-inverse-flip-id"]).toEqual("foo2")
  })
  it("puts the data-flip-component-id directly onto the props as well for performance reasons", () => {
    const testRenderer = TestRenderer.create(
      <Flipped componentId="fooComponent">
        <div />
      </Flipped>
    )
    expect(testRenderer.toJSON().props["data-flip-component-id"]).toEqual(
      "fooComponent"
    )
  })
  it("adds all data transform attributes if none are specified", () => {
    const testRenderer = TestRenderer.create(
      <Flipped flipId="foo">
        <div />
      </Flipped>
    )

    const flipConfig = JSON.parse(
      testRenderer.toJSON().props["data-flip-config"]
    )

    expect(flipConfig).toEqual({ translate: true, scale: true, opacity: true })
  })

  it("doesn't add any additional transform attributes if at least one was specified", () => {
    const testRenderer2 = TestRenderer.create(
      <Flipped flipId="foo" opacity>
        <div />
      </Flipped>
    )

    const flipConfig2 = JSON.parse(
      testRenderer2.toJSON().props["data-flip-config"]
    )

    expect(flipConfig2).toEqual({ opacity: true })
  })

  it("adds scale transforms", () => {
    const testRenderer = TestRenderer.create(
      <Flipped flipId="foo" scale>
        <div />
      </Flipped>
    )
    const flipConfig = JSON.parse(
      testRenderer.toJSON().props["data-flip-config"]
    )

    expect(flipConfig).toEqual({ scale: true })
  })

  it("adds translate transforms", () => {
    const testRenderer = TestRenderer.create(
      <Flipped flipId="foo" translate>
        <div />
      </Flipped>
    )

    const flipConfig = JSON.parse(
      testRenderer.toJSON().props["data-flip-config"]
    )

    expect(flipConfig).toEqual({ translate: true })
  })

  describe("spring props", () => {
    it("if it detects the ", () => {})
  })
})
