import React, { Component } from 'react'
import { Flipper, Flipped } from "../../src/index"
import './index.css'

class MessageItem extends Component {
  state = {
    open: false
  }

  toggleOpen = () => {
    this.setState(s => ({ open: !s.open }))
  }

  render() {
    const { i } = this.props
    const { open } = this.state

    return (
      <div className="message-item">
        <Flipper flipKey={open} className="message-flipper">
          <Flipped flipId={`item-${i}`}>
            <div
              className={`message-item-content ${open ? '_open' : '_closed'}`}
            >
              {open ? (
                <div className="message-item-open" />
              ) : (
                <div className="message-item-closed" />
              )}
              <button onClick={this.toggleOpen}>Toggle</button>
            </div>
          </Flipped>
        </Flipper>
      </div>
    )
  }
}

const OpenMessage = () => {
  return (
    <div className="open-message">
      <MessageItem i={1} />
      <MessageItem i={2} />
      <MessageItem i={3} />
    </div>
  )
}

const ClosedMessage = () => {
  return <div className="closed-message" />
}

class Message extends Component {
  state = {
    open: false
  }

  toggleOpen = () => {
    this.setState(s => ({ open: !s.open }))
  }

  render() {
    const { open } = this.state

    return (
      <Flipper flipKey={open}>
        <button onClick={this.toggleOpen}>Toggle</button>
        <Flipped flipId="message">
          <div className="message">
            {open ? <OpenMessage /> : <ClosedMessage />}
          </div>
        </Flipped>
      </Flipper>
    )
  }
}

export default Message
