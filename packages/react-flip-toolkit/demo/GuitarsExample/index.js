import React, { Component } from 'react'
import { Flipper } from '../../src'
import GuitarItem from './GuitarItem'
import SelectedGuitar from './SelectedGuitar'
import guitarsData from './guitarsData'
import './css/base.css'
import './pater/pater.css'

import images from './img/*.png'

class GuitarExample extends Component {
  static defaultProps = {}

  static propTypes = {}

  state = {
    focusedGuitarIndex: null
  }
  render() {
    return (
      <Flipper flipKey={this.state.focusedGuitarIndex}>
        <main>
          <div className="content guitar-content">
            <header className="codrops-header">
              <h1 className="codrops-header__title">
                Expanding Grid Item Animation
              </h1>
              <span className="info">
                <a href="https://tympanus.net/Development/ExpandingGridItemAnimation/">
                  Codrop's vanilla JS implementation
                </a>
                &nbsp; rewritten in React with react-flip-toolkit
              </span>
            </header>
          </div>
          <button className="dummy-menu" />
          <div className="content">
            {typeof this.state.focusedGuitarIndex !== 'number' && (
              <div className="grid">
                {guitarsData.map((g, i) => {
                  return (
                    <GuitarItem
                      image={images[i + 1]}
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
            {typeof this.state.focusedGuitarIndex === 'number' && (
              <SelectedGuitar
                image={images[this.state.focusedGuitarIndex + 1]}
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
            <p>
              Guitar vector{' '}
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
