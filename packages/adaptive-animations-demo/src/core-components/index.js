import React, { useRef, useLayoutEffect } from 'react'
import styled, { css } from '@emotion/styled'

export const TagList = styled.ul`
  margin: 0 0 1rem 0;
  padding: 0;
  display: ${props => (props.hide ? 'none' : 'block')};
`

export const Tag = styled.li`
  list-style-type: none;
  color: white;
  border: 1px solid white;
  border-radius: 100px;
  display: inline-block;
  margin-right: 0.5rem;
  padding: 0.05rem 0.5rem;
  overflow: hidden;
  span {
    display: inline-block;
  }
`

export const ToggleVisibility = styled.div`
  display: ${props => (props.visible ? 'none' : 'block')};
`

export const PreloadedImg = ({ id, ...rest }) => {
  const containerRef = useRef(null)
  useLayoutEffect(() => {
    const el = document.getElementById(id)
    const elCopy = el.cloneNode()
    const elParent = el.parentNode
    Object.keys(rest).forEach(key => {
      el.setAttribute(key, rest[key])
    })
    containerRef.current.appendChild(el)
    elParent.appendChild(elCopy)
  }, [])
  return <div ref={containerRef}></div>
}
