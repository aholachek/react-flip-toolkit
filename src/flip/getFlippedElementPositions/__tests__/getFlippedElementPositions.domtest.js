import {
  getFlippedElementPositionsBeforeUpdate,
  getFlippedElementPositionsAfterUpdate
} from "../index"

const testEl = document.querySelector("#test")

describe("getFlippedElementPositionsBeforeUpdate", () => {
  it("returns position data for elements with flip-ids", () => {
    testEl.innerHTML = `
      <div>
      <div data-flip-id="id-1" style="height:100px; width: 100px; opacity: .5"></div>
      <div data-flip-id="id-2" style="height:200px; width: 100px; transform: rotate(30deg)"></div>
      <div data-flip-id="id-3" style="height:300px; width: 300px; transform: translate(30px)"></div>
      </div>
    `
    const positionDict = getFlippedElementPositionsBeforeUpdate({
      element: testEl,
      flipCallbacks: {},
      inProgressAnimations: {}
    })
    expect(positionDict["id-1"].opacity).to.equal(0.5)
    expect(positionDict["id-1"].rect.width).to.equal(100)
    expect(positionDict["id-1"].rect.height).to.equal(100)
    expect(positionDict["id-1"].domData).to.deep.equal({})

    expect(positionDict["id-2"].domData).to.deep.equal({})
    expect(positionDict["id-2"].opacity).to.equal(1)
    expect(positionDict["id-2"].rect.width).to.equal(186.6025390625)
    expect(positionDict["id-2"].rect.height).to.equal(223.205078125)
  })

  it("for elements with onExit callbacks (and only for them), caches the DOM node and information about the parent", () => {
    testEl.innerHTML = `
    <div id="parent-node-1">
    <div data-flip-id="id-2" style="height:200px; width: 100px; transform: rotate(30deg)"></div>
    </div>
    <div id="parent-node-2">
    <div data-flip-id="id-1" style="height:100px; width: 100px; opacity: .5"></div>
    <div data-flip-id="id-3" style="height:300px; width: 300px; transform: translate(30px)"></div>
    </div>
  `

    const positionDict = getFlippedElementPositionsBeforeUpdate({
      element: testEl,
      flipCallbacks: {
        "id-2": {
          onExit: () => {
            console.log("yo, i am exiting")
          }
        },
        "id-3": {
          onExit: () => {
            console.log("yo, i am exiting")
          }
        }
      },
      inProgressAnimations: {}
    })

    expect(positionDict["id-1"].domData).to.deep.equal({})

    expect(positionDict["id-2"].domData.childPosition).to.deep.equal({
      top: -11.6025390625,
      left: -43.30126953125,
      width: 186.6025390625,
      height: 223.205078125
    })

    expect(positionDict["id-2"].domData.element).to.equal(
      testEl.querySelector("div[data-flip-id='id-2']")
    )

    expect(positionDict["id-2"].domData.parent).to.equal(
      testEl.querySelector("#parent-node-1")
    )

    expect(positionDict["id-3"].domData.parent).to.deep.equal(
      testEl.querySelector("#parent-node-2")
    )
  })

  it("cancels in-progress animations and removes transforms only after recording position data, for interruptible animations", () => {
    testEl.innerHTML = `
    <div>
    <div data-flip-id="id-1" style="height:100px; width: 100px; opacity: .5"></div>
    <div data-flip-id="id-2" style="height:200px; width: 100px; transform: rotate(30deg)"></div>
    <div data-flip-id="id-3" style="height:300px; width: 300px; transform: translate(30px)"></div>
    </div>
  `
    const fakeStop = sinon.fake()
    const inProgressAnimations = {
      "id-1": {},
      "id-2": { stop: fakeStop }
    }

    expect(
      testEl.querySelector("div[data-flip-id='id-2']").style.transform
    ).to.equal("rotate(30deg)")

    const positionDict = getFlippedElementPositionsBeforeUpdate({
      element: testEl,
      flipCallbacks: {},
      inProgressAnimations
    })

    expect(positionDict["id-2"].rect.width).to.equal(186.6025390625)
    expect(positionDict["id-2"].rect.height).to.equal(223.205078125)

    expect(
      testEl.querySelector("div[data-flip-id='id-2']").style.transform
    ).to.equal("")

    expect(fakeStop.callCount).to.equal(1)

    expect(Object.keys(inProgressAnimations).length).to.equal(0)
  })
})

describe("getFlippedElementPositionsAfterUpdate", () => {
  it("returns position data for elements with flip-ids", () => {
    testEl.innerHTML = `
    <div>
    <div data-flip-id="id-1" style="height:100px; width: 100px; opacity: .5"></div>
    <div data-flip-id="id-2" style="height:200px; width: 100px; transform: rotate(30deg)"></div>
    <div data-flip-id="id-3" style="height:300px; width: 300px; transform: translate(30px)"></div>
    </div>
  `
    const positionDict = getFlippedElementPositionsAfterUpdate({
      element: testEl
    })

    expect(positionDict["id-1"].opacity).to.equal(0.5)
    expect(positionDict["id-1"].rect.width).to.equal(100)
    expect(positionDict["id-1"].rect.height).to.equal(100)
    expect(positionDict["id-1"].domData).to.deep.equal({})
    expect(positionDict["id-1"].transform).to.equal("none")

    expect(positionDict["id-2"].domData).to.deep.equal({})
    expect(positionDict["id-2"].opacity).to.equal(1)
    expect(positionDict["id-2"].rect.width).to.equal(186.6025390625)
    expect(positionDict["id-2"].rect.height).to.equal(223.205078125)
    expect(positionDict["id-2"].transform).to.equal(
      "matrix(0.866025, 0.5, -0.5, 0.866025, 0, 0)"
    )

    expect(positionDict["id-3"].domData).to.deep.equal({})
    expect(positionDict["id-3"].opacity).to.equal(1)
    expect(positionDict["id-3"].rect.width).to.equal(300)
    expect(positionDict["id-3"].rect.height).to.equal(300)
    expect(positionDict["id-3"].transform).to.equal("matrix(1, 0, 0, 1, 30, 0)")
  })
})
