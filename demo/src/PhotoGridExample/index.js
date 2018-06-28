/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-return-assign */

import React, { Component } from "react"
import anime from "animejs"
import { Flipper, Flipped } from "../../../src"
import detail1Img from "./assets/detail-1.jpg"
import detail5Img from "./assets/detail-5.jpg"
import detail6Img from "./assets/detail-6.jpg"
import detail8Img from "./assets/detail-8.jpg"

const data = [
  { img: detail1Img, title: "The Great Outdoors" },
  { img: detail5Img, title: "The Hills are Alive" },
  { img: detail8Img, title: "Tree in The Fog" },
  { img: detail6Img, title: "What a Mountain" }
]

import "./index.css"

class PhotoGrid extends Component {
  applyZIndex = (el, startId) => {
    el.style.zIndex = 3
    setTimeout(() => {
      el.style.zIndex = 1
    }, 250)
  }
  animateIn = (el, startId) => {
    anime({
      targets: el.querySelectorAll("*[data-fade-in]"),
      translateY: [30, 0],
      opacity: [0, 1],
      duration: 600,
      elasticity: 0,
      ease: "easeOutSine",
      delay: (d, i) => 100 + i * 50
    })

    el.style.zIndex = 1
  }

  state = { focused: false }
  togglefocused = () => {
    this.setState({ focused: !this.state.focused })
  }
  render() {
    const { focused } = this.state

    return (
      <Flipper flipKey={focused} duration={600}>
        <div className="photoGridExample">
          <div className="photoGrid">
            {data.map((d, i) => {
              return (
                <div>
                  {i !== focused && (
                    <Flipped flipId={`img-${i}`} onStart={this.applyZIndex}>
                      <div
                        className="photoGridSquare"
                        onClick={() => {
                          this.setState({ focused: i })
                        }}
                      >
                        <Flipped inverseFlipId={`img-${i}`}>
                          <div>
                            <Flipped flipId={`heading-${i}`}>
                              <h1 className="photoGridHeading">
                                {data[i].title}
                              </h1>
                            </Flipped>{" "}
                          </div>
                        </Flipped>
                        <img src={d.img} alt="" className="photoGridImg" />
                        <Flipped opacity flipId={`shader-${i}`}>
                          <div className="photoGridShader photoGridShaderHidden" />
                        </Flipped>
                      </div>
                    </Flipped>
                  )}
                </div>
              )
            })}
          </div>
          {typeof focused === "number" && (
            <Flipped flipId={`img-${focused}`} onComplete={this.animateIn}>
              <div
                className="photoGridSquareExpanded"
                onClick={() => {
                  this.setState({ focused: null })
                }}
              >
                <img src={data[focused].img} alt="" className="photoGridImg" />
                <Flipped opacity flipId={`shader-${focused}`} delay={200}>
                  <div className="photoGridShader" />
                </Flipped>
                <Flipped inverseFlipId={`img-${focused}`}>
                  <div className="photoGridFocused">
                    <div className="photoGridContentContainer">
                      <Flipped flipId={`heading-${focused}`}>
                        <h1 className="photoHeading">{data[focused].title}</h1>
                      </Flipped>
                      <p data-fade-in className="photoGridLead">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Dolorum ipsam magni, quibusdam quia dolores iste
                        blanditiis neque modi. Id voluptatibus tempora itaque
                        sint est nobis non fugit modi atque quia!
                      </p>

                      <p data-fade-in>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Dolorum ipsam magni, quibusdam quia dolores iste
                        blanditiis neque modi. Id voluptatibus tempora itaque
                        sint est nobis non fugit modi atque quia!
                      </p>
                      <p data-fade-in>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Dolorum ipsam magni, quibusdam quia dolores iste
                        blanditiis neque modi. Id voluptatibus tempora itaque
                        sint est nobis non fugit modi atque quia!
                      </p>
                      <p data-fade-in>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Dolorum ipsam magni, quibusdam quia dolores iste
                        blanditiis neque modi. Id voluptatibus tempora itaque
                        sint est nobis non fugit modi atque quia!
                      </p>
                    </div>
                  </div>
                </Flipped>
              </div>
            </Flipped>
          )}
        </div>
      </Flipper>
    )
  }
}

export default PhotoGrid
