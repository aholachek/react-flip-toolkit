import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { Link } from 'react-router-dom'
import { breakpoint } from '../App/styles'

export const Header = styled.header`
  padding-top: 1.5rem;
  font-weight: bold;
  text-align: center;
  @media (min-width: ${breakpoint}px) {
    font-size: 1.5rem;
    text-align: left;

  }
  svg {
    height: 0.8rem;
    position: relative;
    top: -0.1rem;
    margin-right: 0.5rem;
    @media (min-width: ${breakpoint}px) {
      height: 1rem;
  }
`

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  margin: 0 auto 2rem auto;
  padding: 3rem 0 2rem 0;
  position: relative;
  @media (min-width: ${breakpoint}px) {
    overflow: visible;
  }
`

export const Title = styled.h2`
  font-size: 3.25rem;
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

  ${props =>
    props.isCurrentCard
      ? css`
          height: 23rem;
        `
      : css`
          height: 10rem;
        `};
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
    display: none;
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

export const List = styled.ul`
  height: 24rem;
  padding: 0;
  margin: 0;
  list-style: none;
  display: grid;
  grid-gap: 1.25rem;
  grid-template-columns: 10rem 10rem 20rem 10rem 10rem;
  align-items: center;
  transform: translateX(-50%);
  position: absolute;
  left: 50%;

  a {
    box-shadow: ${props =>
      props.swipeInProgress
        ? '0 1px 4px hsla(0, 0%, 0%, 0.1);'
        : '0 10px 20px hsla(0, 0%, 0%, 0.4);'};
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
  }
`

export const Meta = styled.div`
  padding: 1rem;
  z-index: 12;
  width: 100%;
  position: absolute;
  bottom: 0;
  width: 20rem;
  transition: opacity 0.3s;
  opacity: ${props => (props.isCurrentCard ? 1 : 0)};
  backface-visibility: hidden;
  @media (min-width: ${breakpoint}px) {
    opacity: 1;
  }
`
