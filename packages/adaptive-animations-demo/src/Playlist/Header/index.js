import React from 'react'
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
      <Styled.BackButton aria-label="back" to={`/playlists/${playlist.id}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          <path d="M0 0h24v24H0z" fill="none" />
        </svg>
      </Styled.BackButton>
      <Swipe down={collapsed && swipeConfig} up={!collapsed && swipeConfig}>
        <Flipped flipId={playlist.id} spring="veryGentle">
          <Styled.BackgroundImgContainer collapsed={collapsed}>
            <Flipped inverseFlipId={playlist.id}>
              <div>
                <Flipped flipId={`${playlist.id}-img`} spring="gentle">
                  <Core.PreloadedImg id={`img-${playlist.id}`} alt="" />
                </Flipped>
              </div>
            </Flipped>
            <Flipped flipId="meta-container">
              <Styled.MetaContainer collapsed={collapsed}>
                <Styled.Title>{playlist.title}</Styled.Title>
                <Core.TagList mb="1rem">
                  {playlist.tags.map((t, i) => {
                    return <Core.Tag>{t}</Core.Tag>
                  })}
                </Core.TagList>
                <p>{playlist.description}</p>
              </Styled.MetaContainer>
            </Flipped>
          </Styled.BackgroundImgContainer>
        </Flipped>
      </Swipe>
      <Styled.DesktopOnly>
        <Styled.Title>{playlist.title}</Styled.Title>
        <Core.TagList dark mb="1rem">
          {playlist.tags.map((t, i) => {
            return <Core.Tag>{t}</Core.Tag>
          })}
        </Core.TagList>
        <p>{playlist.description}</p>
      </Styled.DesktopOnly>
    </Styled.HeaderContainer>
  )
}

PlaylistHeader.defaultProps = {}
PlaylistHeader.propTypes = {}

export default PlaylistHeader
