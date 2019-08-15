import styled from '@emotion/styled/macro'
import { css, keyframes } from '@emotion/core'
import { Link } from 'react-router-dom'
import { breakpoint } from '../App/styles'

export const Container = styled.div`
  width: 100%;
  min-height: 25.5rem;
  margin: 0 auto 2rem auto;
  padding: 2rem 0;
  position: relative;
  @media (min-width: ${breakpoint}px) {
    overflow: visible;
    padding: 0;
  }
`

export const Title = styled.h2`
  font-size: 3.2rem;
  line-height: 1;
  margin-bottom: 1rem;
  color: white;
  -webkit-font-smoothing: antialiased;
  backface-visibility: hidden;
`

export const Card = styled(Link)`
  display: block;
  user-select: none;
  will-change: transform;
  backface-visibility: hidden;
  position: relative;
  overflow: hidden;
  border-radius: 4%;
  transition: box-shadow 0.5s;
  height: 20rem;
  > div {
    height: 100%;
    pointer-events: none;
  }
  @media (min-width: ${breakpoint}px) {
    display: block !important;
    height: 20rem !important;
  }
`

export const ImgContainer = styled.div`
  width: 35rem;
  height: 50rem;
  background-color: var(--medium);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  will-change: transform;
  backface-visibility: hidden;
  user-select: none;
  z-index: -2;
  img {
    will-change: transform;
    backface-visibility: hidden;
    pointer-events: none;
    user-select: none;
    display: block;
    user-select: none;
    position: relative;
    top: -6rem;
    left: -3rem;
  }
`

const fadeIn = keyframes`
  from {
  opacity: 0;
  } to {
    opacity: 1;
  }
`

const fadeOut = keyframes`
from {
  opacity: 1;
}
  to {
    opacity: 0;
  }
`

export const Meta = styled.div`
  padding: 1rem;
  z-index: 12;
  width: 100%;
  position: absolute;
  bottom: 0;
  width: 20rem;
  transition: opacity 0.2s;
  backface-visibility: hidden;
  display: none;
  @media (min-width: ${breakpoint}px) {
    display: block;
    opacity: 1;
    width: auto;
  }
`

export const List = styled.ul`
  height: 24rem;
  padding: 0;
  margin: 0;
  list-style: none;
  display: grid;
  grid-gap: 1.25rem;
  grid-template-columns: 20rem 20rem 20rem 20rem 20rem;
  align-items: center;
  transform: translateX(-50%);
  position: absolute;
  left: 50%;

  ${Meta} {
    ${props => props.swipeInProgress && 'opacity: 0'};
  }

  ${Card} {
    box-shadow: ${props =>
      props.swipeInProgress
        ? '0 1px 4px hsla(0, 0%, 0%, 0.1);'
        : '0 10px 20px hsla(0, 0%, 0%, 0.4);'};

    &.animate-in {
      animation: ${fadeIn} 0.2s forwards;
    }

    &.animate-out {
      animation: ${fadeOut} 0.2s forwards;
    }
  }

  @media (min-width: ${breakpoint}px) {
    grid-template-columns: repeat(3, 1fr);
    position: relative;
    left: 0;
    transform: none;
    grid-auto-flow: dense;
    height: 100%;
  }
`

export const ListItem = styled.li`
  ${props => (props.order === -1 ? 'display: none;' : `order: ${props.order}`)};
  @media (min-width: ${breakpoint}px) {
    display: block !important;
    order: 1;
  }
`

export const MobileTitle = styled.div`
  display: flex;
  justify-content: center;
  @media (min-width: ${breakpoint}px) {
    display: none;
  }
`
