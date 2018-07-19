import sinon from "sinon"
import animateUnflippedElements from "../index"
const testEl = document.querySelector("#test")

describe("animateUnflippedElements", () => {
  it("should call onAppear callbacks and pass in the correct element reference", () => {
    testEl.innerHTML = ` <div>
    <div data-flip-id="id-1"></div>
    <div data-flip-id="id-2"></div>
    <div data-flip-id="id-3"></div>
    <div data-flip-id="id-4"></div>

    </div>
  `
    const fakeOnAppear1 = sinon.fake()
    const fakeOnAppear2 = sinon.fake()
    const fakeOnAppear4 = sinon.fake()

    animateUnflippedElements({
      unflippedIds: ["id-1", "id-3", "id-4"],
      flipCallbacks: {
        "id-1": { onAppear: fakeOnAppear1 },
        "id-2": { onAppear: fakeOnAppear2 },
        "id-4": { onAppear: fakeOnAppear4 }
      },
      getElement: () => {},
      newFlipChildrenPositions: { "id-1": {}, "id-3": {} },
      cachedFlipChildrenPositions: {}
    })
    expect(fakeOnAppear1.callCount).to.equal(1)
    expect(fakeOnAppear2.callCount).to.equal(0)
    expect(fakeOnAppear4.callCount).to.equal(1)
  })

  it("should immediately apply an opacity of 0 to elements with a delayedOnAppear callback", () => {})

  it("should reinsert exited elements with onExit callbacks back into the DOM", () => {})

  it("should make sure to reinsert the exited elements inside the correct parent (there could be multiple parents for exited elements)", () => {})

  it("should style the newly-inserted exited elements with the correct top, left, height and width values", () => {})

  it("should call onExit with an element reference to the element that has been placed back in the DOM", () => {})

  it("should wait until all exit callbacks have called the provided stop function ", () => {})

  it("should call the onDelayedAppearCallbacks immediately if there are no exiting ", () => {})

  it("should correctly sequence onAppear, onExit, and onDelayedAppear callbacks (in that order)", () => {})
})
