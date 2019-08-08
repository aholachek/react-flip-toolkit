// inspired by this animated demo:
// https://uxplanet.org/animation-in-ui-design-from-concept-to-reality-85c49907b19d
import React, { useState } from 'react'
import { Flipper, Flipped } from '../../src'
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
  { icon: <FaRegPaperPlane />, title: 'Take a ride', color: '#29A1DC', id: 6 },
  { icon: <FaEgg />, title: 'A good egg', color: '#733FAB', id: 7 },
  { icon: <FaCookieBite />, title: 'Take a bite', color: '#CB3DAA', id: 8 },
  { icon: <FaBookDead />, title: 'Watch ur back', color: '#FB4987', id: 9 },
  { icon: <FaGem />, title: 'Sparkle', color: '#FF8E36', id: 10 },
  { icon: <FaGhost />, title: 'Spooky', color: '#C0DD42', id: 11 },
  { icon: <FaRegPaperPlane />, title: 'Take a ride', color: '#29A1DC', id: 12 }
]

const StyledContainer = styled.div`
  height: 80vh;
  background: gray;
  position: relative;
  width: 450px;
  margin: 1rem auto;
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
  height: 0.75rem;
  width: 0.75rem;
  background-color: ${props => props.color};
  border-radius: 100px;
  svg {
    width: 0.1rem;
    height: 0.1rem;
  }
  ${sharedDotStyles}
`

const StyledDotContainer = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fit, 0.8rem);
  margin: 0 auto;
`

const ExpandedStyledDot = styled.div`
  height: 4rem;
  width: 4rem;
  svg {
    width: 2rem;
    height: 2rem;
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
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 2rem;
`

const Page = ({ icon, title, color, id }) => {
  return (
    <StyledPage color={color}>
      <Flipped flipId={id} key={id}>
        {icon}
      </Flipped>
    </StyledPage>
  )
}

const ClosedDrawer = ({ index, color, setDrawerIsOpen, sections }) => {
  return (
    <Flipped
      flipId="drawer"
      onSwipe={[
        {
          initFlip: () => {
            setDrawerIsOpen(true)
          },
          cancelFlip: () => {
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
      onSwipe={{
        initFlip: () => {
          setDrawerIsOpen(false)
        },
        cancelFlip: () => {
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
                    setCurrentPage(id)
                    setDrawerIsOpen(false)
                  }}
                >
                  <Flex>
                    <Flipped flipId={id}>
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
  const [currentPage, setCurrentPage] = useState(sections[0].id)
  const currentPageData = sections.find(s => s.id === currentPage)
  return (
    <Flipper flipKey={drawerIsOpen} spring="gentle">
      <StyledContainer>
        <Page {...currentPageData} />
        {drawerIsOpen ? (
          <OpenDrawer
            setDrawerIsOpen={setDrawerIsOpen}
            setCurrentPage={setCurrentPage}
            sections={sections.filter(s => s.id !== currentPage)}
          />
        ) : (
          <ClosedDrawer
            setDrawerIsOpen={setDrawerIsOpen}
            sections={sections.filter(s => s.id !== currentPage)}
          />
        )}
      </StyledContainer>
    </Flipper>
  )
}
