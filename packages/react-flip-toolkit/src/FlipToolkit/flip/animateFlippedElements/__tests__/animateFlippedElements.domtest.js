import sinon from 'sinon'
import * as Rematrix from 'rematrix'
import animateFlippedElements from '../index'

const testEl = document.querySelector('#test')
const getElement = id => testEl.querySelector(`[data-flip-id=${id}]`)
const scopedSelector = selector => [...testEl.querySelectorAll(selector)]

describe('animateFlippedElements', () => {
  it('should return a function that calls onStart with reference to the element on the first tick of the animation', done => {
    testEl.innerHTML = ` <div>
    <div data-flip-id="id-1" data-flip-config='{}'></div>
    </div>
  `

    const inProgressAnimations = {}

    const onStart = sinon.fake()

    const flip = animateFlippedElements({
      applyTransformOrigin: true,
      flippedIds: ['id-1'],
      flipCallbacks: {
        'id-1': {
          onStart
        }
      },
      inProgressAnimations,
      flippedElementPositionsBeforeUpdate: {
        'id-1': {
          rect: {
            top: 10,
            left: 10,
            width: 100,
            height: 100
          }
        }
      },
      flippedElementPositionsAfterUpdate: {
        'id-1': {
          element: getElement('id-1'),
          rect: {
            top: 100,
            left: 100,
            width: 100,
            height: 100,
            bottom: 200,
            right: 200
          }
        }
      },

      decisionData: {},
      getElement,
      scopedSelector
    })

    flip()

    setTimeout(() => {
      expect(onStart.callCount).to.equal(1)
      expect(onStart.args[0][0]).to.equal(getElement('id-1'))
      done()
    }, 10)
  })
  it('should preserve transforms in the final state of the element', done => {
    testEl.innerHTML = ` <div>
    <div data-flip-id="id-1" class="visible-block has-transform" data-flip-config='{"translate":true,"scale":true,"opacity":true}'></div>
    <div data-flip-id="id-2" class="visible-block" data-flip-config='{"translate":true,"scale":true,"opacity":true}'></div>
    </div>
  `
    const firstElementTransform = getComputedStyle(getElement('id-1')).transform

    const flip = animateFlippedElements({
      flippedIds: ['id-1', 'id-2'],
      flipCallbacks: {},
      inProgressAnimations: {},
      flippedElementPositionsBeforeUpdate: {
        'id-1': {
          rect: {
            top: 100,
            left: 100,
            width: 100,
            height: 100,
            bottom: 200,
            right: 200
          }
        },
        'id-2': {
          rect: {
            top: 100,
            left: 100,
            width: 100,
            height: 100,
            bottom: 200,
            right: 200
          }
        }
      },
      flippedElementPositionsAfterUpdate: {
        'id-1': {
          element: getElement('id-1'),

          rect: getElement('id-1').getBoundingClientRect(),
          transform: firstElementTransform
        },
        'id-2': {
          element: getElement('id-2'),
          rect: getElement('id-2').getBoundingClientRect()
        }
      },
      getElement,
      scopedSelector
    })

    flip()

    setTimeout(() => {
      const newTransform = Rematrix.parse(
        getComputedStyle(getElement('id-1')).transform
      ).map(n => Math.floor(n))

      expect(newTransform).to.deep.equal([
        2,
        0,
        0,
        0,
        0,
        2,
        0,
        0,
        0,
        0,
        1,
        0,
        50,
        25,
        0,
        1
      ])
      done()
    }, 1000)
  })

  it('should apply a custom transform origin if one is provided in the flip config', () => {
    testEl.innerHTML = ` <div>
    <div data-flip-id="id-1" data-flip-config='{"transformOrigin": "75% 75%", "translate":true}'></div>
    </div>
  `

    animateFlippedElements({
      flippedIds: ['id-1'],
      flipCallbacks: {},
      inProgressAnimations: {},
      duration: 1,
      flippedElementPositionsBeforeUpdate: {
        'id-1': {
          rect: {
            top: 10,
            left: 10,
            width: 100,
            height: 100
          }
        }
      },
      flippedElementPositionsAfterUpdate: {
        'id-1': {
          element: getElement('id-1'),
          rect: {
            top: 100,
            left: 100,
            width: 100,
            height: 100,
            bottom: 200,
            right: 200
          }
        }
      },
      getElement,
      scopedSelector
    })

    expect(getElement('id-1').style.transformOrigin).to.equal('75% 75%')
  })

  it('should otherwise apply a 0 0 transform origin', () => {
    testEl.innerHTML = ` <div>
    <div data-flip-id="id-1" data-flip-config='{}'></div>
    </div>
  `

    animateFlippedElements({
      applyTransformOrigin: true,
      flippedIds: ['id-1'],
      flipCallbacks: {},
      inProgressAnimations: {},
      duration: 1,
      flippedElementPositionsBeforeUpdate: {
        'id-1': {
          rect: {
            top: 10,
            left: 10,
            width: 100,
            height: 100
          }
        }
      },
      flippedElementPositionsAfterUpdate: {
        element: getElement('id-1'),

        'id-1': {
          element: getElement('id-1'),
          rect: {
            top: 100,
            left: 100,
            width: 100,
            height: 100,
            bottom: 200,
            right: 200
          }
        }
      },
      getElement,
      scopedSelector
    })

    expect(getElement('id-1').style.transformOrigin).to.equal('0px 0px')
  })

  it('should cache stop and onComplete functions for the element in inProgressAnimations ', () => {
    testEl.innerHTML = ` <div>
    <div data-flip-id="id-1" data-flip-config='{}'></div>
    </div>
  `

    const inProgressAnimations = {}

    const flip = animateFlippedElements({
      applyTransformOrigin: true,
      flippedIds: ['id-1'],
      flipCallbacks: {
        'id-1': {
          onComplete: () => {}
        }
      },
      inProgressAnimations,
      flippedElementPositionsBeforeUpdate: {
        'id-1': {
          rect: {
            top: 10,
            left: 10,
            width: 100,
            height: 100
          }
        }
      },
      flippedElementPositionsAfterUpdate: {
        'id-1': {
          element: getElement('id-1'),
          rect: {
            top: 100,
            left: 100,
            width: 100,
            height: 100,
            bottom: 200,
            right: 200
          }
        }
      },
      getElement,
      scopedSelector
    })

    flip()

    expect(typeof inProgressAnimations['id-1'].destroy).to.equal(
      'function'
    )
    expect(typeof inProgressAnimations['id-1'].onAnimationEnd).to.equal(
      'function'
    )
  })

  it('should return a function that, when called, returns a promise resolved with all flip ids', done => {
    testEl.innerHTML = ` <div>
    <div data-flip-id="id-1" data-flip-config='{}'></div>
    </div>
  `
    const inProgressAnimations = {}

    const flip = animateFlippedElements({
      applyTransformOrigin: true,
      flippedIds: ['id-1'],
      flipCallbacks: {
        'id-1': {
          onComplete: () => {}
        }
      },
      inProgressAnimations,
      flippedElementPositionsBeforeUpdate: {
        'id-1': {
          rect: {
            top: 10,
            left: 10,
            width: 100,
            height: 100
          }
        }
      },
      flippedElementPositionsAfterUpdate: {
        'id-1': {
          element: getElement('id-1'),
          rect: {
            top: 100,
            left: 100,
            width: 100,
            height: 100,
            bottom: 200,
            right: 200
          }
        }
      },
      getElement,
      scopedSelector
    })

    flip().then(flipIds => {
      expect(flipIds).to.deep.equal(['id-1'])
      done()
    })
  })

  it('should handle the case when there are no flipIds ', done => {
    testEl.innerHTML = ` <div>
    </div>
  `

    const flip = animateFlippedElements({
      applyTransformOrigin: true,
      flippedIds: [],
      flipCallbacks: {},
      inProgressAnimations: {},
      duration: 1,
      flippedElementPositionsBeforeUpdate: {
        'id-1': {
          rect: {
            top: 10,
            left: 10,
            width: 100,
            height: 100
          }
        }
      },
      flippedElementPositionsAfterUpdate: {},
      getElement,
      scopedSelector
    })

    flip().then(flipIds => {
      expect(flipIds).to.deep.equal([])
      done()
    })
  })
})
