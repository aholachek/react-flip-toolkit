import React, { Component } from "react"
import { Flipper, Flipped } from "../../../src"
import anime from "animejs"
import getRandomList from "./getRandomList"
import styles from "./styles.css"

const simultaneousAnimations = ({
  hideEnteringElements,
  animateEnteringElements,
  animateExitingElements,
  animateFlippedElements
}) => {
  hideEnteringElements()
  animateExitingElements()
  animateFlippedElements()
  animateEnteringElements()
}

const exitThenFlipThenEnter = ({
  hideEnteringElements,
  animateEnteringElements,
  animateExitingElements,
  animateFlippedElements
}) => {
  hideEnteringElements()
  animateExitingElements()
    .then(animateFlippedElements)
    .then(animateEnteringElements)
}

const exitAndFlipThenEnter = ({
  hideEnteringElements,
  animateEnteringElements,
  animateExitingElements,
  animateFlippedElements
}) => {
  hideEnteringElements()
  Promise.all([animateExitingElements(), animateFlippedElements()]).then(
    animateEnteringElements
  )
}

const transitions = {
  simultaneousAnimations,
  exitThenFlipThenEnter,
  exitAndFlipThenEnter
}

class EnterUpdateDeleteDemo extends Component {
  state = { list: getRandomList(), transitionType: "exitThenFlipThenEnter" }
  updateList = () => {
    this.setState({ list: getRandomList() })
  }
  onAppear = (el, i) => {
    anime({
      targets: el,
      opacity: 1,
      delay: i * 20,
      easing: "easeOutSine"
    })
  }
  onExit = (el, i, onComplete) => {
    anime({
      targets: el,
      opacity: 0,
      delay: i * 20,
      easing: "easeOutSine",
      complete: onComplete
    })
  }
  render() {
    return (
      <div className="enter-update-delete-container">
        <button onClick={this.updateList}> generate new list</button>
        <div>
          {Object.keys(transitions).map(transition => {
            return (
              <label className="enterUpdateDeleteLabel">
                <input
                  type="radio"
                  name="transition"
                  value={transition}
                  checked={transition === this.state.transitionType}
                  onChange={ev =>
                    this.setState({ transitionType: ev.currentTarget.value })
                  }
                />
                {transition}
              </label>
            )
          })}
        </div>
        <Flipper
          flipKey={this.state.list.join("")}
          element="ul"
          className="enter-update-delete-list"
          handleEnterUpdateDelete={transitions[this.state.transitionType]}
        >
          {this.state.list.map(d => (
            <Flipped
              key={d}
              flipId={d.toString()}
              onAppear={this.onAppear}
              onExit={this.onExit}
            >
              <li>{d}</li>
            </Flipped>
          ))}
        </Flipper>
      </div>
    )
  }
}

export default EnterUpdateDeleteDemo
