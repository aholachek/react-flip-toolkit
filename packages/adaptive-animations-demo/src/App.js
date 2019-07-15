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
import { createGlobalStyle, ThemeProvider } from 'styled-components'

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
}

`

const theme = {
  colors: {
    gray: '#dedede'
  }
}

function Routes() {
  return (
    <Route
      path="/"
      render={props => {
        return (
          <Flipper flipKey={props.location.pathname}>
            <Route exact path="/" render={() => <Redirect to="/browse" />} />
            <Route path="/browse" exact component={BrowsePlaylists} />
            <Route path="/playlists/:id" component={Playlist} />
          </Flipper>
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
        <Router>
          <Routes />
        </Router>
      </>
    </ThemeProvider>
  )
}

export default App
