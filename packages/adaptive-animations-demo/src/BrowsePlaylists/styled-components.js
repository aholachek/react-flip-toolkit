import styled, { css } from 'styled-components'

export const Header = styled.header`
  padding: 1rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
  svg {
    height: 0.8rem;
    position: relative;
    top: -0.1rem;
    margin-right: 0.5rem;
  }
`

export const Container = styled.div`
  padding-bottom: 1rem;
  height: 25rem;
  width: 100%;
  max-width: 375px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
`

export const Title = styled.h2`
  font-size: 2.6rem;
  text-align: center;
  line-height: 1;
  margin-bottom: 1.5rem;
`

export const Card = styled.div`
  will-change: transform;
  position: relative;
  overflow: hidden;
  border-radius: 5%;

  ${props =>
    props.isCurrentCard
      ? css`
          height: 22rem;
          width: 100%;
        `
      : css`
          height: 14rem;
          width: 100%;
        `};
`

export const Img = styled.img`
  width: 30rem;
  height: 50rem;
  position: relative;
  display: block;
  top: -5rem;
  left: -5rem;
  user-select: none;
  object-fit: cover;
  will-change: transform;
`

export const List = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: 10rem 10rem 18rem 10rem 10rem;
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

  background-color: ${({ theme }) => theme.colors.medium};
  img {
    width: 100%;
  }
`

export const Meta = styled.div`
  margin-top: 1rem;
  text-align: center;
`
