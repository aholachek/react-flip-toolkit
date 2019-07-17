import styled, { css } from 'styled-components'

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

export const ToggleVisibility = styled.div`
  display: ${props => (props.visible ? 'none' : 'block')};
`
