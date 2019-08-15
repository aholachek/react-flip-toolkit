import styled from '@emotion/styled/macro'
import { breakpoint } from '../../App/styles'
import { Link } from 'react-router-dom'

export const BackgroundImgContainer = styled.div`
  border-radius: 5%;
  width: calc(100% + 5rem);
  position: relative;
  height: 100%;
  left: -2rem;
  right: -2rem;
  overflow: hidden;
  will-change: transform;
  z-index: 10;
  > div:first-of-type {
    height: 100%;
    >div: first-of-type {
      height: 100%;
    }
  }

  @media (min-width: ${breakpoint}px) {
    width: 20rem;
    flex: 0 0 15rem;
    height: 15rem;
    box-shadow: 0 10px 20px hsla(0, 0%, 0%, 0.4);
  }

  img {
    position: absolute;
    z-index: -1;
    will-change: transform;
    @media (min-width: ${breakpoint}px) {
      top: -6rem;
      left: -9rem;
    }
  }
`

export const HeaderContainer = styled.div`
  height: ${props => (props.collapsed ? '5rem' : '86vh')};
  /* weird but taking img outside this conditional breaks it */
    ${props =>
      props.collapsed &&
      `img {
      top: -12rem;
    }`};
  }
  position: relative;

  @media (min-width: ${breakpoint}px) {
    padding: 2rem 0;
    display: flex;
    height: auto;
    align-items: center;

    img {
      top: -6rem !important;
    }
  }
`

export const Title = styled.h1`
  font-size: 2.75rem;
  @media (min-width: ${breakpoint}px) {
    font-size: 3rem;
  }
  line-height: 1;
`

export const MetaContainer = styled.div`
  opacity: ${props => (props.display ? 1 : 0)};
  position: absolute;
  left: 0;
  right: 0;
  padding-left: 3rem;
  padding-right: 3rem;
  transition: ${props => (props.display ? 'opacity 0.25s;' : '')};
  bottom: ${props => (props.collapsed ? '-4rem' : '4rem')};
  height: 10rem;
  > div {
    padding: 1rem;
  }
  h1,
  p {
    color: white;
  }

  @media (min-width: ${breakpoint}px) {
    display: none;
  }
`

export const DesktopOnly = styled.div`
  display: none;
  @media (min-width: ${breakpoint}px) {
    display: block;
  }
`

export const BackButton = styled(Link)`
  appearance: none;
  border: 0;
  background: transparent;
  position: absolute;
  top: 1rem;
  left: 1rem;
  color: white;
  z-index: 15;
  svg {
    height: 2.5rem;
    width: 2.5rem;
  }
  @media (min-width: ${breakpoint}px) {
    display: none;
  }
`
