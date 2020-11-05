import React, { Component } from "react"
import { createPortal } from "react-dom"
import  { Flipped } from "../../../src"

class Modal extends Component {
  static propTypes = {}

  render() {
    return createPortal(
      <div
        className={`portal-modal ${this.props.type} ${
          this.props.animatingOut ? "portal-modal--animating-out" : ""
        }`}
        onClick={this.props.onClick}
      >
        {!this.props.animatingOut && (
          <Flipped
            flipId={`icon-${this.props.iconIndex}`}
            onStart={el => (el.style.zIndex = 10)}
            onComplete={el => (el.style.zIndex = "")}
          >
            <img src={this.props.icon} alt="" className="focused-portal-img" />
          </Flipped>
        )}
      </div>,
      this.props.container
    )
  }
}

export default Modal
