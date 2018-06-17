import React, { Component } from "react"
import { Flipper } from "../../../src"
import userData from "./userData.json"
import UserGrid from "./UserGrid"
import FocusedUser from "./FocusedUser"

export default class CardsExample extends Component {
  state = { focusedIndex: undefined }
  setFocusedIndex = index => {
    this.setState({
      focusedIndex: index
    })
  }
  componentDidMount() {
    require("./styles.css")
  }
  render() {
    return (
      <Flipper flipKey={this.state.focusedIndex} duration={500}>
        <div className="header">
          <h1>react-flip-toolkit demo</h1>
        </div>
        <UserGrid
          data={userData}
          setFocusedIndex={this.setFocusedIndex}
          focusedIndex={this.state.focusedIndex}
        />
        <FocusedUser
          index={this.state.focusedIndex}
          close={() => {
            this.setState({ focusedIndex: null })
          }}
          data={
            typeof this.state.focusedIndex === "number"
              ? userData[this.state.focusedIndex]
              : null
          }
        />
      </Flipper>
    )
  }
}
