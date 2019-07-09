import React from 'react'
import BrowsePlaylists from './BrowsePlaylists'
import Playlist from './Playlist'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom'

function App() {
  return (
    <Router>
      <Route exact path="/" render={() => <Redirect to="/browse" />} />
      <Route path="/browse" exact component={BrowsePlaylists} />
      <Route path="/playlists/:id" component={Playlist} />
    </Router>
  )
}

export default App
