import 'babel-polyfill'

import React, { Component } from 'react'
import { render } from 'react-dom'
import 'normalize.css'
import CardsExample from './CardsExample'
import GuitarsExample from './GuitarsExample'
import SidebarExample from './SidebarExample'
import PhotosExample from './PhotoGridExample'
import ListExample from './ListExample'
import FlipMove from './FlipMove'
import TransformExample from './TransformExample'
import TransformExampleExitingParent from './TransformExampleExitingParent'

import PortalExample from './PortalExample'
import TransformFromZeroExample from './TransformFromZeroExample'
import RotateExample from './RotateExample'
import StaggeredList from './StaggeredList'
import RemountedFlipperExample from './RemountedFlipperExample'
import HandleEnterUpdateDelete from './HandleEnterUpdateDelete'
import NestedFlipper from './NestedFlipper'

import GestureSidebarExample from './GestureSidebarExample'
import GestureStaggeredList from './GestureStaggeredList'
import FancyDrawerSwipe from './FancyDrawerSwipe'
import ZeroJumpExample from './ZeroJumpExample'

class Demo extends Component {
  render() {
    if (window.location.pathname === '/cards') return <CardsExample />
    else if (window.location.pathname === '/guitar') return <GuitarsExample />
    else if (window.location.pathname === '/sidebar') return <SidebarExample />
    else if (window.location.pathname === '/photos') return <PhotosExample />
    else if (window.location.pathname === '/list') return <ListExample />
    else if (window.location.pathname === '/flip-move') return <FlipMove />
    else if (window.location.pathname === '/transform')
      return <TransformExample />
    else if (window.location.pathname === '/transform-exiting-parent')
      return <TransformExampleExitingParent />
    else if (window.location.pathname === '/portal') return <PortalExample />
    else if (window.location.pathname === '/transform-from-zero')
      return <TransformFromZeroExample />
    else if (window.location.pathname === '/rotate') return <RotateExample />
    else if (window.location.pathname === '/staggered-list')
      return <StaggeredList />
    else if (window.location.pathname === '/remounted-flipper')
      return <RemountedFlipperExample />
    else if (window.location.pathname === '/enter-update-delete')
      return <HandleEnterUpdateDelete />
   else if (window.location.pathname === '/zero-jump')
      return <ZeroJumpExample />
    else if (window.location.pathname === '/nested-flipper')
      return <NestedFlipper />
    else
      return (
        <nav>
          <ul>
            <li>
              <a href="/zero-jump">Zero Jump</a>
            </li>
            <li>
              <a href="/staggered-list">Staggered List</a>
            </li>
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
            <li>
              <a href="/transform-exiting-parent">
                Transform with exiting parent
              </a>
            </li>
            <li>
              <a href="/enter-update-delete">Enter update delete</a>
            </li>
            <li>
              <a href="/nested-flipper">Nested Flipper</a>
            </li>
          </ul>
        </nav>
      )
  }
}

render(<Demo />, document.querySelector('#demo'))
