import React, { Component } from "react"
import { Flipper, Flipped } from "../../../src"
import "./styles.css"

const SmallSquare = ({ onClick, ...rest }) => (
  <div className="square" onClick={onClick} {...rest} />
)

const BigSquare = ({ onClick, ...rest }) => (
  <div className="full-screen-square square" onClick={onClick} {...rest} />
)

export default class AnimatedSquare extends Component {
  state = { fullScreen: false }

  toggleFullScreen = () => {
    this.setState(prevState => ({
      fullScreen: !prevState.fullScreen
    }))
  }

  render() {
    return (
      <Flipper
        flipKey={this.state.fullScreen}
        className="transform-example-container"
      >
        {this.state.fullScreen ? (
          <Flipped flipId="square" freeAgent>
            <BigSquare onClick={this.toggleFullScreen} />
          </Flipped>
        ) : (
          <Flipped flipId="square" freeAgent>
            <SmallSquare onClick={this.toggleFullScreen} />
          </Flipped>
        )}
      </Flipper>
    )
  }
}
