import sinon from 'sinon'
import animateUnflippedElements from './index'
const testEl = document.querySelector('#test')
const getElement = id => testEl.querySelector(`[data-flip-id=${id}]`)

function getBoundingClientRect(element) {
  const rect = element.getBoundingClientRect()
  return {
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    x: rect.x,
    y: rect.y
  }
}

describe('animateUnflippedElements', () => {

  it('should not add a temporary dataset flag to exiting or flipped elements', () => {
    testEl.innerHTML = ` <div>
    <div data-flip-id="id-1"></div>
    <div data-flip-id="id-3"></div>
    </div>
  `
    animateUnflippedElements({
      unflippedIds: ['id-1'],
      flipCallbacks: {},
      getElement,
      flippedElementPositionsAfterUpdate: { 'id-3': {} },
      flippedElementPositionsBeforeUpdate: { 'id-3': {}, 'id-1': {} }
    })

    expect(getElement('id-1').dataset.isAppearing).to.equal(undefined)
    expect(getElement('id-3').dataset.isAppearing).to.equal(undefined)
  })
  it('should return a function to call onAppear callbacks and pass in the correct element reference', () => {
    testEl.innerHTML = ` <div>
    <div data-flip-id="id-1"></div>
    <div data-flip-id="id-2"></div>
    <div data-flip-id="id-3"></div>
    <div data-flip-id="id-4"></div>
    </div>
  `
    const fakeOnAppear1 = sinon.fake()
    const fakeOnAppear2 = sinon.fake()
    const fakeOnAppear3 = sinon.fake()

    const { animateEnteringElements } = animateUnflippedElements({
      unflippedIds: ['id-1', 'id-3', 'id-4'],
      flipCallbacks: {
        'id-1': { onAppear: fakeOnAppear1 },
        'id-2': { onAppear: fakeOnAppear2 },
        'id-3': { onAppear: fakeOnAppear3 }
      },
      getElement,
      flippedElementPositionsAfterUpdate: { 'id-1': {}, 'id-3': {} },
      flippedElementPositionsBeforeUpdate: {}
    })
    animateEnteringElements()
    expect(fakeOnAppear1.callCount).to.equal(1)
    expect(fakeOnAppear2.callCount).to.equal(0)
    expect(fakeOnAppear3.callCount).to.equal(1)
  })

  it('should return a function to immediately apply an opacity of 0 to elements with an onAppear callback', () => {
    testEl.innerHTML = ` <div>
    <div data-flip-id="id-1"></div>
    <div data-flip-id="id-2"></div>
    <div data-flip-id="id-3"></div>
    <div data-flip-id="id-4"></div>
    </div>
  `
    const fakeOnAppear1 = sinon.fake()
    const fakeOnAppear2 = sinon.fake()

    const { hideEnteringElements } = animateUnflippedElements({
      unflippedIds: ['id-1', 'id-2'],
      flipCallbacks: {
        'id-1': { onAppear: fakeOnAppear1 },
        'id-2': { onAppear: fakeOnAppear2 }
      },
      getElement: getElement,
      flippedElementPositionsAfterUpdate: { 'id-1': {}, 'id-2': {} },
      flippedElementPositionsBeforeUpdate: {}
    })
    hideEnteringElements()
    expect(getElement('id-1').style.opacity).to.equal('0')
    expect(getElement('id-2').style.opacity).to.equal('0')
  })

  it('should reinsert exited elements with onExit callbacks back into the DOM', () => {
    testEl.innerHTML = ` <div id="container">
    <div data-flip-id="id-2"></div>
    <div data-flip-id="id-3"></div>
    </div>
  `
    const fakeOnExit = sinon.fake()

    const exitedElement = document.createElement('div')
    const parent = testEl.querySelector('#container')

    expect(parent.contains(exitedElement)).to.equal(false)

    animateUnflippedElements({
      unflippedIds: ['id-1'],
      flipCallbacks: {
        'id-1': { onExit: fakeOnExit }
      },
      getElement: getElement,
      flippedElementPositionsAfterUpdate: {},
      inProgressAnimations: {},
      flippedElementPositionsBeforeUpdate: {
        'id-1': {
          domDataForExitAnimations: {
            element: exitedElement,
            parent: parent,
            childPosition: { top: 100, left: 200, width: 50, height: 75 }
          }
        }
      }
    })
    expect(parent.contains(exitedElement)).to.equal(true)
  })

  it('should make sure to reinsert the exited elements inside the correct parent (there could be multiple parents for exited elements)', () => {
    testEl.innerHTML = ` <div id="container">
    <div data-flip-id="id-3"></div>
    </div>
    <div id="container-2">
    <div data-flip-id="id-4"></div>
    </div>

  `
    const fakeOnExit = sinon.fake()

    const exitedElement1 = document.createElement('div')
    const parent1 = testEl.querySelector('#container')

    const exitedElement2 = document.createElement('div')
    const parent2 = testEl.querySelector('#container-2')

    expect(parent1.contains(exitedElement1)).to.equal(false)
    expect(parent2.contains(exitedElement1)).to.equal(false)
    expect(parent1.contains(exitedElement2)).to.equal(false)
    expect(parent2.contains(exitedElement2)).to.equal(false)

    animateUnflippedElements({
      unflippedIds: ['id-1', 'id-2'],
      flipCallbacks: {
        'id-1': { onExit: fakeOnExit },
        'id-2': { onExit: fakeOnExit }
      },
      getElement: getElement,
      flippedElementPositionsAfterUpdate: {},
      inProgressAnimations: {},
      flippedElementPositionsBeforeUpdate: {
        'id-1': {
          domDataForExitAnimations: {
            element: exitedElement1,
            parent: parent1,
            childPosition: { top: 100, left: 200, width: 50, height: 75 }
          }
        },
        'id-2': {
          domDataForExitAnimations: {
            element: exitedElement2,
            parent: parent2,
            childPosition: { top: 100, left: 200, width: 50, height: 75 }
          }
        }
      }
    })
    expect(parent1.contains(exitedElement1)).to.equal(true)
    expect(parent2.contains(exitedElement1)).to.equal(false)
    expect(parent1.contains(exitedElement2)).to.equal(false)
    expect(parent2.contains(exitedElement2)).to.equal(true)
  })

  it('should make sure the parent is relatively positioned only if it was formerly static', () => {
    testEl.innerHTML = ` <div id="container">
    <div data-flip-id="id-2"></div>
    <div data-flip-id="id-3"></div>
    </div>
  `
    const fakeOnExit = sinon.fake()

    const exitedElement = document.createElement('div')
    const parent = testEl.querySelector('#container')

    expect(getComputedStyle(parent).position).to.equal('static')

    animateUnflippedElements({
      unflippedIds: ['id-1'],
      flipCallbacks: {
        'id-1': { onExit: fakeOnExit }
      },
      getElement: getElement,
      flippedElementPositionsAfterUpdate: {},
      inProgressAnimations: {},
      flippedElementPositionsBeforeUpdate: {
        'id-1': {
          domDataForExitAnimations: {
            element: exitedElement,
            parent: parent,
            childPosition: { top: 100, left: 200, width: 50, height: 75 }
          }
        }
      }
    })
    expect(getComputedStyle(parent).position).to.equal('relative')

    parent.style.position = 'absolute'

    animateUnflippedElements({
      unflippedIds: ['id-1'],
      flipCallbacks: {
        'id-1': { onExit: fakeOnExit }
      },
      getElement: getElement,
      flippedElementPositionsAfterUpdate: {},
      inProgressAnimations: {},
      flippedElementPositionsBeforeUpdate: {
        'id-1': {
          domDataForExitAnimations: {
            element: exitedElement,
            parent: parent,
            childPosition: { top: 100, left: 200, width: 50, height: 75 }
          }
        }
      }
    })
    expect(getComputedStyle(parent).position).to.equal('absolute')
  })

  it('should style the newly-inserted exited elements with the correct top, left, height and width values', () => {
    testEl.innerHTML = ` <div id="container">
    <div data-flip-id="id-2"></div>
    <div data-flip-id="id-3"></div>
    </div>
  `
    const fakeOnExit = sinon.fake()

    const exitedElement = document.createElement('div')
    const parent = testEl.querySelector('#container')

    expect(getBoundingClientRect(exitedElement)).to.deep.equal({
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
      x: 0,
      y: 0
    })

    animateUnflippedElements({
      unflippedIds: ['id-1'],
      flipCallbacks: {
        'id-1': { onExit: fakeOnExit }
      },
      getElement: getElement,
      flippedElementPositionsAfterUpdate: {},
      inProgressAnimations: {},
      flippedElementPositionsBeforeUpdate: {
        'id-1': {
          domDataForExitAnimations: {
            element: exitedElement,
            parent: parent,
            childPosition: { top: 100, left: 200, width: 50, height: 75 }
          }
        }
      }
    })

    const newBounding = getBoundingClientRect(exitedElement)
    expect(newBounding.width).to.equal(50)
    expect(newBounding.height).to.equal(75)
    expect(newBounding.left).to.equal(200)
  })

  it('should return a function to call onExit with an element reference to the element that has been placed back in the DOM', () => {
    testEl.innerHTML = ` <div id="container">
    <div data-flip-id="id-2"></div>
    <div data-flip-id="id-3"></div>
    </div>
  `
    const fakeOnExit = sinon.fake()

    const exitedElement = document.createElement('div')
    const parent = testEl.querySelector('#container')

    const { animateExitingElements } = animateUnflippedElements({
      unflippedIds: ['id-0', 'id-1'],
      flipCallbacks: {
        'id-0': { onExit: () => {} },
        'id-1': { onExit: fakeOnExit }
      },
      getElement: getElement,
      flippedElementPositionsAfterUpdate: {},
      inProgressAnimations: {},
      flippedElementPositionsBeforeUpdate: {
        'id-0': {
          domDataForExitAnimations: {
            element: exitedElement,
            parent: parent,
            childPosition: { top: 100, left: 200, width: 50, height: 75 }
          }
        },
        'id-1': {
          domDataForExitAnimations: {
            element: exitedElement,
            parent: parent,
            childPosition: { top: 100, left: 200, width: 50, height: 75 }
          }
        }
      }
    })
    animateExitingElements()
    expect(fakeOnExit.callCount).to.equal(1)
    expect(fakeOnExit.args[0][0]).to.equal(exitedElement)
    // index of exiting element in terms of all exiting elements
    expect(fakeOnExit.args[0][1]).to.equal(1)
    expect(typeof fakeOnExit.args[0][2]).to.equal('function')
  })
})
