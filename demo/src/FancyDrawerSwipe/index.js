// inspired by this animated demo:
// https://uxplanet.org/animation-in-ui-design-from-concept-to-reality-85c49907b19d
import React, { useState } from 'react'
import { Flipper, Flipped } from '../../../src/gesture'
import styled from 'styled-components'
import {
  FaEgg,
  FaCookieBite,
  FaBookDead,
  FaGem,
  FaGhost,
  FaRegPaperPlane
} from 'react-icons/fa'

const sections = [
  { icon: <FaEgg />, title: 'A good egg', color: '#733FAB', id: 1 },
  { icon: <FaCookieBite />, title: 'Take a bite', color: '#CB3DAA', id: 2 },
  { icon: <FaBookDead />, title: 'Watch ur back', color: '#FB4987', id: 3 },
  { icon: <FaGem />, title: 'Sparkle', color: '#FF8E36', id: 4 },
  { icon: <FaGhost />, title: 'Spooky', color: '#C0DD42', id: 5 },
  { icon: <FaRegPaperPlane />, title: 'Take a ride', color: '#29A1DC', id: 6 }
]

const StyledContainer = styled.div`
  height: 100vh;
  background: gray;
  position: relative;
  width: 450px;
  margin: 0 auto;
`

const sharedStyles = `
  background-color: white;
  overflow: hidden;
  position: absolute;
  left:0;
  right:0;
  > div {
    padding: 1rem;
  }
   svg {
    fill: white;
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

const sharedDotStyles = `
display: flex;
justify-content: center;
align-items: center;
`

const StyledDot = styled.div`
  height: 1.25rem;
  width: 1.25rem;
  background-color: ${props => props.color};
  border-radius: 100px;
  svg {
    width: 0.75rem;
    height: 0.75rem;
  }
  ${sharedDotStyles}
`

const StyledDotContainer = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(1rem, 1fr));
  width: 50%;
  margin: 0 auto;
`

const ExpandedStyledDot = styled.div`
  height: 5rem;
  width: 5rem;
  svg {
    width: 3rem;
    height: 3rem;
  }
  background-color: ${props => props.color};
  border-radius: 100px;
  margin-bottom: 1rem;
  margin-right: 1rem;
  ${sharedDotStyles}
`

const Flex = styled.div`
  display: flex;
`
const SectionTitle = styled.h3`
  font-size: 1.5rem;
  opacity: ${props => (props.headingsVisible ? 1 : 0)};
  transition: opacity 0.5s;
`

const StyledPage = styled.div`
  background-color: ${props => props.color};
`

const Page = ({ icon, title, color }) => {
  return <StyledPage color={color}>{icon}</StyledPage>
}

const ClosedDrawer = ({ index, color, setDrawerIsOpen, sections }) => {
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
            {sections.map(({ title, color, icon, id }) => {
              return (
                <Flipped flipId={id} key={id}>
                  <StyledDot color={color}>{icon}</StyledDot>
                </Flipped>
              )
            })}
          </StyledDotContainer>
        </Flipped>
      </StyledCollapsedDrawer>
    </Flipped>
  )
}

const OpenDrawer = ({
  index,
  color,
  setDrawerIsOpen,
  setCurrentPage,
  sections
}) => {
  const [headingsVisible, setHeadingsVisible] = useState(true)
  return (
    <Flipped
      flipId="drawer"
      onStart={el => setHeadingsVisible(false)}
      onComplete={el => {
        setHeadingsVisible(true)
      }}
      flipOnSwipe={{
        initFLIP: () => {
          setDrawerIsOpen(false)
        },
        cancelFLIP: () => {
          setDrawerIsOpen(true)
          setHeadingsVisible(true)
        },
        direction: 'down'
      }}
    >
      <StyledExpandedDrawer>
        <Flipped inverseFlipId="drawer">
          <div>
            {sections.map(({ title, color, icon, id }) => {
              return (
                <a
                  key={id}
                  href="#"
                  onClick={e => {
                    e.preventDefault()
                    setCurrentPage(i)
                    setDrawerIsOpen(false)
                  }}
                >
                  <Flex>
                    <Flipped flipId={title} stagger>
                      <ExpandedStyledDot color={color}>
                        {icon}
                      </ExpandedStyledDot>
                    </Flipped>
                    <SectionTitle headingsVisible={headingsVisible}>
                      {title}
                    </SectionTitle>
                  </Flex>
                </a>
              )
            })}
          </div>
        </Flipped>
      </StyledExpandedDrawer>
    </Flipped>
  )
}
export default function Drawer() {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const currentPageData = sections[currentPage]
  return (
    <Flipper flipKey={drawerIsOpen} spring="gentle">
      <StyledContainer>
        <Page {...currentPageData} />
        {drawerIsOpen ? (
          <OpenDrawer
            setDrawerIsOpen={setDrawerIsOpen}
            setCurrentPage={setCurrentPage}
            sections={sections.filter((s, i) => i !== currentPage)}
          />
        ) : (
          <ClosedDrawer
            setDrawerIsOpen={setDrawerIsOpen}
            sections={sections.filter((s, i) => i !== currentPage)}
          />
        )}
      </StyledContainer>
    </Flipper>
  )
}
