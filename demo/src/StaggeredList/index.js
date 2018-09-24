// inspired by this animated demo:
// https://uxplanet.org/animation-in-ui-design-from-concept-to-reality-85c49907b19d
import React, { Component } from "react"
import { Flipper, Flipped } from "../../../src/index.js"
import "./styles.css"
const listData = [0, 1, 2, 3, 4, 5, 6, 7]
const colors = ["#ff4f66", "#7971ea", "#5900d8"]
const ListItem = ({ index, color, onClick }) => {
  return (
    <Flipped flipId={`listItem-${index}`} stagger="card">
      <div
        className="listItem"
        style={{ backgroundColor: color }}
        onClick={() => onClick(index)}
      >
        <Flipped
          inverseFlipId={`listItem-${index}`}
          componentIdFilter="expanded-list-item"
        >
          <div className="listItemContent">
            <Flipped
              flipId={`avatar-${index}`}
              componentIdFilter="expanded-list-avatar"
              stagger="card-content"
            >
              <div className="avatar" />
            </Flipped>
            <div className="description">
              <Flipped
                flipId={`description-${index}-1`}
                componentIdFilter="expanded-description-item"
                stagger="card-content"
              >
                <div />
              </Flipped>
              <Flipped
                flipId={`description-${index}-2`}
                componentIdFilter="expanded-description-item"
                stagger="card-content"
              >
                <div />
              </Flipped>
              <Flipped
                flipId={`description-${index}-3`}
                componentIdFilter="expanded-description-item"
                stagger="card-content"
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
const ExpandedListItem = ({ index, color, onClick }) => {
  return (
    <Flipped
      flipId={`listItem-${index}`}
      componentId="expanded-list-item"
      stagger="card"
      onComplete={el => {
        el.classList.add("animated-in")
      }}
    >
      <div
        className="expandedListItem"
        style={{ backgroundColor: color }}
        onClick={() => onClick(index)}
      >
        <Flipped inverseFlipId={`listItem-${index}`}>
          <div className="expandedListItemContent">
            <Flipped
              flipId={`avatar-${index}`}
              componentId="expanded-list-avatar"
              stagger="card-content"
            >
              <div className="avatar avatarExpanded" />
            </Flipped>
            <div className="description">
              <Flipped
                flipId={`description-${index}-1`}
                componentId="expanded-description-item"
                stagger="card-content"
              >
                <div />
              </Flipped>
              <Flipped
                flipId={`description-${index}-2`}
                componentId="expanded-description-item"
                stagger="card-content"
              >
                <div />
              </Flipped>
              <Flipped
                flipId={`description-${index}-3`}
                componentId="expanded-description-item"
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
  )
}
export default class AnimatedList extends Component {
  state = { focused: null }
  onClick = index =>
    this.setState({
      focused: this.state.focused === index ? null : index
    })
  render() {
    return (
      <Flipper
        flipKey={this.state.focused}
        className="content"
        spring="gentle"
        staggerConfig={{
          card: this.state.focused !== null ? "reverse" : "forwards"
        }}
      >
        <ul className="list">
          {listData.map(index => {
            return (
              <li>
                {index === this.state.focused ? (
                  <ExpandedListItem
                    index={this.state.focused}
                    color={colors[this.state.focused % colors.length]}
                    onClick={this.onClick}
                  />
                ) : (
                  <ListItem
                    index={index}
                    key={index}
                    color={colors[index % colors.length]}
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
