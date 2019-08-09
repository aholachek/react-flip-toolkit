import React, { useState } from 'react'
import { Flipper, Flipped } from 'react-flip-toolkit'
import Swipe from 'react-flip-toolkit/lib/Swipe'
import playlists from '../playlists'
import * as Styled from './styled-elements'
import PlaylistHeader from './Header'
import trashIcon from '../assets/trashIcon.svg'
import playIcon from '../assets/playIcon.svg'
import pauseIcon from '../assets/pauseIcon.svg'
import { callOnDesktop } from '../utilities'
import * as Core from '../core-components'

const ListItem = ({
  setIsPlaying,
  isPlaying,
  track,
  currentlyViewed,
  deleteTrack,
  animateIn
}) => {
  const [isGettingDeleted, setIsGettingDeleted] = useState(false)

  const callOnce = (func, threshold) => {
    let isCalled = false
    return springVal => {
      if (springVal >= threshold && !isCalled) {
        isCalled = true
        func()
      }
    }
  }
  return (
    <Styled.CollapsedTrackContainer flipKey={isGettingDeleted}>
      <Flipped flipId={`${track.id}-trash`}>
        <Styled.TrashIconContainer isGettingDeleted={isGettingDeleted}>
          <img src={trashIcon} alt="remove song" />
        </Styled.TrashIconContainer>
      </Flipped>

      <Swipe
        right={{
          initFlip: () => setIsGettingDeleted(true),
          cancelFlip: () => setIsGettingDeleted(false)
        }}
        threshold={0.4}
      >
        <Flipped
          stagger={animateIn}
          flipId={`track-${track.id}`}
          onSpringUpdate={callOnce(() => {
            if (isGettingDeleted) {
              deleteTrack(track.id)
            }
          }, 0.85)}
        >
          <Styled.CollapsedTrack
            animateIn={animateIn}
            currentlyViewed={currentlyViewed}
            isGettingDeleted={isGettingDeleted}
            href="#"
            onClick={() => {
              if (isPlaying) {
                setIsPlaying(null)
              } else {
                setIsPlaying(track.id)
              }
            }}
          >
            <Styled.PlayButton isPlaying={isPlaying}>
              <img src={isPlaying ? pauseIcon : playIcon} />{' '}
            </Styled.PlayButton>
            <div>
              <h3>{track.title}</h3>
              <p>{track.artist}</p>
            </div>
            <div>
              <Styled.DeleteButton
                onClick={() => {
                  setIsGettingDeleted(true)
                }}
              >
                <img src={trashIcon} alt="remove song" />
              </Styled.DeleteButton>
            </div>
          </Styled.CollapsedTrack>
        </Flipped>
      </Swipe>
    </Styled.CollapsedTrackContainer>
  )
}

export const updateLocationWithSearchParams = (location, search) => {
  const searchParams = new URLSearchParams(location.search)
  Object.keys(search).forEach(key => searchParams.set(key, search[key]))
  const newLocation = Object.assign({}, location, {
    search: searchParams.toString()
  })
  return newLocation
}

const Playlist = props => {
  const headerIsCollapsing = new URLSearchParams(props.previousSearch)
  const playlist = playlists.find(
    playlist => playlist.id === props.match.params.id
  )
  const [visibleTracks, setVisibleTracks] = useState(playlist.tracks)
  const [isPlaying, setIsPlaying] = useState(null)
  const [animateListIn, setAnimateListIn] = useState(false)

  React.useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  React.useEffect(() => {
    callOnDesktop(() => {
      setTimeout(() => {
        setAnimateListIn(true)
      }, 300)
    })()
  }, [])

  const headerCollapsed =
    new URLSearchParams(props.location.search).get('headerCollapsed') === 'true'

  const toggleCollapsed = () => {
    props.history.push(
      updateLocationWithSearchParams(props.location, {
        headerCollapsed: !headerCollapsed
      })
    )
  }

  const deleteTrack = id => {
    setVisibleTracks(prevState => {
      return prevState.filter(({ id: trackId }) => id !== trackId)
    })
  }

  return (
    <Styled.Container>
      <Core.VisibleOnDesktop>
        <Core.Header />
      </Core.VisibleOnDesktop>
      <PlaylistHeader
        playlist={playlist}
        collapsed={headerCollapsed}
        toggleCollapsed={toggleCollapsed}
      />
      <Flipper flipKey={`${JSON.stringify(visibleTracks)} ${animateListIn}`}>
        <Styled.List collapsed={headerCollapsed}>
          {visibleTracks.map(track => (
            <Styled.Li key={track.id} data-li="true">
              <ListItem
                track={track}
                deleteTrack={deleteTrack}
                setIsPlaying={setIsPlaying}
                isPlaying={isPlaying === track.id}
                animateIn={animateListIn}
              />
            </Styled.Li>
          ))}
        </Styled.List>
      </Flipper>
    </Styled.Container>
  )
}

export default React.memo(Playlist)
