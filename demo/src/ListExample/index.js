import React, { Component } from "react"
import PropTypes from "prop-types"
import { Flipper, Flipped } from "../../../src"
import anime from "animejs"
import "./index.css"

const colors = ["#ff4f66", "#7971ea", "#5900d8"]

const data = Array.from(Array(25).keys()).map(i => ({
  color: colors[Math.floor(Math.random() * colors.length)],
  key: i
}))

const onElementAppear = (el, index) => {
  anime({
    targets: el,
    opacity: [0, 1],
    delay: index * 50,
    easing: "easeOutSine"
  })
}

const onExit = (el, index, removeElement) => {
  anime({
    targets: el,
    opacity: 0,
    delay: index * 50,
    complete: removeElement,
    easing: "easeOutSine"
  })
}

class ListExample extends Component {
  state = { filter: undefined, sort: "ascending" }
  render() {
    return (
      <Flipper flipKey={`${this.state.filter}-${this.state.sort}`}>
        <main className="list-example">
          <fieldset>
            <legend>Sort</legend>
            <label
              onClick={() => {
                this.setState({
                  sort: "ascending"
                })
              }}
            >
              <input
                type="radio"
                name="sort"
                checked={this.state.sort === "ascending"}
              />
              ascending
            </label>
            <label
              onClick={() => {
                this.setState({
                  sort: "descending"
                })
              }}
            >
              <input type="radio" name="sort" />
              descending
            </label>
            <label
              onClick={() => {
                this.setState({
                  sort: "color"
                })
              }}
            >
              <input type="radio" name="sort" />
              by color
            </label>
          </fieldset>

          <fieldset>
            <legend>Filter</legend>
            {colors.map(color => {
              return (
                <label
                  onClick={() => {
                    this.setState({
                      filter: color
                    })
                  }}
                >
                  <input type="radio" name="color-filter" />
                  <span
                    className="colorLabel"
                    style={{ backgroundColor: color }}
                  />
                </label>
              )
            })}
            <label
              onClick={prevState => {
                this.setState({
                  filter: undefined
                })
              }}
            >
              <input
                type="radio"
                name="color-filter"
                checked={!this.state.filter}
              />
              <span>all colors</span>
            </label>
          </fieldset>

          <ul className="list">
            {[...data]
              .sort((a, b) => {
                if (this.state.sort === "ascending") {
                  return a.key - b.key
                } else if (this.state.sort === "descending") {
                  return b.key - a.key
                } else if (this.state.sort === "color") {
                  if (a.color < b.color) return -1
                  else if (b.color < a.color) return 1
                  return 0
                }
              })
              .filter(d => {
                if (!this.state.filter) return true
                return d.color !== this.state.filter
              })
              .map(({ color, key }, i) => {
                return (
                  <Flipped
                    flipId={`item-${key}`}
                    onAppear={onElementAppear}
                    onExit={onExit}
                    key={`item-${key}`}
                    delay={i => i * 50}
                  >
                    <li className="listItem" style={{ backgroundColor: color }}>
                      {key}
                    </li>
                  </Flipped>
                )
              })}
          </ul>
        </main>
      </Flipper>
    )
  }
}

export default ListExample
