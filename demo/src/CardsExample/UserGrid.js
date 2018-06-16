import React, { Component } from "react"
import PropTypes from "prop-types"
import { Flipped } from "../../../src/index"
import { tween, styler, easing, stagger } from "popmotion"

class UserGrid extends Component {
  hideElements = (el, startId) => {
    if (startId !== "focusedUser") return
    const elements = [].slice.apply(el.querySelectorAll("*[data-fade-in]"))
    elements.forEach(el => (el.style.opacity = "0"))
    el.style.zIndex = 2
  }
  animateIn = (el, startId) => {
    if (startId !== "focusedUser") return
    const elements = [].slice.apply(el.querySelectorAll("*[data-fade-in]"))

    const animations = elements.map(el => {
      return tween({
        from: {
          opacity: 0,
          translateY: -30
        },
        to: {
          opacity: 1,
          translateY: 0
        },
        duration: 250
      })
    })

    stagger(animations, 150).start(values => {
      elements.forEach((el, i) => styler(el).set(values[i]))
    })
    el.style.zIndex = 1
  }
  render() {
    return (
      <ul className="grid">
        {this.props.data.map((d, i) => {
          const parentFlipId = `card-${i}`
          if (i === this.props.focusedIndex) return null
          return (
            <li>
              <Flipped
                flipId={parentFlipId}
                onStart={this.hideElements}
                onComplete={this.animateIn}
                componentId="gridItem"
                transformOrigin="0 0"
                ease="backOut"
              >
                <div
                  className="gridItem"
                  onClick={() => this.props.setFocusedIndex(i)}
                  role="button"
                >
                  <Flipped
                    inverseFlipId={parentFlipId}
                    transformOrigin="0 0"
                    componentIdFilter="focusedUser"
                  >
                    <div>
                      <h2 className="gridItemTitle" data-fade-in>
                        {d.name}
                      </h2>
                      <Flipped
                        flipId={`${parentFlipId}-avatar`}
                        transformOrigin="0 0"
                        componentIdFilter="focusedUserAvatar"
                        ease="backOut"
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
                        transformOrigin="0 0"
                      >
                        <div
                          className="gridItemBackground"
                          style={{ backgroundColor: d.color }}
                        />
                      </Flipped>
                    </div>
                  </Flipped>
                </div>
              </Flipped>
            </li>
          )
        })}
      </ul>
    )
  }
}

export default UserGrid
