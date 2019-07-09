import React, { Component } from 'react'
import { Flipper } from '../../src'
import userData from './userData.json'
import UserGrid from './UserGrid'
import FocusedUser from './FocusedUser'
import './styles.css'

export default class CardsExample extends Component {
  state = {
    focusedIndex: undefined,
    speed: 'normal',
    userData: userData
  }
  setFocusedIndex = index => {
    this.setState({
      focusedIndex: index
    })
  }

  render() {
    return (
      <Flipper
        className="cardsExample"
        flipKey={this.state.focusedIndex}
        spring={this.state.speed !== 'normal' && { stiffness: 5, damping: 4 }}
        decisionData={this.state.focusedIndex}
      >
        <div className="header" ref={el => (this.el = el)}>
          <h1>Avatar cards</h1>
          <p>
            An example made somewhat needlessly complicated in order to show off
            some advanced features:
          </p>
          <ul>
            <li>
              The non-active cards move towards their new positions in the grid
              when a card is clicked
            </li>
            <li>There are multiple nested transitions in the card</li>
            <li>
              The card's background opacity is animated in addition to the
              position
            </li>
          </ul>
          <p>Slow the animation down to better follow all the transitions:</p>
          <div>
            <b>Speed:</b>
            <label>
              <input
                type="radio"
                name="speed"
                checked={this.state.speed === 'normal'}
                onClick={() =>
                  this.setState({
                    speed: 'normal'
                  })
                }
              />
              &nbsp;normal
            </label>
            <label>
              <input
                type="radio"
                name="speed"
                checked={this.state.speed === 'slow'}
                onClick={() =>
                  this.setState({
                    speed: 'slow'
                  })
                }
              />
              &nbsp;slow
            </label>
          </div>
        </div>
        <UserGrid
          data={this.state.userData}
          setFocusedIndex={this.setFocusedIndex}
          focusedIndex={this.state.focusedIndex}
        />
        <FocusedUser
          index={this.state.focusedIndex}
          close={() => {
            this.setState({ focusedIndex: null })
          }}
          data={
            typeof this.state.focusedIndex === 'number'
              ? userData[this.state.focusedIndex]
              : null
          }
        />
      </Flipper>
    )
  }
}
