import styled, { css } from 'styled-components'

export const TagList = styled.ul`
  margin: 0 0 1rem 0;
  padding: 0;
  display: ${props => (props.hide ? 'none' : 'block')};
`

export const Tag = styled.li`
  list-style-type: none;
  background-color: ${({ theme }) => theme.colors.medium};
  display: inline-block;
  margin-right: 0.5rem;
  padding: 0.15rem 0.4rem;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
  span {
    display: inline-block;
    -webkit-font-smoothing: antialiased;
  }
`

export const ToggleVisibility = styled.div`
  display: ${props => (props.visible ? 'none' : 'block')};
`
