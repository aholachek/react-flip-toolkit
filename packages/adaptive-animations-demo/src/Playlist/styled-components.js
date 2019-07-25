import styled, { css, keyframes } from 'styled-components'
import { Flipper } from 'react-flip-toolkit'

export const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

export const Container = styled.div`
  padding: 1rem;
  overflow: auto;
  background-color: ${({ theme }) => theme.colors.light};
  z-index: 1;
  position: relative;
`

export const Li = styled.li`
  position: relative;
  list-style-type: none;
  margin-bottom: 1rem;
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
  display: flex;
  align-items: center;
  border-radius: 8px;
  box-shadow: 0 2px 0 ${({ theme }) => theme.colors.medium};
  z-index: 1;
  width: 100%;
  height: 100%;
  background-color: white;
  &:not(:last-of-type) {
    margin-bottom: 0.5rem;
  }
  padding: 1rem;
  cursor: pointer;
  position: relative;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  left: ${props =>
    props.isGettingDeleted ? `110%` : props.isGettingStarred ? '-50%' : 0};
  h3 {
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }
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

export const PlayButton = styled.button`
  height: 2rem;
  width: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 2rem;
  box-shadow: none;
  appearance: none;
  border: none;
  margin-right: 1rem;
  background-color: ${({ theme }) => theme.colors.light};
  border: 2px solid ${({ theme }) => theme.colors.dark};
`
