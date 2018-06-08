import React, { Component } from "react"
import PropTypes from "prop-types"
import { Flipped } from "../../src/index"

class UserGrid extends Component {
  render() {
    return (
      <ul className="grid">
        {this.props.data.map((d, i) => {
          const parentFlipId = `card-${i}`
          if (i === this.props.focusedIndex) return <li></li>
          return (
            <li>
              {
                <Flipped flipId={parentFlipId} all>
                <div
                  className="gridItem"
                  onClick={() => this.props.setFocusedIndex(i)}
                  role="button"
                >
                  <Flipped
                    inverseFlipId={parentFlipId}
                    all
                    transformOriginTopLeft
                  >
                    <div>
                      <h2 className="gridItemTitle">{d.name}</h2>
                      <Flipped
                        inverseFlipId={parentFlipId}
                        flipId={`${parentFlipId}-avatar`}
                        all
                        transformOriginTopLeft
                      >
                        <img
                          src={d.avatar}
                          alt={`user profile for ${d.name}`}
                          className="gridItemAvatar"
                        />
                      </Flipped>
                      <h2 className="gridItemJob">{d.job}</h2>
                    </div>
                  </Flipped>
                </div>
              </Flipped>
              }
            </li>
          )
        })}
      </ul>
    )
  }
}

export default UserGrid
