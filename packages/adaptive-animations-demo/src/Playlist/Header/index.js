import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Flipped, Swipe } from 'react-flip-toolkit'
import * as Styled from './styled-components'
import * as Core from '../../core-components'
import { Box, Flex } from 'rebass'

const PlaylistHeader = ({ playlist, collapsed, toggleCollapsed }) => {
  const swipeConfig = {
    initFlip: toggleCollapsed,
    cancelFlip: toggleCollapsed
  }
  return (
    <Swipe down={collapsed && swipeConfig} up={!collapsed && swipeConfig}>
      <Styled.HeaderContainer collapsed={collapsed}>
        <Flipped flipId={playlist.id}>
          <Styled.BackgroundImgContainer collapsed={collapsed}>
            <Flipped inverseFlipId={playlist.id}>
              <Flex flexDirection="row" alignItems="center">
                <Flipped flipId={`img-${playlist.id}`}>
                  <Styled.BackgroundImg
                    src={playlist.src}
                    alt=""
                    collapsed={collapsed}
                  />
                </Flipped>
              </Flex>
            </Flipped>
          </Styled.BackgroundImgContainer>
        </Flipped>
        <Styled.MetaContainer collapsed={collapsed}>
          <Box px="1rem" pt="1rem">
            <Styled.Title collapsed={collapsed}>{playlist.title}</Styled.Title>
            <Core.TagList hide={collapsed}>
              {playlist.tags.map((t, i) => {
                return (
                  <Flipped flipId={`${i}-tag`}>
                    <Core.Tag>
                      <Flipped inverseFlipId={`${i}-tag`} scale>
                        <span>{t}</span>
                      </Flipped>
                    </Core.Tag>
                  </Flipped>
                )
              })}
            </Core.TagList>
            <p>{playlist.description}</p>
          </Box>
        </Styled.MetaContainer>
      </Styled.HeaderContainer>
    </Swipe>
  )
}

PlaylistHeader.defaultProps = {}
PlaylistHeader.propTypes = {}

export default PlaylistHeader
