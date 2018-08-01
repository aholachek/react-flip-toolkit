import React, { Component } from "react"
import { Flipper, Flipped } from "../../../src"
import anime from "animejs"
import "./index.css"

const data = [
  { id: 1, title: "Somebody once told me" },
  { id: 2, title: "The World was gonna roll me" },
  { id: 3, title: "I aint the sharpest tool in the shed" },
  {
    id: 4,
    title: "She was looking kind of dumb"
  },
  {
    id: 5,
    title: "With her finger and her thumb"
  },
  { id: 6, title: "In the Shape of an L on her Forehead" },
  { id: 7, title: "Well the years start coming" }
]

const onElementAppear = (el, index) => {
  anime({
    targets: el,
    opacity: [0, 1],
    duration: 400,
    delay: index * 50,
    easing: "easeOutSine"
  })
}

const onExit = type => (el, index, removeElement) => {
  anime({
    targets: el,
    scaleY: type === "list" ? 0 : 1,
    scaleX: type === "grid" ? 0 : 1,
    duration: 200,
    complete: removeElement,
    easing: "easeOutSine"
  }).pause

  return () => {
    el.style.opacity = ""
    removeElement()
  }
}

const onGridExit = onExit("grid")
const onListExit = onExit("list")

class ListExample extends Component {
  state = { type: "list", sort: "asc", filteredIds: [], drag: true }

  render() {
    return (
      <div className="fm-example">
        <div className="fm-description">
          <h1>List Animations </h1>
          <p>
            Animations for: card enter/exit, staggered sort, and list/grid
            toggle
          </p>
        </div>
        <Flipper
          flipKey={`${this.state.type}-${this.state.sort}-${JSON.stringify(
            this.state.filteredIds
          )}`}
        >
          <div className="fm-fieldsets">
            <fieldset>
              <legend>Sort</legend>
              <label
                onClick={() => {
                  this.setState({
                    sort: "asc"
                  })
                }}
              >
                <input
                  type="radio"
                  name="sort"
                  checked={this.state.sort === "asc"}
                />
                asc
              </label>
              <label
                onClick={() => {
                  this.setState({
                    sort: "desc"
                  })
                }}
              >
                <input
                  type="radio"
                  name="sort"
                  checked={this.state.sort === "desc"}
                />
                desc
              </label>
            </fieldset>

            <fieldset>
              <legend>Type</legend>
              <label
                onClick={() => {
                  this.setState({
                    type: "grid"
                  })
                }}
              >
                <input
                  type="radio"
                  name="type"
                  checked={this.state.type === "grid"}
                />
                grid
              </label>
              <label
                onClick={() => {
                  this.setState({
                    type: "list"
                  })
                }}
              >
                <input
                  type="radio"
                  name="type"
                  checked={this.state.type === "list"}
                />
                list
              </label>
            </fieldset>

            <fieldset>
              <legend>Stagger config</legend>
              <label
                onClick={() => {
                  this.setState({
                    type: "list"
                  })
                }}
              >
                <input
                  type="radio"
                  name="type"
                  checked={this.state.type === "list"}
                />
                list
              </label>

              <label
                onClick={() => {
                  this.setState({
                    type: "grid"
                  })
                }}
              >
                <input type="checkbox" name="drag" checked={this.state.drag} />
                drag
              </label>
            </fieldset>

            {!!this.state.filteredIds.length && (
              <button
                className="fm-show-all"
                onClick={() => {
                  this.setState({
                    filteredIds: []
                  })
                }}
              >
                show all cards
              </button>
            )}
          </div>

          <Flipped flipId="list">
            <div className={this.state.type === "grid" ? "fm-grid" : "fm-list"}>
              <Flipped inverseFlipId="list">
                <ul className="list-contents">
                  {[...data]
                    .filter(d => !this.state.filteredIds.includes(d.id))
                    .sort((a, b) => {
                      if (this.state.sort === "asc") {
                        return a.id - b.id
                      } else {
                        return b.id - a.id
                      }
                    })
                    .map(({ title, id }, i) => {
                      const flipId = `item-${id}`
                      return (
                        <Flipped
                          flipId={flipId}
                          onAppear={onElementAppear}
                          onExit={
                            this.state.type === "grid" ? onGridExit : onListExit
                          }
                          key={flipId}
                          stagger
                        >
                          <li className="fm-item">
                            <Flipped inverseFlipId={flipId} scale>
                              <div>
                                <div>
                                  <h3>{title}</h3>
                                  <p>{title}</p>
                                </div>

                                <button
                                  className="fm-remove"
                                  onClick={() => {
                                    this.setState(prevState => {
                                      return {
                                        filteredIds: prevState.filteredIds.concat(
                                          id
                                        )
                                      }
                                    })
                                  }}
                                >
                                  &times;
                                </button>
                              </div>
                            </Flipped>
                          </li>
                        </Flipped>
                      )
                    })}
                </ul>
              </Flipped>
            </div>
          </Flipped>
        </Flipper>
      </div>
    )
  }
}

export default ListExample
