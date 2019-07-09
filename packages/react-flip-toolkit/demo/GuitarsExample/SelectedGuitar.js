import React, { Component } from 'react'
import { Flipped, spring } from '../../src'

class SelectedGuitar extends Component {
  animateIn = () => {
    ;[...this.el.querySelectorAll('*[data-fade-in]')].forEach((el, i) => {
      spring({
        values: {
          translateY: [-15, 0],
          opacity: [0, 1]
        },
        onUpdate: ({ translateY, opacity }) => {
          el.style.opacity = opacity
          el.style.transform = `translateY(${translateY}px)`
        },
        delay: i * 75
      })
    })
  }

  animateOut = () => {
    ;[...this.el.querySelectorAll('*[data-fade-in]')].forEach((el, i) => {
      spring({
        values: {
          translateY: [0, -30],
          opacity: [1, 0]
        },
        onUpdate: ({ translateY, opacity }) => {
          el.style.opacity = opacity
          el.style.transform = `translateY(${translateY}px)`
        },
        delay: i * 50,
        onComplete: this.props.closeSelected
      })
    })
  }

  render() {
    const { title, subtitle, description, price, index, image } = this.props
    const parentId = `guitar-${index}`
    return (
      <div className="details details--open" ref={el => (this.el = el)}>
        <div className="details__bg details__bg--up" />
        <Flipped
          flipId={`${parentId}-productBackground`}
          onComplete={this.animateIn}
        >
          <div className="details__bg details__bg--down" />
        </Flipped>
        <Flipped flipId={`${parentId}-guitarImg`} spring="wobbly">
          <img className="details__img" src={image} />
        </Flipped>
        <h2 className="details__title" data-fade-in>
          {title}
        </h2>
        <div
          className="details__deco"
          data-fade-in
          style={{
            backgroundImage: `url(https://tympanus.net/Development/ExpandingGridItemAnimation/img/${index +
              1}.png`
          }}
        />
        <h3 className="details__subtitle" data-fade-in>
          {subtitle}
        </h3>
        <div className="details__price" data-fade-in>
          ${price}
        </div>
        <p className="details__description" data-fade-in>
          {description}
        </p>
        <button className="details__addtocart" data-fade-in>
          Add to cart
        </button>
        <button className="details__close" onClick={this.animateOut}>
          <div className="icon icon--cross">
            <svg id="icon-cross" viewBox="0 0 24 24" width="100%" height="100%">
              <title>cross</title>
              <path d="M 5.5,2.5 C 5.372,2.5 5.244,2.549 5.146,2.646 L 2.646,5.146 C 2.451,5.341 2.451,5.659 2.646,5.854 L 8.793,12 2.646,18.15 C 2.451,18.34 2.451,18.66 2.646,18.85 L 5.146,21.35 C 5.341,21.55 5.659,21.55 5.854,21.35 L 12,15.21 18.15,21.35 C 18.24,21.45 18.37,21.5 18.5,21.5 18.63,21.5 18.76,21.45 18.85,21.35 L 21.35,18.85 C 21.55,18.66 21.55,18.34 21.35,18.15 L 15.21,12 21.35,5.854 C 21.55,5.658 21.55,5.342 21.35,5.146 L 18.85,2.646 C 18.66,2.451 18.34,2.451 18.15,2.646 L 12,8.793 5.854,2.646 C 5.756,2.549 5.628,2.5 5.5,2.5 Z" />
            </svg>
          </div>
        </button>
      </div>
    )
  }
}

export default SelectedGuitar
