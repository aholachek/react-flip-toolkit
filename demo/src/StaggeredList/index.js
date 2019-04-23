// inspired by this animated demo:
// https://uxplanet.org/animation-in-ui-design-from-concept-to-reality-85c49907b19d
import React, { Component } from 'react'
import { Flipper, Flipped } from '../../../src/index'
import './styles.css'
const listData = [0, 1, 2, 3, 4, 5, 6, 7]

const shouldFlip = index => (prev, current) => {
  if (index === prev || index === current) return true
  return false
}

const ListItem = ({ index, onClick }) => {
  return (
    <Flipped
      flipId={`listItem-${index}`}
      shouldInvert={shouldFlip(index)}
      respondToGesture={{
        initFLIP: () => {
          onClick(index)
        },
        cancelFLIP: () => {
          onClick(index)
        },
        direction: 'down',
        completeThreshold: 400
      }}
    >
      <div className="listItem">
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
                stagger="card-content"
                shouldFlip={shouldFlip(index)}
              >
                <div />
              </Flipped>
            </div>
          </div>
        </Flipped>
      </div>
    </Flipped>
  )
}

const ExpandedListItem = ({ index, onClick }) => {
  return (
    <Flipped
      flipId={`listItem-${index}`}
      onStartImmediate={el => {
        setTimeout(() => {
          el.classList.add('animated-in')
        }, 400)
      }}
      respondToGesture={{
        initFLIP: () => {
          onClick(index)
        },
        cancelFLIP: () => {
          onClick(index)
        },
        direction: 'up',
        completeThreshold: 400
      }}
    >
      <div className="expandedListItem">
        <Flipped inverseFlipId={`listItem-${index}`}>
          <div className="expandedListItemContent">
            <Flipped flipId={`avatar-${index}`} stagger="card-content">
              <div className="avatar avatarExpanded" />
            </Flipped>
            <div className="description">
              <Flipped flipId={`description-${index}-1`} stagger="card-content">
                <div />
              </Flipped>
              <Flipped flipId={`description-${index}-2`} stagger="card-content">
                <div />
              </Flipped>
              <Flipped flipId={`description-${index}-3`} stagger="card-content">
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
        isGestureControlled
        flipKey={this.state.focused}
        className="staggered-list-content"
        spring="gentle"
        decisionData={this.state.focused}
      >
        <ul className="list">
          {listData.map(index => {
            return (
              <li>
                {this.state.focused.includes(index) ? (
                  <ExpandedListItem index={index} onClick={this.onClick} />
                ) : (
                  <ListItem index={index} key={index} onClick={this.onClick} />
                )}
              </li>
            )
          })}
        </ul>
      </Flipper>
    )
  }
}
