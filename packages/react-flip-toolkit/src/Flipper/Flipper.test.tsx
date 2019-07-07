import React from 'react'
import TestRenderer from 'react-test-renderer'
import Flipper from './index'

describe('Flipper Component', () => {
  it('allows you to customize the rendered component', () => {
    // @ts-ignore
    const testRenderer = TestRenderer.create(<Flipper element="ul" />)
    expect(testRenderer.toJSON()!.type).toEqual('ul')
  })
  it('renders a div by default', () => {
    // @ts-ignore
    const testRenderer = TestRenderer.create(<Flipper />)
    expect(testRenderer.toJSON()!.type).toEqual('div')
  })
  it('allows you to pass in a className string prop', () => {
    // @ts-ignore
    const testRenderer = TestRenderer.create(<Flipper className="foo-bar" />)
    expect(testRenderer.toJSON()!.props.className).toEqual('foo-bar')
  })
})
