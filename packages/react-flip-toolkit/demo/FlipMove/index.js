import React, { Component } from 'react'
import { Flipper, Flipped } from '../../src'
import Card from './Card'
import './index.css'

const data = [
  { id: 1, title: 'Somebody once told me' },
  { id: 2, title: 'The World was gonna roll me' },
  { id: 3, title: 'I aint the sharpest tool in the shed' },
  {
    id: 4,
    title: 'She was looking kind of dumb'
  },
  {
    id: 5,
    title: 'With her finger and her thumb'
  },
  { id: 6, title: 'In the Shape of an L on her Forehead' },
  { id: 7, title: 'Well the years start coming' }
]

class ListExample extends Component {
  state = {
    type: 'list',
    sort: 'asc',
    filteredIds: [],
    stagger: 'forward',
    spring: 'noWobble'
  }

  addToFilteredIds = id => {
    this.setState(prevState => {
      return {
        filteredIds: prevState.filteredIds.concat(id)
      }
    })
  }

  render() {
    return (
      <div className="fm-example">
        <div className="fm-description">
          <h1>List Animations </h1>
        </div>
        <Flipper
          flipKey={`${this.state.type}-${this.state.sort}-${JSON.stringify(
            this.state.filteredIds
          )}-${JSON.stringify(this.state.stagger)}`}
          spring={this.state.spring}
          staggerConfig={{
            default: {
              reverse: this.state.stagger !== 'forward',
              speed: 1
            }
          }}
          decisionData={this.state}
        >
          <div className="fm-flex-container">
            <fieldset>
              <legend>Sort</legend>
              <label
                onClick={() => {
                  this.setState({
                    sort: 'asc'
                  })
                }}
              >
                <input
                  type="radio"
                  name="sort"
                  checked={this.state.sort === 'asc'}
                />
                asc
              </label>
              <label
                onClick={() => {
                  this.setState({
                    sort: 'desc'
                  })
                }}
              >
                <input
                  type="radio"
                  name="sort"
                  checked={this.state.sort === 'desc'}
                />
                desc
              </label>
            </fieldset>

            <fieldset>
              <legend>Type</legend>
              <label
                onClick={() => {
                  this.setState({
                    type: 'grid'
                  })
                }}
              >
                <input
                  type="radio"
                  name="type"
                  checked={this.state.type === 'grid'}
                />
                grid
              </label>
              <label
                onClick={() => {
                  this.setState({
                    type: 'list'
                  })
                }}
              >
                <input
                  type="radio"
                  name="type"
                  checked={this.state.type === 'list'}
                />
                list
              </label>
            </fieldset>

            <fieldset>
              <legend>Stagger</legend>
              <div className="fm-flex-container">
                {['forward', 'reverse', 'none'].map(type => {
                  return (
                    <label>
                      <input
                        type="radio"
                        name="stagger"
                        checked={this.state.stagger === type}
                        onChange={() => {
                          this.setState({
                            stagger: type,
                            sort: this.state.sort === 'asc' ? 'desc' : 'asc'
                          })
                        }}
                      />
                      {type}
                    </label>
                  )
                })}
              </div>
            </fieldset>
            <fieldset>
              <legend>Spring</legend>
              {['stiff', 'noWobble', 'veryGentle', 'gentle', 'wobbly'].map(
                type => {
                  return (
                    <label>
                      <input
                        type="radio"
                        name="spring"
                        checked={this.state.spring === type}
                        onChange={() => {
                          this.setState({
                            spring: type,
                            sort: this.state.sort === 'asc' ? 'desc' : 'asc'
                          })
                        }}
                      />
                      {type}
                    </label>
                  )
                }
              )}
            </fieldset>
          </div>
          <div>
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
            <div className={this.state.type === 'grid' ? 'fm-grid' : 'fm-list'}>
              <Flipped inverseFlipId="list">
                <ul className="list-contents">
                  {[...data]
                    .filter(d => !this.state.filteredIds.includes(d.id))
                    .sort((a, b) => {
                      if (this.state.sort === 'asc') {
                        return a.id - b.id
                      } else {
                        return b.id - a.id
                      }
                    })
                    .map(({ title, id }) => (
                      <Card
                        id={id}
                        title={title}
                        stagger={['forward', 'reverse'].includes(
                          this.state.stagger
                        )}
                        type={this.state.type}
                        key={id}
                        addToFilteredIds={this.addToFilteredIds}
                      />
                    ))}
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
