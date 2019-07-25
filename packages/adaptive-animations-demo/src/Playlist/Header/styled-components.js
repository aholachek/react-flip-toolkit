import styled from 'styled-components'

export const BackgroundImgContainer = styled.div`
  border-radius: 5%;
  width: calc(100% + 2rem);
  position: relative;
  height: ${props => (props.collapsed ? '100%' : 'calc(100vh - 15rem)')};
  left: -1rem
  right: -1rem
  overflow: hidden;
  > div {
    height: 100%;
  }
`

export const HeaderContainer = styled.div`
  height: ${props => (props.collapsed ? '4rem' : 'auto')};
`

export const Title = styled.h1`
  letter-spacing: ${props => (props.collapsed ? '' : '0.1rem')};
  line-height: 1;
  font-size: ${props => (props.collapsed ? '1.25rem' : '2rem')};
`
export const BackgroundImg = styled.img`
  height: ${props => (props.collapsed ? '60rem' : '50rem')};
  width: ${props => (props.collapsed ? '36rem' : '30rem')};
  z-index: -1;
  object-fit: cover;
`

export const MetaContainer = styled.div`
  position: relative;
  top: ${props => (props.collapsed ? '-100%' : 0)};
  opacity: ${props => (props.collapsed ? 0 : 1)};
`
