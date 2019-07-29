import React, { useEffect } from 'react'
import BrowsePlaylists from './BrowsePlaylists'
import Playlist from './Playlist'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import { Flipper } from 'react-flip-toolkit'
import { Global, css } from '@emotion/core'
import styled from '@emotion/styled'
import playlists from './playlists'

const Hidden = styled.div`
  display: none;
`

const RouteContainer = styled.div`
  position: relative;
  max-width: 800px;
  margin: auto;
  overflow: hidden;
  height: 100vh;
`

const breakpoint = 768

const globalStyles = css`
  :root {
    --light: #f2f4f6;
    --dark: #242223;
  }

  @import url('https://fonts.googleapis.com/css?family=DM+Sans:400,700&display=swap');
  html {
    font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
      sans-serif;
  }
  body {
    ${'' /* only works in certain browsers */}
    overscroll-behavior: contain;
    line-height: 1.4;
    overflow: hidden;
    @media (min-width: ${breakpoint}px) {
      overflow: visible;
    }
    color: var(--dark);
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  p {
    margin-top: 0;
    margin-bottom: 1rem;
    color: var(--dark);
  }

  p {
    margin-bottom: 0;
  }
`

const FlippedRouteSwitcher = props => {
  return (
    <Flipper
      flipKey={props.location}
      spring="gentle"
      decisionData={props.match}
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
