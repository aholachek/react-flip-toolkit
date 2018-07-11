/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-return-assign */
import "./index.css"

import React, { Component } from "../../../../../../Library/Caches/typescript/2.9/node_modules/@types/react"
import anime from "../../../../../../Library/Caches/typescript/2.9/node_modules/@types/animejs"
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

const duration = 500

class PhotoGrid extends Component {
  applyZIndex = el => {
    el.style.zIndex = 3
    setTimeout(() => {
      el.style.zIndex = ""
    }, duration)
  }
  applyZIndexHeader = el => {
    el.style.zIndex = 4
    setTimeout(() => {
      el.style.zIndex = ""
    }, duration)
  }
  animateIn = () => {
    anime({
      targets: this.el.querySelectorAll("*[data-fade-in]"),
      translateY: [50, 0],
      opacity: [0, 1],
      duration: 600,
      elasticity: 0,
      ease: "easeOutSine",
      delay: (d, i) => i * 60
    })
  }

  state = { focused: false }
  togglefocused = () => {
    this.setState({ focused: !this.state.focused })
  }
  render() {
    const { focused } = this.state

    return (
      <Flipper flipKey={focused} duration={duration}>
        <div className="photoGridExample" ref={el => (this.el = el)}>
          <div className="photoGrid">
            {data.map((d, i) => {
              return (
                <div>
                  {i !== focused && (
                    <div
                      className="photoGridSquare"
                      onClick={() => {
                        this.setState({ focused: i })
                      }}
                    >
                      <Flipped
                        flipId={`heading-${i}`}
                        onStart={this.applyZIndexHeader}
                      >
                        <h1 className="photoGridHeading">{data[i].title}</h1>
                      </Flipped>{" "}
                      <Flipped flipId={`img-${i}`} onStart={this.applyZIndex}>
                        <img src={d.img} alt="" className="photoGridImg" />
                      </Flipped>
                      <Flipped
                        flipId={`shader-${i}`}
                        onStart={this.applyZIndex}
                      >
                        <div className="photoGridShader photoGridShaderHidden" />
                      </Flipped>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          {typeof focused === "number" && (
            <div
              className="photoGridSquareExpanded"
              onClick={() => {
                this.setState({ focused: null })
              }}
            >
              <Flipped
                flipId={`img-${focused}`}
                onComplete={this.animateIn}
                onStart={this.animateZIndex}
              >
                <img src={data[focused].img} alt="" className="photoGridImg" />
              </Flipped>

              <Flipped flipId={`shader-${focused}`}>
                <div className="photoGridShader" />
              </Flipped>
              <div className="photoGridFocused">
                <div className="photoGridContentContainer">
                  <Flipped flipId={`heading-${focused}`}>
                    <h1 className="photoHeading">{data[focused].title}</h1>
                  </Flipped>
                  <p data-fade-in className="photoGridLead">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Dolorum ipsam magni, quibusdam quia dolores iste blanditiis
                    neque modi.
                  </p>

                  <p data-fade-in>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Dolorum ipsam magni, quibusdam quia dolores iste blanditiis
                    neque modi. Id voluptatibus tempora itaque sint est nobis
                    non fugit modi atque quia!
                  </p>
                  <p data-fade-in>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Dolorum ipsam magni, quibusdam quia dolores iste blanditiis
                    neque modi. Id voluptatibus tempora itaque sint est nobis
                    non fugit modi atque quia!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Flipper>
    )
  }
}

export default PhotoGrid
