import React, { PureComponent } from 'react'
import { Flipped, spring } from '../../src'

class Card extends PureComponent {
  hideElements = (el, { previous: prev, current: curr }) => {
    if (prev !== this.props.i) return
    const elements = [].slice.apply(el.querySelectorAll('*[data-fade-in]'))
    elements.forEach(el => (el.style.opacity = '0'))
    el.style.zIndex = 20
  }
  animateIn = (el, { previous: prev, current: curr }) => {
    if (prev !== this.props.i) return
    el.style.zIndex = ''
    const elements = [...el.querySelectorAll('*[data-fade-in]')]
    elements.forEach((el, i) => {
      spring({
        values: {
          translateY: [-30, 0],
          opacity: [0, 1]
        },
        onUpdate: ({ translateY, opacity }) => {
          el.style.opacity = opacity
          el.style.transform = `translateY(${translateY}px)`
        },
        delay: i * 75
      })
    })
  }

  shouldFlip = (prev, current) => {
    if (prev === this.props.i) return true
    return false
  }
  render() {
    const { parentFlipId, d, i, setFocusedIndex } = this.props
    return (
      <li key={parentFlipId}>
        <Flipped
          flipId={parentFlipId}
          onStart={this.hideElements}
          onComplete={this.animateIn}
          shouldInvert={this.shouldFlip}
        >
          <div
            className="gridItem"
            onClick={() => setFocusedIndex(i)}
            role="button"
          >
            <Flipped inverseFlipId={parentFlipId}>
              <div>
                <h2 className="gridItemTitle" data-fade-in>
                  {d.name}
                </h2>
                <Flipped
                  flipId={`${parentFlipId}-avatar`}
                  shouldFlip={this.shouldFlip}
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
                  shouldFlip={this.shouldFlip}
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
  }
}

export default Card
