// inspired by this animated demo:
// https://uxplanet.org/animation-in-ui-design-from-concept-to-reality-85c49907b19d
import React, { useState } from 'react'
import { Flipper, Flipped } from '../../../src/gesture'
import styled from 'styled-components'

const StyledBackground = styled.div`
  height: 100vh;
  background: gray;
  position: relative;
  width: 620px;
  margin: 0 auto;
`
const colors = ['#ff4f66', '#7971ea', '#5900d8']

const sharedStyles = `
  background-color: white;
  position: absolute;
  left:0;
  right:0;
  > div {
    padding: 1rem;
  }
`

const StyledExpandedDrawer = styled.div`
  ${sharedStyles}
  top: 0;
  bottom: 0;
`

const StyledCollapsedDrawer = styled.div`
  ${sharedStyles}
  bottom: -2rem;
  padding-bottom: 2rem;
`

const StyledDot = styled.div`
  height: 1rem;
  width: 1rem;
  background-color: #ff4f66;
  border-radius: 100px;
`

const StyledDotContainer = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  width: 10rem;
`

const ExpandedStyledDot = styled.div`
  height: 10rem;
  width: 10rem;
  background-color: #ff4f66;
  border-radius: 100px;
  margin-bottom: 1rem;
`

const ClosedDrawer = ({ index, color, setDrawerIsOpen }) => {
  return (
    <Flipped
      flipId="drawer"
      flipOnSwipe={[
        {
          initFLIP: () => {
            setDrawerIsOpen(true)
          },
          cancelFLIP: () => {
            setDrawerIsOpen(false)
          },
          direction: 'up'
        }
      ]}
    >
      <StyledCollapsedDrawer>
        <Flipped inverseFlipId="drawer">
          <StyledDotContainer>
            <Flipped flipId={`dot-1`} stagger>
              <StyledDot />
            </Flipped>
            <Flipped flipId={`dot-2`} stagger>
              <StyledDot />
            </Flipped>
            <Flipped flipId={`dot-3`} stagger>
              <StyledDot />
            </Flipped>
          </StyledDotContainer>
        </Flipped>
      </StyledCollapsedDrawer>
    </Flipped>
  )
}

const OpenDrawer = ({ index, color, setDrawerIsOpen }) => {
  return (
    <Flipped
      flipId="drawer"
      onComplete={el => {
        el.classList.add('animated-in')
      }}
      flipOnSwipe={{
        initFLIP: () => {
          setDrawerIsOpen(false)
        },
        cancelFLIP: () => {
          setDrawerIsOpen(true)
        },
        direction: 'down'
      }}
    >
      <StyledExpandedDrawer>
        <Flipped inverseFlipId="drawer">
          <div>
            <Flipped flipId={`dot-1`} stagger>
              <ExpandedStyledDot />
            </Flipped>
            <Flipped flipId={`dot-2`} stagger>
              <ExpandedStyledDot />
            </Flipped>
            <Flipped flipId={`dot-3`} stagger>
              <ExpandedStyledDot />
            </Flipped>
          </div>
        </Flipped>
      </StyledExpandedDrawer>
    </Flipped>
  )
}
export default function Drawer() {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false)
  return (
    <Flipper flipKey={drawerIsOpen} spring="gentle">
      <StyledBackground>
        {drawerIsOpen ? (
          <OpenDrawer setDrawerIsOpen={setDrawerIsOpen} />
        ) : (
          <ClosedDrawer setDrawerIsOpen={setDrawerIsOpen} />
        )}
      </StyledBackground>
    </Flipper>
  )
}
