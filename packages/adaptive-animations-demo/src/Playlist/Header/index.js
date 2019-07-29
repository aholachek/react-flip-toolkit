import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Flipped, Swipe } from 'react-flip-toolkit'
import * as Styled from './styled-elements'
import * as Core from '../../core-components'

const PlaylistHeader = ({ playlist, collapsed, toggleCollapsed }) => {
  const swipeConfig = {
    initFlip: toggleCollapsed,
    cancelFlip: toggleCollapsed
  }
  return (
    <Styled.HeaderContainer collapsed={collapsed}>
      <Swipe down={collapsed && swipeConfig} up={!collapsed && swipeConfig}>
        <Flipped flipId={playlist.id}>
          <Styled.BackgroundImgContainer collapsed={collapsed}>
            <Flipped inverseFlipId={playlist.id}>
              <div>
                <Flipped flipId={`${playlist.id}-img`}>
                  <Core.PreloadedImg
                    id={`img-${playlist.id}`}
                    alt=""
                  />
                </Flipped>
              </div>
            </Flipped>
          </Styled.BackgroundImgContainer>
        </Flipped>
      </Swipe>
      <Swipe down={collapsed && swipeConfig} up={!collapsed && swipeConfig}>
        <Flipped flipId="meta-container">
          <Styled.MetaContainer collapsed={collapsed}>
            <Styled.Title>{playlist.title}</Styled.Title>
            <Core.TagList>
              {playlist.tags.map((t, i) => {
                return <Core.Tag>{t}</Core.Tag>
              })}
            </Core.TagList>
            <p>{playlist.description}</p>
          </Styled.MetaContainer>
        </Flipped>
      </Swipe>
    </Styled.HeaderContainer>
  )
}

PlaylistHeader.defaultProps = {}
PlaylistHeader.propTypes = {}

export default PlaylistHeader
