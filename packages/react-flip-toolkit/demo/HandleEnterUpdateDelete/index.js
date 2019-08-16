import React, { Component } from 'react'
import { Flipper, Flipped, ExitContainer, spring } from '../../src'
import getRandomList from './getRandomList'
import './styles.css'

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
  state = {
    list: getRandomList(),
    transitionType: 'exitThenFlipThenEnter',
    exitContainer: false
  }
  updateList = () => {
    this.setState({ list: getRandomList() })
  }
  currentAnimations = []
  onAppear = (el, i) => {
    this.currentAnimations.push(
      spring({
        onUpdate: value => {
          el.style.opacity = value
        },
        delay: i * 20
      })
    )
  }
  onExit = (el, i, onComplete) => {
    el.style.color = 'red'
    this.currentAnimations.push(
      spring({

        onUpdate: value => {
          el.style.opacity = 1-value
        },
        delay: i * 20,
        onComplete
      })
    )
  }
  render() {
    const flippedStuff = (
      <div>
        {this.state.list.map(d => (
          //break transitions by having a parent that is also removed
          // to demo ExitContainer use case
          <div key={d}>
            <Flipped
              flipId={d.toString()}
              onAppear={this.onAppear}
              onExit={this.onExit}
              onSpringUpdate={springValue => console.log(springValue)}
            >
              <li>{d}</li>
            </Flipped>
          </div>
        ))}
      </div>
    )

    return (
      <div className="enter-update-delete-container">
        <label>
          <input
            type="checkbox"
            checked={this.state.exitContainer}
            name="exit-container"
            onChange={ev =>
              this.setState({
                exitContainer: ev.target.checked
              })
            }
          />
          with exit container
        </label>
        <div>
          {Object.keys(transitions).map(transition => {
            return (
              <label className="enterUpdateDeleteLabel">
                <input
                  type="radio"
                  name="transition"
                  value={transition}
                  checked={transition === this.state.transitionType}
                  onChange={ev => {
                    this.setState({ transitionType: ev.currentTarget.value })
                    this.updateList()
                  }}
                />
                {transition}
              </label>
            )
          })}
        </div>
        <Flipper
          onComplete={flipIds =>
            console.log('complete', flipIds)
          }
          flipKey={this.state.list.join('')}
          element="ul"
          className="enter-update-delete-list"
          handleEnterUpdateDelete={callbacks => {
            this.currentAnimations.forEach(spring => spring.destroy())
            this.currentAnimations = []
            transitions[this.state.transitionType](callbacks)
          }}
        >
          {this.state.exitContainer ? (
            <ExitContainer>{flippedStuff}</ExitContainer>
          ) : (
            flippedStuff
          )}
        </Flipper>
      </div>
    )
  }
}

export default EnterUpdateDeleteDemo
