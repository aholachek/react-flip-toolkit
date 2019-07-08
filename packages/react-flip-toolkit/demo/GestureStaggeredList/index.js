// inspired by this animated demo:
// https://uxplanet.org/animation-in-ui-design-from-concept-to-reality-85c49907b19d
import React, { Component } from 'react'
import { Flipper, Flipped, Swipe } from '../../src'
import './styles.css'
const listData = [0, 1, 2, 3, 4, 5, 6, 7]
const colors = ['#ff4f66', '#7971ea', '#5900d8']

const shouldFlip = index => (prev, current) => {
  if (prev.includes(index) || current.includes(index)) return true
  return false
}

const ListItem = ({ index, color, onClick }) => {
  return (
    <Swipe
      down={{
        initFlip: () => {
          onClick(index)
        },
        cancelFlip: () => {
          onClick(index)
        }
      }}
    >
      <Flipped
        flipId={`listItem-${index}`}
        onStartImmediate={el => {
          setTimeout(() => {
            el.classList.add('animated-in')
          })
        }}
        shouldInvert={shouldFlip(index)}
      >
        <div className="listItem" style={{ backgroundColor: color }}>
          <Flipped inverseFlipId={`listItem-${index}`}>
            <div className="listItemContent">
              <Flipped
                flipId={`avatar-${index}`}
                stagger="card-content"
                shouldFlip={shouldFlip(index)}
              >
                <div className="avatar" />
              </Flipped>
              <div className="description">
                <Flipped
                  flipId={`description-${index}-1`}
                  stagger="card-content"
                  shouldFlip={shouldFlip(index)}
                >
                  <div />
                </Flipped>
                <Flipped
                  flipId={`description-${index}-2`}
                  stagger="card-content"
                  shouldFlip={shouldFlip(index)}
                >
                  <div />
                </Flipped>
                <Flipped
                  flipId={`description-${index}-3`}
                  shouldFlip={shouldFlip(index)}
                >
                  <div />
                </Flipped>
              </div>
            </div>
          </Flipped>
        </div>
      </Flipped>
    </Swipe>
  )
}

const ExpandedListItem = ({ index, color, onClick }) => {
  return (
    <Swipe
      up={{
        initFlip: () => {
          onClick(index)
        },
        cancelFlip: () => {
          onClick(index)
        },
        threshold: 0.8
      }}
    >
      <Flipped
        flipId={`listItem-${index}`}
        onComplete={el => {
          el.classList.add('animated-in')
        }}
      >
        <div className="expandedListItem" style={{ backgroundColor: color }}>
          <Flipped inverseFlipId={`listItem-${index}`}>
            <div className="expandedListItemContent">
              <Flipped flipId={`avatar-${index}`}>
                <div className="avatar avatarExpanded" stagger="card-content" />
              </Flipped>
              <div className="description">
                <Flipped
                  flipId={`description-${index}-1`}
                  stagger="card-content"
                >
                  <div />
                </Flipped>
                <Flipped
                  flipId={`description-${index}-2`}
                  stagger="card-content"
                >
                  <div />
                </Flipped>
                <Flipped
                  flipId={`description-${index}-3`}
                  stagger="card-content"
                >
                  <div />
                </Flipped>
              </div>
              <div className="additional-content">
                <div />
                <div />
                <div />
              </div>
            </div>
          </Flipped>
        </div>
      </Flipped>
    </Swipe>
  )
}
export default class AnimatedList extends Component {
  state = { focused: [] }
  onClick = index => {
    if (this.state.focused.includes(index)) {
      return this.setState({
        focused: this.state.focused.filter(n => n !== index)
      })
    }
    return this.setState({
      focused: this.state.focused.concat(index)
    })
  }
  render() {
    return (
      <Flipper
        flipKey={this.state.focused.join('')}
        className="staggered-list-content"
        spring="gentle"
        decisionData={this.state.focused}
      >
        <ul className="list">
          {listData.map(index => {
            const color = colors[index % colors.length]
            return (
              <li>
                {this.state.focused.includes(index) ? (
                  <ExpandedListItem
                    index={index}
                    color={color}
                    onClick={this.onClick}
                  />
                ) : (
                  <ListItem
                    index={index}
                    key={index}
                    color={color}
                    onClick={this.onClick}
                  />
                )}
              </li>
            )
          })}
        </ul>
      </Flipper>
    )
  }
}
