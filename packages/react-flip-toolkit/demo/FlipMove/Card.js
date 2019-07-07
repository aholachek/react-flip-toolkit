
import React, { PureComponent } from 'react'
import { Flipped } from '..'
import anime from 'animejs'

const onElementAppear = (el, index) => {
  anime({
    targets: el,
    opacity: [0, 1],
    duration: 400,
    delay: index * 50,
    easing: 'easeOutSine'
  })
}

const onExit = type => (el, index, removeElement) => {
  anime({
    targets: el,
    scaleY: type === 'list' ? 0 : 1,
    scaleX: type === 'grid' ? 0 : 1,
    duration: 200,
    complete: removeElement,
    easing: 'easeOutSine'
  }).pause

  return () => {
    el.style.opacity = ''
    removeElement()
  }
}

const onGridExit = onExit('grid')
const onListExit = onExit('list')

class Card extends PureComponent {
  shouldFlip = (prev, current) => {
    if (prev.type !== current.type) {
      return true
    }
    return false
  }
  render() {
    const { id, title, type, stagger, addToFilteredIds } = this.props
    const flipId = `item-${id}`
    return (
      <Flipped
        flipId={flipId}
        onAppear={onElementAppear}
        onExit={type === 'grid' ? onGridExit : onListExit}
        key={flipId}
        stagger={stagger}
        shouldInvert={this.shouldFlip}
      >
        <li className="fm-item">
          <Flipped inverseFlipId={flipId}>
            <div>
              <Flipped
                flipId={`${flipId}-content`}
                translate
                shouldFlip={this.shouldFlip}
              >
                <div>
                  <h3>{title}</h3>
                  <p>{title}</p>
                </div>
              </Flipped>

              <Flipped flipId={`${flipId}-button`} shouldFlip={this.shouldFlip}>
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
