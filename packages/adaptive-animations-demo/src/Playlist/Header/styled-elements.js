import styled from '@emotion/styled'

export const BackgroundImgContainer = styled.div`
  border-radius: 5%;
  width: calc(100% + 4rem);
  position: relative;
  height: 100%;
  left: -2rem;
  right: -2rem;
  overflow: hidden;
  will-change: transform;
  &::after {
    content: '';
    position: absolute;
    ${props =>
      props.collapsed
        ? ' background-image: linear-gradient(   hsla(0, 0%, 0%, 0),   hsla(0, 0%, 0%, 0.2))'
        : ' background-image: linear-gradient(   hsla(0, 0%, 0%, 0) 40%,   hsla(0, 0%, 0%, 0.7))'};
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  img {
    height: 50rem;
    width: 35rem;
    object-fit: cover;
    z-index: -1;
    will-change: transform;
    position: relative;
    top: ${props => (props.collapsed ? '-21rem' : '-6rem')};
    left: ${props => (props.collapsed ? '0' : '-3rem')};
  }
`

export const HeaderContainer = styled.div`
  height: ${props => (props.collapsed ? '5rem' : '92vh')};
  position: relative;
`

export const Title = styled.h1`
  line-height: 1;
`

export const MetaContainer = styled.div`
  position: absolute;
  padding: 1rem;
  bottom: ${props => (props.collapsed ? '-4rem' : '4rem')};
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
