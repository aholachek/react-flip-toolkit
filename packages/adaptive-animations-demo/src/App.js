import React, { useEffect } from 'react'
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

const breakpoint = 768

const theme = {
  colors: {
    light: '#f2f4f6',
    medium: '#e0e4ea',
    dark: '#0d3f67'
  }
}

const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css?family=DM+Sans:400,700&display=swap');
html {
  font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
body {
  ${'' /* only works in certain browsers */}
  overscroll-behavior: contain;
  line-height: 1.4;
  overflow: hidden;
  @media(min-width: ${breakpoint}px){
    overflow: visible;
  }
  background-color: ${({ theme }) => theme.colors.light};
  color: ${props => props.theme.colors.dark};
}

h1,h2,h3,h4,h5,p{
  margin-top: 0;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.dark};
}

 p{
   margin-bottom: 0;
 }

`

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
