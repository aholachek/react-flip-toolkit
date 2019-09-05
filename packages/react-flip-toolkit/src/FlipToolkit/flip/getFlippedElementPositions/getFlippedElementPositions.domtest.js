import sinon from 'sinon'
import getFlippedElementPositionsBeforeUpdate from './getFlippedElementPositionsBeforeUpdate'
import getFlippedElementPositionsAfterUpdate from './getFlippedElementPositionsAfterUpdate'
import { getAllElements } from './utilities'

const testEl = document.querySelector('#test')

describe('getAllElements', () => {
  it('should return a func that selects all elements in the entire document with a specific data portal key if a portal key is provided', () => {
    const otherEl = document.createElement('div')
    document.querySelector('body').appendChild(otherEl)
    otherEl.innerHTML = `
    <div>
    <div data-flip-id="id-1" data-portal-key='some-portal-key'></div>
    <div data-flip-id="id-2" data-portal-key='some-portal-key'></div>
    </div>
    `
    testEl.innerHTML = `
    <div data-flip-id="id-3" data-portal-key='some-portal-key'></div>
    <div data-flip-id="id-4" data-portal-key='some-portal-key'></div>
      </div>
    `
    const elements = getAllElements(testEl, 'some-portal-key')
    expect(elements.length).to.equal(4)
  })

  it('should otherwise get all children elements with a data-flip-id attribute  ', () => {
    const otherEl = document.createElement('div')
    document.querySelector('body').appendChild(otherEl)
    otherEl.innerHTML = `
    <div>
    <div data-flip-id="id-1" data-portal-key='some-portal-key'></div>
    <div data-flip-id="id-2" data-portal-key='some-portal-key'></div>
    </div>
    `
    testEl.innerHTML = `
    <div data-flip-id="id-3" data-portal-key='some-portal-key'></div>
    <div data-flip-id="id-4" data-portal-key='some-portal-key'></div>
      </div>
    `
    const elements = getAllElements(testEl, undefined)
    expect(elements.length).to.equal(2)
  })
})

