import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import { Flipper } from 'react-flip-toolkit'
import { Global, css } from '@emotion/core'
import styled from '@emotion/styled'
import BrowsePlaylists from '../BrowsePlaylists'
import Playlist from '../Playlist'
import playlists from '../playlists'
import { globalStyles } from './styles'

const Hidden = styled.div`
  display: none;
`

const RouteContainer = styled.div`
  position: relative;
  max-width: 990px;
  margin: auto;
  min-height: 100vh;
`

export const spring = 'gentle'

const FlippedRouteSwitcher = props => {
  return (
    <Flipper
      flipKey={`${props.location.pathname}-${props.location.search}`}
      decisionData={props.match}
      spring={spring}
      staggerConfig={{
        default: {
          speed: 1,
          direction: 'reverse'
        }
      }}
    >
      <Route path="/playlists/:id" exact component={BrowsePlaylists} />
      <Route path="/playlists/:id/tracks" exact component={Playlist} />
    </Flipper>
  )
}

function Routes(props) {
  useEffect(() => {
    document.body.addEventListener(
      'touchmove',
      function(e) {
        e.preventDefault()
      },
      { passive: false }
    )
    return () => {}
  }, [])

  return (
    <Route
      path="/"
      render={props => {
        return (
          <>
            <Route
              path="/"
              exact
              render={() => <Redirect to="/playlists/1" />}
            />

            <Route
              path="/playlists/:id/:tracks?"
              component={FlippedRouteSwitcher}
            />
          </>
        )
      }}
    />
  )
}

function App() {
  return (
    <>
      <Global styles={globalStyles} />
      <RouteContainer>
        <Router>
          <Routes />
        </Router>
      </RouteContainer>
      <Hidden>
        {playlists.map(({ src, id }) => {
          return <img src={src} id={`img-${id}`} alt="" />
        })}
      </Hidden>
    </>
  )
}

export default App
