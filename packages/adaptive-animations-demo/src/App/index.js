import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import { Flipper } from 'react-flip-toolkit'
import { Global, css } from '@emotion/core'
import styled from '@emotion/styled/macro'
import BrowsePlaylists from '../BrowsePlaylists'
import Playlist from '../Playlist'
import playlists from '../playlists'
import { globalStyles, breakpoint } from './styles'
import { usePrevious } from '../utilities'

const Hidden = styled.div`
  display: none;
`

const RouteContainer = styled.div`
  position: relative;
  max-width: 1100px;
  margin: auto;
  overflow: hidden;
  @media (min-width: ${breakpoint}px) {
    overflow: visible;
  }
`

const FlippedRouteSwitcher = props => {
  const previousPath = usePrevious(props.location.pathname)
  const previousSearch = usePrevious(props.location.search)
  return (
    <Flipper
      flipKey={`${props.location.pathname}-${props.location.search}`}
      decisionData={props.match}
      staggerConfig={{
        default: {
          speed: 1
        }
      }}
    >
      <Route
        path="/playlists/:id"
        exact
        render={props => {
          return (
            <BrowsePlaylists
              {...props}
              previousPath={previousPath}
              previousSearch={previousSearch}
            />
          )
        }}
      />
      <Route
        path="/playlists/:id/tracks"
        exact
        render={props => {
          return (
            <Playlist
              {...props}
              previousPath={previousPath}
              previousSearch={previousSearch}
            />
          )
        }}
      />
    </Flipper>
  )
}

function Routes(props) {
  useEffect(() => {
    const preventDefault = function(e) {
      e.preventDefault()
    }
    document.body.addEventListener('touchmove', preventDefault, {
      passive: false
    })
    return () => {
      document.body.removeEventListener('touchmove', preventDefault, {
        passive: false
      })
    }
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
