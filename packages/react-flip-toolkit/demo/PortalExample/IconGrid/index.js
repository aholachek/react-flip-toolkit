import React, { Component } from "react"
import { Flipper, Flipped } from "../../../src/index";

import Modal from "./Modal"

class PortalExample extends Component {
  static propTypes = {}

  state = {
    focusedIcon: false,
    modalAnimatingOut: false
  }

  closeModal = () => {
    this.setState({ modalAnimatingOut: true, focusedIcon: false })
    setTimeout(() => {
      this.setState({
        modalAnimatingOut: false
      })
    }, 400)
  }

  componentDidMount = () => {
    this.modalContainer = document.createElement("div")
    document.querySelector("body").appendChild(this.modalContainer)
  }
  componentWillUnmount() {
    document.querySelector("body").removeChild(this.modalContainer)
  }

  render() {
    const { icons, portalKey, title } = this.props
    return (
      <div className="icon-grid">
        <Flipper flipKey={this.state.focusedIcon} portalKey={portalKey}>
          <div>
            <h2>{title}</h2>
            <ul className="portal-image-list">
              {icons.map((icon, i) => {
                if (
                  i === this.state.focusedIcon &&
                  !this.state.modalAnimatingOut
                )
                  return <li />
                return (
                  <li>
                    <Flipped
                      flipId={`icon-${i}`}
                      onStart={el => (el.style.zIndex = 10)}
                      onComplete={el => (el.style.zIndex = "")}
                    >
                      <img
                        src={icon}
                        alt=""
                        onClick={() => {
                          this.setState({ focusedIcon: i })
                        }}
                      />
                    </Flipped>
                  </li>
                )
              })}
            </ul>
          </div>
          {(typeof this.state.focusedIcon === "number" ||
            this.state.modalAnimatingOut) && (
            <Modal
              type={portalKey}
              icon={icons[this.state.focusedIcon]}
              iconIndex={this.state.focusedIcon}
              container={this.modalContainer}
              animatingOut={this.state.modalAnimatingOut}
              onClick={this.closeModal}
            />
          )}
        </Flipper>
      </div>
    )
  }
}

export default PortalExample
