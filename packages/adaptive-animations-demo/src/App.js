import React from 'react'
import BrowsePlaylists from './BrowsePlaylists'
import Playlist from './Playlist'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom'
import { Flipper } from 'react-flip-toolkit'
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'

const ToggleVisible = styled.div`
  display: ${props => (props.visible ? 'block' : 'none')};
`

const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css?family=DM+Sans:400,700&display=swap');
html {
  font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
body {
  ${'' /* only works in certain browsers */}
  overscroll-behavior: contain;
}

h1,h2,h3,h4,h5{
  margin-top: 0;
  margin-bottom: 1rem;
}

`

const theme = {
  colors: {
    gray: '#dedede'
  }
}

function Routes(props) {
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
              render={props => {
                const showTracks = props.match.params.tracks === 'tracks'
                return (
                  <Flipper flipKey={props.location} decisionData={props.match}>
                    <ToggleVisible visible={!showTracks}>
                      <BrowsePlaylists {...props} />
                    </ToggleVisible>
                    <ToggleVisible visible={showTracks}>
                      <Playlist {...props} />
                    </ToggleVisible>
                  </Flipper>
                )
              }}
            />
          </>
        )
      }}
    />
  )
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <>
        <GlobalStyle />
        <div
          style={{
            maxWidth: '25rem',
            margin: 'auto',
            overflow: 'hidden',
            height: '100vh'
          }}
        >
          <Router>
            <Routes />
          </Router>
        </div>
      </>
    </ThemeProvider>
  )
}

export default App
