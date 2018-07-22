import React, { Component } from "react"
import PropTypes from "prop-types"
import { Flipper, Flipped } from "../../../src"
import Modal from "./Modal"
import "./styles.css"

import plant1 from "./assets/plant-1.jpg"
import plant2 from "./assets/plant-2.jpg"
import plant3 from "./assets/plant-3.jpg"
import plant4 from "./assets/plant-4.jpg"
import plant5 from "./assets/plant-5.jpg"

const plants = [plant1, plant2, plant3, plant4, plant5]

class PortalExample extends Component {
  static propTypes = {}

  state = {
    focusedImg: false
  }

  componentDidMount = () => {
    this.modalContainer = document.createElement("div")
    document.querySelector("body").appendChild(this.modalContainer)
  }
  componentWillUnmount() {
    document.querySelector("body").removeChild(this.modalContainer)
  }

  render() {
    return (
      <div>
        <Flipper flipKey={this.state.focusedImg}>
          {typeof this.state.focusedImg === "number" ? (
            <Modal
              img={plants[this.state.focusedImg]}
              imgIndex={this.state.focusedImg}
              container={this.modalContainer}
              onClick={() => {
                this.setState({ focusedImg: false })
              }}
            />
          ) : (
            <ul className="portal-image-list">
              {plants.map((p, i) => {
                return (
                  <li>
                    <Flipped flipId={`image-${i}`}>
                      <img
                        src={p}
                        alt=""
                        onClick={() => {
                          this.setState({ focusedImg: i })
                        }}
                      />
                    </Flipped>
                  </li>
                )
              })}
            </ul>
          )}
        </Flipper>
      </div>
    )
  }
}

export default PortalExample
