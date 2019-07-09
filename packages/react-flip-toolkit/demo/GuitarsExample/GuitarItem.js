import React, { Component } from 'react'
import { Flipped } from '../../src'

class GuitarItem extends Component {
  static defaultProps = {}

  static propTypes = {}

  onStartImmediate = el => {
    el.style.zIndex = 10
  }

  onComplete = el => (el.style.zIndex = '')

  render() {
    const { index, title, subtitle, onClick, image } = this.props
    const parentId = `guitar-${index}`
    return (
      <div className="grid__item" onClick={onClick}>
        <div className="product">
          <Flipped
            flipId={`${parentId}-productBackground`}
            onStartImmediate={this.onStartImmediate}
            onComplete={this.onComplete}
          >
            <div className="product__bg" />
          </Flipped>
          <Flipped
            flipId={`${parentId}-guitarImg`}
            onStartImmediate={this.onStartImmediate}
            onComplete={this.onComplete}
          >
            <img className="product__img" src={image} />
          </Flipped>
          <h2 className="product__title">{title}</h2>
          <h3 className="product__subtitle">{subtitle}</h3>
        </div>
      </div>
    )
  }
}

export default GuitarItem
