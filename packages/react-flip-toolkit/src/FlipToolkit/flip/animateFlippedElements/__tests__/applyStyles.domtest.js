import { createApplyStylesFunc, invertTransformsForChildren } from '../index'
const testEl = document.querySelector('#test')

describe('invertTransformsForChildren', () => {
  it('should ignore children that do not exist in the DOM', () => {
    testEl.innerHTML = `
    <div data-flip-id="id-1" >
    <div data-inverse-flip-id="id-1" style="height:100px; width: 100px; opacity: .5"></div>
    </div>
  `
    const orphanedEl = document.createElement('div')
    const invertedChildren = [
      document.querySelector('[data-inverse-flip-id="id-1"]'),
      orphanedEl
    ].map(el => [el, { translate: true }])
    const matrix = [1.5, null, null, 2, 25, 35]
    const body = document.querySelector('body')
    invertTransformsForChildren({ invertedChildren, matrix, body })

    expect(invertedChildren[0][0].style.transform).to.equal(
      'translate(-16.6667px, -17.5px)'
    )
    expect(invertedChildren[1][0].style.transform).to.equal('')
  })
  it('should apply a counter translation to children that request it', () => {
    testEl.innerHTML = `
    <div data-flip-id="id-1" >
    <div data-inverse-flip-id="id-1" style="height:100px; width: 100px; opacity: .5"></div>
    <div data-inverse-flip-id="id-1" style="height:200px; width: 100px;"></div>
    </div>
  `
    const invertedChildren = [
      ...document.querySelectorAll('[data-inverse-flip-id="id-1"]')
    ].map((el, i) => [el, { translate: i === 0 ? true : false }])
    const matrix = [1, null, null, 2, 25, 20]
    const body = document.querySelector('body')
    invertTransformsForChildren({ invertedChildren, matrix, body })

    expect(invertedChildren[0][0].style.transform).to.equal(
      'translate(-25px, -10px)'
    )
    expect(invertedChildren[1][0].style.transform).to.equal('')
  })
  it('should apply a counter scale to children that request it', () => {
    testEl.innerHTML = `
    <div data-flip-id="id-1" >
    <div data-inverse-flip-id="id-1" style="height:100px; width: 100px; opacity: .5"></div>
    <div data-inverse-flip-id="id-1" style="height:200px; width: 100px;"></div>
    </div>
  `
    const invertedChildren = [
      ...document.querySelectorAll('[data-inverse-flip-id="id-1"]')
    ].map((el, i) => [el, { scale: i === 0 ? true : false }])
    const matrix = [1.5, null, null, 2, 25, 35]
    const body = document.querySelector('body')
    invertTransformsForChildren({ invertedChildren, matrix, body })

    expect(invertedChildren[0][0].style.transform).to.equal(
      'scale(0.666667, 0.5)'
    )
    expect(invertedChildren[1][0].style.transform).to.equal('')
  })

  it('should apply both a counter scale and a counter transform to children that request it', () => {
    testEl.innerHTML = `
    <div data-flip-id="id-1" >
    <div data-inverse-flip-id="id-1" style="height:100px; width: 100px; opacity: .5"></div>
    <div data-inverse-flip-id="id-1" style="height:200px; width: 100px;"></div>
    </div>
  `
    const invertedChildren = [
      ...document.querySelectorAll('[data-inverse-flip-id="id-1"]')
    ].map((el, i) => [
      el,
      { scale: i === 0 ? true : false, translate: i === 0 ? true : false }
    ])
    const matrix = [1.5, null, null, 2, 25, 35]
    const body = document.querySelector('body')
    invertTransformsForChildren({ invertedChildren, matrix, body })

    expect(invertedChildren[0][0].style.transform).to.equal(
      'translate(-16.6667px, -17.5px) scale(0.666667, 0.5)'
    )
    expect(invertedChildren[1][0].style.transform).to.equal('')
  })
})

describe('createApplyStylesFunc', () => {
  it('should create a function to apply the matrix transform to the element', () => {
    testEl.innerHTML = `
    <div data-flip-id="id-1" >
    </div>
  `
    const body = document.querySelector('body')
    const element = document.querySelector('[data-flip-id="id-1"]')
    const invertedChildren = []

    const applyStyles = createApplyStylesFunc({
      element,
      invertedChildren,
      body
    })

    applyStyles({
      matrix: [0.2, 0, 0, 0.5, -300, 250]
    })
    expect(element.style.transform).to.equal(
      'matrix(0.2, 0, 0, 0.5, -300, 250)'
    )
  })

  it('that function should apply the opacity style to the element if opacity is a number', () => {
    testEl.innerHTML = `
    <div data-flip-id="id-1" >
    </div>
  `
    const body = document.querySelector('body')
    const element = document.querySelector('[data-flip-id="id-1"]')
    const invertedChildren = []

    const applyStyles = createApplyStylesFunc({
      element,
      invertedChildren,
      body
    })
    applyStyles({
      matrix: [0.2, 0, 0, 0.5, -300, 250],
      opacity: 'invalid opacity value here'
    })

    expect(element.style.opacity).to.equal('')

    applyStyles({
      matrix: [0.2, 0, 0, 0.5, -300, 250],
      opacity: 0.5
    })
    expect(element.style.opacity).to.equal('0.5')
  })

  it('that function should apply a min-width of 1px and/or min-height of 1px if the forceMinWidth or forceMinHeight args are provided ', () => {
    testEl.innerHTML = `
    <div data-flip-id="id-1" >
    </div>
  `
    const body = document.querySelector('body')
    const element = document.querySelector('[data-flip-id="id-1"]')
    const invertedChildren = []

    const applyStyles = createApplyStylesFunc({
      element,
      invertedChildren,
      body
    })

    expect(element.style.minWidth).to.equal('')
    expect(element.style.minHeight).to.equal('')

    applyStyles({
      matrix: [0.2, 0, 0, 0.5, -300, 250],
      forceMinVals: true
    })

    expect(element.style.minWidth).to.equal('1px')
    expect(element.style.minHeight).to.equal('1px')
  })

  it('should apply the identity transform if requested to do so', () => {
    const body = document.querySelector('body')
    const element = document.querySelector('[data-flip-id="id-1"]')
    const invertedChildren = []

    const applyStyles = createApplyStylesFunc({
      element,
      invertedChildren,
      body
    })
    applyStyles({
      matrix: [1, 0, 0, 1, 0, 0]
    })

    expect(element.style.transform).to.equal('matrix(1, 0, 0, 1, 0, 0)')
  })
})
