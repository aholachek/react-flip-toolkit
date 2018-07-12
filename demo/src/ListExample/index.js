import React, { Component } from "react"
import { Flipper, Flipped } from "../../../src"
import anime from "animejs"
import "./index.css"

const colors = ["#ff4f66", "#7971ea", "#5900d8"]

const data = [].slice.apply(Array(30).keys()).map(i => ({
  color: colors[i % colors.length],
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
  el.style.transformOrigin = "50% 50%"
  el.style.zIndex = 0
  anime({
    targets: el,
    duration: 500,
    opacity: 0,
    complete: removeElement,
    delay: index * 50,
    easing: "easeOutSine"
  }).pause
}

class ListExample extends Component {
  state = {
    filter: undefined,
    sort: "ascending",
    data: [...data],
    continuousUpdating: false
  }

  toggleContinuousUpdating = update => {
    if (update) {
      this.intervalId = setInterval(() => {
        const filteredData = [...data].filter(
          x => (Math.random() > 0.5 ? true : false)
        )
        this.setState({
          data: filteredData
        })
      }, 1500)
    } else {
      clearInterval(this.intervalId)
      delete this.intervalId
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.continuousUpdating && !prevState.continuousUpdating) {
      this.toggleContinuousUpdating(true)
    } else if (!this.state.continuousUpdating && prevState.continuousUpdating) {
      this.toggleContinuousUpdating(false)
    }
  }

  render() {
    return (
      <Flipper
        flipKey={`${this.state.filter ? this.state.filter : ""}-${
          this.state.sort
        }-${JSON.stringify(this.state.data)}`}
        ease="easeOutExpo"
      >
        <main className="list-example">
          <h1>
            Continually updating filtered list with appear and exit animations
          </h1>
          <h2>Uses springs for easing</h2>
          <p>
            This is a stress test to show continuously interrupted, staggered
            animations. The top and bottom animations should be identical except
            for having different onAppear animations.
          </p>
          <div className="list-flex">
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
                <input
                  type="radio"
                  name="sort"
                  checked={this.state.sort === "descending"}
                />
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
                onClick={() => {
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
          </div>

          <div>
            <button
              className="list-toggle-updating"
              onClick={() => {
                this.setState(prevState => ({
                  continuousUpdating: !prevState.continuousUpdating
                }))
              }}
            >
              {this.state.continuousUpdating
                ? "Cancel update interval"
                : "Start continuously updating list"}
            </button>
          </div>
          <h2>Regular onAppear</h2>
          <ul className="list">
            {[...this.state.data]
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
                    delay={i * 25}
                  >
                    <li className="listItem" style={{ backgroundColor: color }}>
                      {key}
                    </li>
                  </Flipped>
                )
              })}
          </ul>

          <h2>Delayed onAppear</h2>

          <ul className="list">
            {[...this.state.data]
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
                    flipId={`item-2-${key}`}
                    onDelayedAppear={onElementAppear}
                    onExit={onExit}
                    key={`item-${key}`}
                    delay={i * 25}
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
