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

import GestureSidebarExample from './GestureSidebarExample'
import GestureStaggeredList from './GestureStaggeredList'
import FancyDrawerSwipe from './FancyDrawerSwipe'
import GestureCardSwipe from './GestureCardSwipe'
import GestureArticleSwipe from './GestureArticleSwipe'
// import GestureSidebarRight from './GestureSidebarRightExample'

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
    else if (window.location.pathname === '/gesture-staggered-list')
      return <GestureStaggeredList />
    else if (window.location.pathname === '/gesture-sidebar')
      return <GestureSidebarExample />
    else if (window.location.pathname === '/gesture-email-swipe')
      return <FancyDrawerSwipe />
    else if (window.location.pathname === '/gesture-card-swipe')
      return <GestureCardSwipe />
    else if (window.location.pathname === '/gesture-article-swipe')
      return <GestureArticleSwipe />
    else if (window.location.pathname === '/gesture-sidebar-right')
      // return <GestureSidebarRight />
      return <GestureArticleSwipe />
    else
      return (
        <nav>
          <ul>
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
          </ul>

          <h3>Gesture</h3>
          <ul>
            <li>
              <a href="/gesture-sidebar">Sidebar</a>
            </li>
            <li>
              <a href="/gesture-staggered-list">Staggered List</a>
            </li>
            <li>
              <a href="/gesture-article-swipe">Gesture Article Swipe </a>
            </li>
            <li>
              <a href="/gesture-email-swipe">Gesture Email Swipe</a>
            </li>
            <li>
              <a href="/gesture-card-swipe">Gesture Card Swipe</a>
            </li>
            <li>
              <a href="/gesture-sidebar-right">Gesture Sidebar Right</a>
            </li>
          </ul>
        </nav>
      )
  }
}

render(<Demo />, document.querySelector('#demo'))
