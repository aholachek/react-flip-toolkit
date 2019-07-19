import styled, { css, keyframes } from 'styled-components'
import { Flipper } from 'react-flip-toolkit'
export * from '../styled-components'

export const MetaContainer = styled.div`
  position: absolute;
  bottom: 1rem;
  width: 100%;
  padding-left: 2rem;
  padding-right: 2rem;
  z-index: 1;
`

export const Title = styled.h1`
  color: white;
  font-size: 3rem;
  max-width: 100vh;
  letter-spacing: 0.1rem;
  line-height: 1;
`
export const BackgroundImg = styled.img`
  width: 30rem;
  height: 50rem;
  top: -2rem;
  left: -2.5rem;
  position: relative;
  z-index: -1;
  object-fit: cover;
`

export const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

export const BackgroundImgContainer = styled.div`
  border-radius: 4%;
  width: calc(100% + 2rem);
  position: relative;
  height: calc(100vh - 5rem);
  left: -1rem;
  right: -1rem;
  overflow: hidden;
`

export const Container = styled.div`
  background-color: #ececec;
  padding: 0.4rem;
  overflow: auto;
  height: 600px;
`

export const Li = styled.li`
  position: relative;
  list-style-type: none;
  height: 10rem;
  margin-bottom: 0.4rem;
  min-height: 5rem;
`

export const actionMixin = props => css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40%;
  position: absolute;
`

export const Favorite = styled.div`
  ${actionMixin};
  left: 0;
`
export const Trash = styled.div`
  ${actionMixin};
  right: 0;
`

export const CollapsedTrackContainer = styled(Flipper)`
  position: relative;
  width: 100%;
  height: 100%;
`

export const CollapsedTrack = styled.div`
  z-index: 1;
  width: 100%;
  height: 100%;
  background-color: white;
  &:not(:last-of-type) {
    margin-bottom: 0.5rem;
  }
  padding: 1rem;
  cursor: pointer;
  display: block;
  position: relative;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  left: ${props =>
    props.isGettingDeleted ? `110%` : props.isGettingStarred ? '-50%' : 0};
`

export const List = styled.ul`
  padding: 0;
  margin: 0;
  transform: ${props => (props.currentlyViewed ? 'scale(.85)' : 'scale(1)')};
`

export const Drawer = styled.div`
  z-index: 2;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 100%;
  background: white;
  cursor: ${({ track }) => (track ? 'grab' : 'pointer')};
  transform: ${({ track }) => (track ? 'translateY(0)' : 'translateY(100%)')};
`

export const DrawerContent = styled.div`
  user-select: none;
  opacity: ${({ article }) => (article ? 1 : 0)};
`
