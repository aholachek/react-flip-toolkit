/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-return-assign */

import React, { Component } from "react"
import { Flipper, Flipped } from "../../../src"
import imgSrc from "./assets/pro_img.png"
import "./styles.css"

class PaymentSidebar extends Component {
  state = { collapsed: false }
  toggleCollapsed = () => {
    this.setState({ collapsed: !this.state.collapsed })
  }
  render() {
    const { collapsed } = this.state
    const sidebarClassName = `sidebar ${collapsed ? "sidebarCollapsed" : ""}`

    return (
      <Flipper flipKey={collapsed} duration={800}>
        <Flipped flipId="container">
          <div className={sidebarClassName} onClick={this.toggleCollapsed}>
            <Flipped inverseFlipId="container">
              <div>
                <Flipped flipId="sidebarImg">
                  <div
                    className="decorativeImg"
                    style={{ backgroundImage: `url(${imgSrc})` }}
                  />
                </Flipped>

                <div className="sidebarBody">
                  <Flipped flipId="sidebarHeader">
                    <h1 className="sidebarHeader">Codecademy Pro</h1>
                  </Flipped>
                  <div className="sidebarContent">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Molestiae deleniti reprehenderit est necessitatibus qui iste
                    maiores enim amet atque nostrum? Facere ad eveniet
                    cupiditate molestiae, repellendus nisi consectetur quasi
                    adipisci.
                  </div>
                </div>
              </div>
            </Flipped>
          </div>
        </Flipped>
      </Flipper>
    )
  }
}

export default PaymentSidebar
