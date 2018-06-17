import React, { Component } from "react"
import { Flipper } from "../../../src"
import GuitarItem from "./GuitarItem"
import SelectedGuitar from "./SelectedGuitar"
import guitarsData from "./guitarsData"

class GuitarExample extends Component {
  static defaultProps = {}

  static propTypes = {}

  state = {
    focusedGuitarIndex: null
  }
  componentDidMount() {
    require("./css/base.css")
    require("./pater/pater.css")
  }

  render() {
    return (
      <Flipper flipKey={this.state.focusedGuitarIndex} duration={400}>
        <main>
          <div className="content">
            <header className="codrops-header">
              <div className="codrops-links">
                <a
                  className="codrops-icon codrops-icon--prev"
                  href="https://tympanus.net/Development/KyloRenPreloader/"
                  title="Previous Demo"
                >
                  {/* <svg className="icon icon--arrow">
                  <use xlink:href="#icon-arrow" />
                </svg> */}
                </a>
                <a
                  className="codrops-icon codrops-icon--drop"
                  href="https://tympanus.net/codrops/?p=32944"
                  title="Back to the article"
                >
                  {/* <svg className="icon icon--drop">
                  <use xlink:href="#icon-drop" />
                </svg> */}
                </a>
              </div>
              <h1 className="codrops-header__title">
                Expanding Grid Item Animation
              </h1>
              <span className="info">
                Based on the Dribbble shot{" "}
                <a href="https://dribbble.com/shots/3879463-Surf-Project">
                  Surf Project
                </a>{" "}
                by{" "}
                <a href="https://dribbble.com/filipslovacek">
                  Filip Slov&#225;&#269;ek
                </a>
              </span>
              <span className="info">
                Front end code is adapted to use React and react-flip-toolkit
                from{" "}
                <a href="https://tympanus.net/Development/ExpandingGridItemAnimation/">
                  Codrop's vanilla JS implementation.
                </a>
              </span>
            </header>
          </div>
          <button className="dummy-menu">
            {/* <svg className="icon icon--menu">
            <use xlink:href="#icon-menu" />
          </svg> */}
          </button>
          <div className="content">
            {typeof this.state.focusedGuitarIndex !== "number" && (
              <div className="grid">
                {guitarsData.map((g, i) => {
                  return (
                    <GuitarItem
                      {...g}
                      index={i}
                      onClick={() =>
                        this.setState({
                          focusedGuitarIndex: i
                        })
                      }
                    />
                  )
                })}
              </div>
            )}
            {typeof this.state.focusedGuitarIndex === "number" && (
              <SelectedGuitar
                {...guitarsData[this.state.focusedGuitarIndex]}
                index={this.state.focusedGuitarIndex}
                closeSelected={() =>
                  this.setState({
                    focusedGuitarIndex: undefined
                  })
                }
              />
            )}
          </div>
          <section className="content content--related">
            <p>original </p>
            <p>
              Guitar vector{" "}
              <a href="http://www.freepik.com">designed by Freepik</a>.
            </p>
            <p>
              Patterns by <a href="https://pixelbuddha.net/">Pixel Buddha</a>.
            </p>
          </section>
        </main>
      </Flipper>
    )
  }
}

export default GuitarExample
