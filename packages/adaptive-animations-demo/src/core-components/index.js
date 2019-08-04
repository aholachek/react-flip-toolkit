import React, { useRef, useLayoutEffect } from 'react'
import styled, { css } from '@emotion/styled'
import { breakpoint } from '../App/styles'

export const TagList = styled.ul`
  margin: 0;
  padding: 0;
  display: ${props => (props.hide ? 'none' : 'block')};
  backface-visibility: none;
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

const ImgContainer = styled.div`
  img {
    width: 120vw;
    height: 85vh;
    object-fit: cover;
    @media (min-width: ${breakpoint}px) {
      width: 30rem;
      height: 30rem;
    }
  }
`

const makePreloadedImg = (Container = 'div') => ({ id, ...rest }) => {
  const containerRef = useRef(null)
  useLayoutEffect(() => {
    const el = document.getElementById(id)
    const elParent = el.parentNode
    Object.keys(rest).forEach(key => {
      el.setAttribute(key, rest[key])
    })
    containerRef.current.appendChild(el)
    const elCopy = el.cloneNode()

    elParent.appendChild(elCopy)
  }, [id])
  return <Container ref={containerRef}></Container>
}

export const PreloadedImg = makePreloadedImg(ImgContainer)
