import styled, { css } from 'styled-components'

export const Header = styled.div`
  background: black;
  padding: 1rem;
  color: white;
`

export const Container = styled.div`
  padding-top: 1rem;
  padding-bottom: 1rem;
  height: 24rem;
  width: 100%;
  max-width: 375px;
  margin: 0 auto;
  position: relative;
  /* TODO: figure out why only overflow-y:hidden and not overflow:hidden disables scroll-to-refresh */
  overflow-y: hidden;
  overflow: hidden;
`

export const Card = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 4%;
  box-shadow: 0 4px 10px hsla(0, 0%, 0%, 0.15);

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

export const CurrentCardMeta = styled.div`
  padding: 1rem;
  text-align: center;
  > h2 {
    font-size: 2rem;
  }
`

export const TagList = styled.ul`
  margin: 0;
  padding: 0;
`

export const Tag = styled.li`
  list-style-type: none;
  background-color: ${({ theme }) => theme.colors.gray};
  display: inline-block;
  border-radius: 5rem;
  margin-right: 0.5rem;
  padding: 0.25rem 0.75rem;
`

export const Img = styled.img`
  width: 26rem;
  position: relative;
  top: -4rem;
  left: -4rem;
  background-color: black;
  user-select: none;
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
