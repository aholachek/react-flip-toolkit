import React, { PureComponent } from "react"
import { Flipped } from "../../../src"
import anime from "animejs"

const onElementAppear = (el, index) => {
  anime({
    targets: el,
    opacity: [0, 1],
    duration: 400,
    delay: index * 50,
    easing: "easeOutSine"
  })
}

const onExit = type => (el, index, removeElement) => {
  anime({
    targets: el,
    scaleY: type === "list" ? 0 : 1,
    scaleX: type === "grid" ? 0 : 1,
    duration: 200,
    complete: removeElement,
    easing: "easeOutSine"
  }).pause

  return () => {
    el.style.opacity = ""
    removeElement()
  }
}

const onGridExit = onExit("grid")
const onListExit = onExit("list")

class Card extends PureComponent {
  render() {
    const { id, title, type, stagger, addToFilteredIds } = this.props
    const flipId = `item-${id}`
    return (
      <Flipped
        flipId={flipId}
        onAppear={onElementAppear}
        onExit={type === "grid" ? onGridExit : onListExit}
        key={flipId}
        stagger={stagger}
      >
        <li className="fm-item">
          <Flipped inverseFlipId={flipId}>
            <div>
              <div>
                <Flipped
                  flipId={`${flipId}-h3`}
                  translate
                  stagger="card-internal"
                >
                  <h3>{title}</h3>
                </Flipped>
                <Flipped
                  flipId={`${flipId}-p`}
                  translate
                  stagger="card-internal"
                >
                  <p>{title}</p>
                </Flipped>
              </div>

              <Flipped flipId={`${flipId}-button`} stagger="card-internal">
                <button
                  className="fm-remove"
                  onClick={() => addToFilteredIds(id)}
                >
                  &times;
                </button>
              </Flipped>
            </div>
          </Flipped>
        </li>
      </Flipped>
    )
  }
}

export default Card
