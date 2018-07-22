import React, { Component } from "react"
import { createPortal } from "react-dom"
import PropTypes from "prop-types"
import { Flipped } from "../../../src"

class Modal extends Component {
  static propTypes = {}

  render() {
    return createPortal(
      <div className="portal-modal" onClick={this.props.onClick}>
        <Flipped flipId={`image-${this.props.imgIndex}`} delay={200}>
          <img src={this.props.img} alt="" className="focused-portal-img" />
        </Flipped>
      </div>,
      this.props.container
    )
  }
}

export default Modal