describe('getFlippedElementPositionsBeforeUpdate', () => {
  it('returns position data for elements with flip-ids', () => {
    testEl.innerHTML = `
      <div>
      <div data-flip-id="id-1" style="height:100px; width: 100px; opacity: .5"></div>
      <div data-flip-id="id-2" style="height:200px; width: 100px; transform: rotate(30deg)"></div>
      <div data-flip-id="id-3" style="height:300px; width: 300px; transform: translate(30px)"></div>
      </div>
    `
    const { flippedElementPositions } = getFlippedElementPositionsBeforeUpdate({
      element: testEl
    })
    expect(flippedElementPositions['id-1'].opacity).to.equal(0.5)
    expect(flippedElementPositions['id-1'].rect.width).to.equal(100)
    expect(flippedElementPositions['id-1'].rect.height).to.equal(100)
    expect(
      flippedElementPositions['id-1'].domDataForExitAnimations
    ).to.deep.equal({})

    expect(
      flippedElementPositions['id-2'].domDataForExitAnimations
    ).to.deep.equal({})
    expect(flippedElementPositions['id-2'].opacity).to.equal(1)
    expect(flippedElementPositions['id-2'].rect.width).to.equal(186.6025390625)
    expect(flippedElementPositions['id-2'].rect.height).to.equal(223.205078125)
  })

  it('for elements with onExit callbacks (and only for them), caches the DOM node and information about the parent', () => {
    testEl.innerHTML = `
    <div id="parent-node-1">
    <div data-flip-id="id-2" style="height:200px; width: 100px; transform: rotate(30deg)"></div>
    </div>
    <div id="parent-node-2">
    <div data-flip-id="id-1" style="height:100px; width: 100px; opacity: .5"></div>
    <div data-flip-id="id-3" style="height:300px; width: 300px; transform: translate(30px)"></div>
    </div>
  `

    const { flippedElementPositions } = getFlippedElementPositionsBeforeUpdate({
      element: testEl,
      flipCallbacks: {
        'id-2': {
          onExit: () => {
            console.log('yo, i am exiting')
          }
        },
        'id-3': {
          onExit: () => {
            console.log('yo, i am exiting')
          }
        }
      },
      inProgressAnimations: {}
    })

    expect(
      flippedElementPositions['id-1'].domDataForExitAnimations
    ).to.deep.equal({})

    expect(
      flippedElementPositions['id-2'].domDataForExitAnimations.childPosition
    ).to.deep.equal({
      top: -11.6025390625,
      left: -43.30126953125,
      width: 186.6025390625,
      height: 223.205078125
    })

    expect(
      flippedElementPositions['id-2'].domDataForExitAnimations.element
    ).to.equal(testEl.querySelector("div[data-flip-id='id-2']"))

    expect(
      flippedElementPositions['id-2'].domDataForExitAnimations.parent
    ).to.equal(testEl.querySelector('#parent-node-1'))

    expect(
      flippedElementPositions['id-3'].domDataForExitAnimations.parent
    ).to.deep.equal(testEl.querySelector('#parent-node-2'))
  })

  it('cancels in-progress animations and removes transforms only after recording position data, for interruptible animations', () => {
    testEl.innerHTML = `
    <div>
    <div data-flip-id="id-1" style="height:100px; width: 100px; opacity: .5"></div>
    <div data-flip-id="id-2" style="height:200px; width: 100px; transform: rotate(30deg)"></div>
    <div data-flip-id="id-3" style="height:300px; width: 300px; transform: translate(30px)"></div>
    </div>
  `
    const fakeStop = sinon.fake()
    const inProgressAnimations = {
      'id-1': {},
      'id-2': {
        destroy: fakeStop
      }
    }

    expect(
      testEl.querySelector("div[data-flip-id='id-2']").style.transform
    ).to.equal('rotate(30deg)')

    const { flippedElementPositions } = getFlippedElementPositionsBeforeUpdate({
      element: testEl,
      flipCallbacks: {},
      inProgressAnimations
    })

    expect(flippedElementPositions['id-2'].rect.width).to.equal(186.6025390625)
    expect(flippedElementPositions['id-2'].rect.height).to.equal(223.205078125)

    expect(
      testEl.querySelector("div[data-flip-id='id-2']").style.transform
    ).to.equal('')

    expect(fakeStop.callCount).to.equal(1)

    expect(Object.keys(inProgressAnimations).length).to.equal(0)
  })

  it('returns an ordered array of ids so that stagger effects can happen later', () => {
    testEl.innerHTML = `
    <div>
    <div data-flip-id="id-1" style="height:100px; width: 100px; opacity: .5"></div>
    <div data-flip-id="id-2" style="height:200px; width: 100px; transform: rotate(30deg)"></div>
    <div data-flip-id="id-3" style="height:300px; width: 300px; transform: translate(30px)"></div>
    </div>
  `
    const { cachedOrderedFlipIds } = getFlippedElementPositionsBeforeUpdate({
      element: testEl
    })

    expect(cachedOrderedFlipIds).to.deep.eql(['id-1', 'id-2', 'id-3'])
  })
})

describe('getFlippedElementPositionsAfterUpdate', () => {
  it('returns position data for elements with flip-ids', () => {
    testEl.innerHTML = `
    <div>
    <div data-flip-id="id-1" style="height:100px; width: 100px; opacity: .5"></div>
    <div data-flip-id="id-2" style="height:200px; width: 100px; transform: rotate(30deg)"></div>
    <div data-flip-id="id-3" style="height:300px; width: 300px; transform: translate(30px)"></div>
    </div>
  `
    const flippedElementPositions = getFlippedElementPositionsAfterUpdate({
      element: testEl
    })

    expect(flippedElementPositions['id-1'].opacity).to.equal(0.5)
    expect(flippedElementPositions['id-1'].rect.width).to.equal(100)
    expect(flippedElementPositions['id-1'].rect.height).to.equal(100)
    expect(flippedElementPositions['id-1'].transform).to.equal('none')

    expect(flippedElementPositions['id-2'].opacity).to.equal(1)
    expect(flippedElementPositions['id-2'].rect.width).to.equal(186.6025390625)
    expect(flippedElementPositions['id-2'].rect.height).to.equal(223.205078125)
    expect(flippedElementPositions['id-2'].transform).to.equal(
      'matrix(0.866025, 0.5, -0.5, 0.866025, 0, 0)'
    )

    expect(flippedElementPositions['id-3'].opacity).to.equal(1)
    expect(flippedElementPositions['id-3'].rect.width).to.equal(300)
    expect(flippedElementPositions['id-3'].rect.height).to.equal(300)
    expect(flippedElementPositions['id-3'].transform).to.equal(
      'matrix(1, 0, 0, 1, 30, 0)'
    )
  })
})
