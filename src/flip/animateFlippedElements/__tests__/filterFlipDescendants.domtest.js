import filterFlipDescendants from "../filterFlipDescendants"

const testEl = document.querySelector("#test")

describe("filterFlipDescendants", () => {
  it("should augment each entry in flipDict with a childIds array with direct children", () => {
    testEl.innerHTML = ` <div>

    <div data-flip-id="id-1" class="visible-block">
      <div data-flip-id="id-2" class="visible-block">
        <div data-flip-id="id-3" class="visible-block">
          <div data-flip-id="id-4" class="visible-block"></div>
        </div>
      </div>
    </div>

    <div data-flip-id="id-1--2" class="visible-block"></div>

    <div data-flip-id="id-1--3" class="visible-block">
      <div data-flip-id="id-2--2" class="visible-block"></div>
    </div>

  </div>
`

    const flipData = [...testEl.querySelectorAll("[data-flip-id]")].reduce(
      (acc, curr) => {
        acc[curr.dataset.flipId] = {
          element: curr
        }
        return acc
      },
      {}
    )

    const { topLevelChildren } = filterFlipDescendants(flipData)

    Object.keys(flipData).forEach(flipId => {
      delete flipData[flipId].element
    })

    expect(flipData).to.deep.equal({
      "id-1": {
        level: 0,
        childIds: ["id-2"]
      },
      "id-2": {
        level: 1,
        childIds: ["id-3"]
      },
      "id-3": {
        level: 2,
        childIds: ["id-4"]
      },
      "id-4": {
        level: 3,
        childIds: []
      },
      "id-1--2": {
        level: 0,
        childIds: []
      },
      "id-1--3": {
        level: 0,
        childIds: ["id-2--2"]
      },
      "id-2--2": {
        level: 1,
        childIds: []
      }
    })

    expect(topLevelChildren).to.deep.equal(["id-1", "id-1--2", "id-1--3"])
  })
})
