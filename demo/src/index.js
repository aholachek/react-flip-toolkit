import React, { Component } from "react"
import { render } from "react-dom"
import "normalize.css"
import CardsExample from "./CardsExample"
import GuitarsExample from "./GuitarsExample"
import SidebarExample from "./SidebarExample"
import PhotosExample from "./PhotoGridExample"
import ListExample from "./ListExample"
import FlipMove from "./FlipMove"
import TransformExample from "./TransformExample"
import PortalExample from "./PortalExample"
import TransformFromZeroExample from "./TransformFromZeroExample"

class Demo extends Component {
  render() {
    if (window.location.pathname === "/cards") return <CardsExample />
    else if (window.location.pathname === "/guitar") return <GuitarsExample />
    else if (window.location.pathname === "/sidebar") return <SidebarExample />
    else if (window.location.pathname === "/photos") return <PhotosExample />
    else if (window.location.pathname === "/list") return <ListExample />
    else if (window.location.pathname === "/flip-move") return <FlipMove />
    else if (window.location.pathname === "/transform")
      return <TransformExample />
    else if (window.location.pathname === "/portal") return <PortalExample />
    else if (window.location.pathname === "/transform-from-zero")
      return <TransformFromZeroExample />
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
            <li>
              <a href="/photos">Photo Grid example</a>
            </li>
            <li>
              <a href="/list">List example</a>
            </li>
            <li>
              <a href="/flip-move">Flip Move</a>
            </li>
            <li>
              <a href="/transform">Pre-existing transform</a>
            </li>
            <li>
              <a href="/portal">Portal</a>
            </li>
            <li>
              <a href="/transform-from-zero">Transform from Zero</a>
            </li>
          </ul>
        </nav>
      )
  }
}

render(<Demo />, document.querySelector("#demo"))
