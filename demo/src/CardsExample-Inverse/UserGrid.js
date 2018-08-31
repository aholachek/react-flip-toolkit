import React, { Component } from "react"
import Card from "./Card"

class UserGrid extends Component {
  render() {
    return (
      <ul className="cardGrid">
        {this.props.data.map((d, i) => {
          const parentFlipId = `card-${i}`
          if (i === this.props.focusedIndex) return null
          return (
            <Card
              parentFlipId={parentFlipId}
              i={i}
              d={d}
              setFocusedIndex={this.props.setFocusedIndex}
            />
          )
        })}
      </ul>
    )
  }
}

export default UserGrid
