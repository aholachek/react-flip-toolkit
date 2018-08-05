import sinon from "sinon"
import * as Rematrix from "rematrix"
import animateFlippedElements from "../index"

const testEl = document.querySelector("#test")
const getElement = id => testEl.querySelector(`[data-flip-id=${id}]`)

describe("animateFlippedElements", () => {
  it("should preserve transforms in the final state of the element", done => {
    testEl.innerHTML = ` <div>
    <div data-flip-id="id-1" class="visible-block has-transform" data-flip-config='{"translate":true,"scale":true,"opacity":true}'></div>
    <div data-flip-id="id-2" class="visible-block" data-flip-config='{"translate":true,"scale":true,"opacity":true}'></div>
    </div>
  `
    const firstElementTransform = getComputedStyle(getElement("id-1")).transform

    animateFlippedElements({
      spring: { stiffness: 1000, damping: 1000 },
      flippedIds: ["id-1", "id-2"],
      flipCallbacks: {},
      inProgressAnimations: {},
      cachedFlipChildrenPositions: {
        "id-1": {
          rect: {
            top: 100,
            left: 100,
            width: 100,
            height: 100,
            bottom: 200,
            right: 200
          }
        },
        "id-2": {
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
      newFlipChildrenPositions: {
        "id-1": {
          rect: getElement("id-1").getBoundingClientRect(),
          transform: firstElementTransform
        },
        "id-2": { rect: getElement("id-2").getBoundingClientRect() }
      },
      getElement
    })

    setTimeout(() => {
      const newTransform = Rematrix.parse(
        getComputedStyle(getElement("id-1")).transform
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

  it("should apply a custom transform origin if one is provided in the flip config", () => {
    testEl.innerHTML = ` <div>
    <div data-flip-id="id-1" data-flip-config='{"transformOrigin": "75% 75%", "translate":true}'></div>
    </div>
  `

    animateFlippedElements({
      flippedIds: ["id-1"],
      flipCallbacks: {},
      inProgressAnimations: {},
      duration: 1,
      ease: "easeOutSine",
      cachedFlipChildrenPositions: {
        "id-1": {
          rect: {
            top: 10,
            left: 10,
            width: 100,
            height: 100
          }
        }
      },
      newFlipChildrenPositions: {
        "id-1": {
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
      getElement
    })

    expect(getElement("id-1").style.transformOrigin).to.equal("75% 75% 0px")
  })

  it("should otherwise apply a 0 0 transform origin", () => {
    testEl.innerHTML = ` <div>
    <div data-flip-id="id-1" data-flip-config='{}'></div>
    </div>
  `

    animateFlippedElements({
      applyTransformOrigin: true,
      flippedIds: ["id-1"],
      flipCallbacks: {},
      inProgressAnimations: {},
      duration: 1,
      ease: "easeOutSine",
      cachedFlipChildrenPositions: {
        "id-1": {
          rect: {
            top: 10,
            left: 10,
            width: 100,
            height: 100
          }
        }
      },
      newFlipChildrenPositions: {
        "id-1": {
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
      getElement
    })

    expect(getElement("id-1").style.transformOrigin).to.equal("0px 0px 0px")
  })

  it("should cache stop and onComplete functions for the element in inProgressAnimations ", () => {
    testEl.innerHTML = ` <div>
    <div data-flip-id="id-1" data-flip-config='{}'></div>
    </div>
  `

    const inProgressAnimations = {}

    animateFlippedElements({
      applyTransformOrigin: true,
      flippedIds: ["id-1"],
      flipCallbacks: {
        "id-1": {
          onComplete: () => {}
        }
      },
      inProgressAnimations,
      duration: 1000,
      ease: "easeOutSine",
      cachedFlipChildrenPositions: {
        "id-1": {
          rect: {
            top: 10,
            left: 10,
            width: 100,
            height: 100
          }
        }
      },
      newFlipChildrenPositions: {
        "id-1": {
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
      getElement
    })

    expect(typeof inProgressAnimations["id-1"].stop).to.equal("function")
    expect(typeof inProgressAnimations["id-1"].onComplete).to.equal("function")
  })

  it("should call onStart with reference to the element before the animation starts", () => {
    testEl.innerHTML = ` <div>
    <div data-flip-id="id-1" data-flip-config='{}'></div>
    </div>
  `

    const inProgressAnimations = {}

    const onStart = sinon.fake()

    animateFlippedElements({
      applyTransformOrigin: true,
      flippedIds: ["id-1"],
      flipCallbacks: {
        "id-1": {
          onStart
        }
      },
      inProgressAnimations,
      duration: 1000,
      ease: "easeOutSine",
      cachedFlipChildrenPositions: {
        "id-1": {
          rect: {
            top: 10,
            left: 10,
            width: 100,
            height: 100
          }
        }
      },
      newFlipChildrenPositions: {
        "id-1": {
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
      getElement
    })
    expect(onStart.callCount).to.equal(1)
    expect(onStart.args[0][0]).to.equal(getElement("id-1"))
  })
})
