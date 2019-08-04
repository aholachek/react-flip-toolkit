import styled from '@emotion/styled'
import { breakpoint } from '../../App/styles'

export const BackgroundImgContainer = styled.div`
  border-radius: 5%;
  width: calc(100% + 4rem);
  position: relative;
  height: 100%;
  left: -2rem;
  right: -2rem;
  overflow: hidden;
  will-change: transform;

  @media (min-width: ${breakpoint}px) {
    width: 20rem;
  }

  img {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    will-change: transform;
  }
`

export const HeaderContainer = styled.div`
  height: ${props => (props.collapsed ? '5rem' : '92vh')};
  position: relative;
`

export const Title = styled.h1`
  font-size: 2.75rem;
  line-height: 1;
`

export const MetaContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  padding-left: 3rem;
  padding-right: 3rem;
  bottom: ${props => (props.collapsed ? '-4rem' : '6rem')};
  opacity: ${props => (props.collapsed ? 0 : 1)};
  height: 10rem;
  > div {
    padding: 1rem;
  }
  h1,
  p {
    color: white;
  }
`
