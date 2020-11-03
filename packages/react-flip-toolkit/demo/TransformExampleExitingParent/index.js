import React, { Component, useState } from 'react'
import { Flipper, Flipped } from "../../src/index"
import './styles.css'

const Square = ({ toggleFullScreen }) => (
  <Flipped flipId="square">
    <div className="square" onClick={toggleFullScreen} />
  </Flipped>
)

const FullScreenSquare = ({ toggleFullScreen }) => (
  <Flipped flipId="square">
    <div className="full-screen-square square" onClick={toggleFullScreen} />
  </Flipped>
)

const AnimatedSquare = () => {
  const [fullScreen, setFullScreen] = useState(false)
  const toggleFullScreen = () => setFullScreen(prevState => !prevState)

  return (
    <Flipper flipKey={fullScreen}>
      {fullScreen ? (
        <Flipped flipId="A" key="b">
          <div className="wrap">
            <FullScreenSquare toggleFullScreen={toggleFullScreen} />
          </div>
        </Flipped>
      ) : (
        <Flipped flipId="B" key="b">
          <div className="wrap">
            <Square toggleFullScreen={toggleFullScreen} />
          </div>
        </Flipped>
      )}
    </Flipper>
  )
}

export default AnimatedSquare
