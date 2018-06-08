import React, { Component } from "react"
import PropTypes from "prop-types"
import { Flipped } from "../../src/index"
import { tween, styler, easing, stagger } from "popmotion"

class FocusedUser extends Component {
  animateIn = () => {
    const elements = [].slice.apply(this.el.querySelectorAll("*[data-fade-in]"))

    const animations = elements.map((el) => {
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
  }

  render() {
    const { data, index, close } = this.props
    const parentFlipId = `card-${index}`

    if (typeof index !== "number") return null

    return (
      <div className="focusedItemBackground">
        <Flipped
          flipId={parentFlipId}
          all
          transformOriginTopLeft
          onComplete={this.animateIn}
        >
          <div
            className="gridItemFocused"
            role="button"
            ref={el => (this.el = el)}
          >
            <Flipped inverseFlipId={parentFlipId} all transformOriginTopLeft>
              <div>
                <button
                  className="gridItemFocusedClose"
                  onClick={close}
                  data-fade-in
                >
                  ✖
                </button>
                <h2 className="gridItemTitle" data-fade-in>
                  {data.name}
                </h2>
                <Flipped
                  flipId={`${parentFlipId}-avatar`}
                  all
                  transformOriginTopLeft
                >
                  <img
                    src={data.avatar}
                    alt={`user profile for ${data.name}`}
                    className="gridItemAvatar"
                  />
                </Flipped>

                <h2 data-fade-in>{data.job}</h2>
                <p data-fade-in className="gridItemDescription">
                  {data.text}
                </p>
              </div>
            </Flipped>
          </div>
        </Flipped>
      </div>
    )
  }
}

export default FocusedUser
