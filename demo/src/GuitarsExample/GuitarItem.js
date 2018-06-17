import React, { Component } from "react"
import PropTypes from "prop-types"
import { Flipped } from "../../../src/index"

class GuitarItem extends Component {
  static defaultProps = {}

  static propTypes = {}

  render() {
    const { index, title, subtitle, onClick } = this.props
    const parentId = `guitar-${index}`
    return (
      <div className="grid__item" onClick={onClick}>
        <div className="product">
          <Flipped flipId={`${parentId}-productBackground`}>
            <div className="product__bg" />
          </Flipped>
          <Flipped flipId={`${parentId}-guitarImg`}>
            <img
              className="product__img"
              src={require(`./img/${index + 1}.png`)}
            />
          </Flipped>
          <h2 className="product__title">{title}</h2>
          <h3 className="product__subtitle">{subtitle}</h3>
        </div>
      </div>
    )
  }
}

export default GuitarItem
