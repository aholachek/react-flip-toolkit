import React, { Component } from "react"
import { render } from "react-dom"
import "normalize.css"
import CardsExample from "./CardsExample"
import GuitarsExample from "./GuitarsExample"
import SidebarExample from "./SidebarExample"

class Demo extends Component {
  render() {
    if (window.location.pathname === "/cards") return <CardsExample />
    else if (window.location.pathname === "/guitar") return <GuitarsExample />
    else if (window.location.pathname === "/sidebar") return <SidebarExample />
    else
      return (
        <nav>
          <ul>
            <li>
              <a href="/guitar">Guitar example</a>
            </li>
            <li>
              <a href="/cards">Avatar cards example</a>
            </li>
            <li>
              <a href="/sidebar">Sidebar example</a>
            </li>
          </ul>
        </nav>
      )
  }
}

render(<Demo />, document.querySelector("#demo"))
