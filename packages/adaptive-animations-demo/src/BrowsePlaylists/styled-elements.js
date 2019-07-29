import styled from '@emotion/styled'
import { css } from '@emotion/core'

export const Header = styled.header`
  padding: 1rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;
  svg {
    height: 0.8rem;
    position: relative;
    top: -0.1rem;
    margin-right: 0.5rem;
  }
`

export const Container = styled.div`
  height: 32rem;
  padding-top: 2rem;
  width: 100%;
  margin: 0 auto 0 auto;
  position: relative;
  overflow: hidden;
`

export const Title = styled.h2`
  font-size: 2.25rem;
  text-align: center;
  line-height: 1.2;
  margin-bottom: 0.5rem;
  color: white;
  -webkit-font-smoothing: antialiased;
`

export const Card = styled.div`
  will-change: transform;
  position: relative;
  /* overflow: hidden; */
  border-radius: 2%;
  transition: box-shadow 0.25s;
  box-shadow: ${props =>
    props.swipeInProgressOnThisCard
      ? '0 2px 6px hsla(0, 0%, 0%, 0.2)'
      : '0 12px 25px hsla(0, 0%, 0%, 0.4)'};

  ${props =>
    props.isCurrentCard
      ? css`
          height: 23rem;
          width: 100%;
        `
      : css`
          height: 10rem;
          width: 100%;
        `};
  &::after {
    content: '';
    position: absolute;
    background-image: linear-gradient(
      hsla(0, 0%, 0%, 0) 30%,
      hsla(0, 0%, 0%, 0.5)
    );
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
`

export const ImgContainer = styled.div`
  width: 35rem;
  height: 50rem;
  background-color: var(--medium);
  position: relative;
  will-change: transform;
  img {
    will-change: transform;
    height: 100%;
    width: 100%;
    display: block;
    user-select: none;
    position: relative;
    object-fit: cover;
    top: -6rem;
    left: -3rem;
  }
`

export const List = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: 10rem 10rem 20rem 10rem 10rem;
  align-items: center;
  transform: translateX(-50%);
  position: absolute;
  left: 50%;
`

export const PlayButton = styled.button`
  border: 0;
  box-shadow: none;
  appearance: none;
  border-radius: 100%;
  height: 3.5rem;
  width: 3.5rem;
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: var(--medium);
  img {
    width: 100%;
  }
`

export const Meta = styled.div`
  margin-top: 1rem;
  text-align: center;
  position: absolute;
  bottom: 0;
  z-index: 1;
  left: 50%;
  width: 100%;
  /* opacity: ${props => (props.isCurrentCard ? 1 : 0)}; */
   transform: ${props =>
    props.isCurrentCard ? 'translateX(-50%)' : 'translateX(-50%)'};
`
