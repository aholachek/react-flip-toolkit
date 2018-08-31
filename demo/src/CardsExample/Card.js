import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Flipped } from "../../../src"
import anime from "animejs"

class Card extends PureComponent {
  static propTypes = {}

  hideElements = (el, startId) => {
    if (startId !== "focusedUser") return
    const elements = [].slice.apply(el.querySelectorAll("*[data-fade-in]"))
    elements.forEach(el => (el.style.opacity = "0"))
    el.style.zIndex = 2
  }
  animateIn = (el, startId) => {
    if (startId !== "focusedUser") return
    anime({
      targets: el.querySelectorAll("*[data-fade-in]"),
      translateY: [-30, 0],
      opacity: [0, 1],
      duration: 250,
      easing: "easeOutSine",
      delay: (d, i) => i * 75
    })
    el.style.zIndex = 1
  }

  state = {}

  render() {
    const { parentFlipId, setFocusedIndex, i, d } = this.props
    return (
      <li key={parentFlipId}>
        <Flipped
          flipId={parentFlipId}
          onStart={this.hideElements}
          onComplete={this.animateIn}
          componentId="gridItem"
        >
          <div
            className="gridItem"
            onClick={() => setFocusedIndex(i)}
            role="button"
          >
            <div>
              <h2 className="gridItemTitle" data-fade-in>
                {d.name}
              </h2>
              <Flipped
                flipId={`${parentFlipId}-avatar`}
                componentIdFilter="focusedUserAvatar"
                freeAgent={4}
              >
                <img
                  src={d.avatar}
                  alt={`user profile for ${d.name}`}
                  className="gridItemAvatar"
                />
              </Flipped>
              <h2 className="gridItemJob" data-fade-in>
                {d.job}
              </h2>

              <Flipped
                flipId={`${parentFlipId}-background`}
                componentIdFilter="focusedUserBackground"
                freeAgent={3}
              >
                <div
                  className="gridItemBackground"
                  style={{ backgroundColor: d.color }}
                />
              </Flipped>
            </div>
          </div>
        </Flipped>
      </li>
    )
  }
}

export default Card
