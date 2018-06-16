import React, { Component } from "react"
import { render } from "react-dom"
import "normalize.css"
import CardsExample from "./CardsExample"
import GuitarsExample from "./GuitarsExample"
import { BrowserRouter as Router, Route, Link } from "react-router-dom"

class Demo extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route
            exact
            path="/"
            component={() => (
              <ul>
                <li>
                  <Link to="/guitar">Basic example</Link>
                </li>
                <li>
                  <Link to="/cards">Complex example</Link>
                </li>
              </ul>
            )}
          />

          <Route path="/cards" component={CardsExample} />
          <Route path="/guitars" component={GuitarsExample} />
        </div>
      </Router>
    )
  }
}

render(<Demo />, document.querySelector("#demo"))
