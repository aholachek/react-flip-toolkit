import React, { useState, useRef } from 'react'
import { Flipper, Flipped, Swipe } from 'react-flip-toolkit'
import playlists from '../playlists'
import * as Styled from './styled-components'
import * as Core from '../core-components'
import { usePrevious } from '../utilities'
import PlaylistHeader from './Header'
import playIcon from '../assets/play-icon.svg'

const Drawer = ({ track, setCurrentlyViewed }) => {
  const previousTrack = usePrevious(track)
  const trackToRender = track || previousTrack
  return (
    <Swipe
      down={{
        initFlip: () => {
          setCurrentlyViewed(null)
        },
        cancelFlip: () => {
          console.log('cancelling flip')
          setCurrentlyViewed(track.id)
        }
      }}
    >
      <Flipped flipId="drawer">
        <Styled.Drawer track={track}>
          {trackToRender && (
            <Flipped flipId="track-text" opacity>
              <Styled.DrawerContent track={track}>
                <h1>{trackToRender.title}</h1>
                <p>{trackToRender.artist}</p>
              </Styled.DrawerContent>
            </Flipped>
          )}
        </Styled.Drawer>
      </Flipped>
    </Swipe>
  )
}

const ListItem = ({
  setCurrentlyViewed,
  track,
  currentlyViewed,
  deleteTrack,
  toggleTrackStarred
}) => {
  const [isGettingDeleted, setIsGettingDeleted] = useState(false)
  const [isGettingStarred, setIsGettingStarred] = useState(false)

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
    <Styled.CollapsedTrackContainer
      flipKey={`${isGettingDeleted} ${isGettingStarred}`}
    >
      <Swipe
        right={{
          initFlip: () => setIsGettingDeleted(true),
          cancelFlip: () => setIsGettingDeleted(false)
        }}
        left={{
          initFlip: () => setIsGettingStarred(true),
          cancelFlip: () => setIsGettingStarred(false)
        }}
        onClick={e => {
          setCurrentlyViewed(track.id)
        }}
      >
        <Flipped
          flipId={`track-${track.id}`}
          onSpringUpdate={callOnce(() => {
            if (isGettingDeleted) {
              deleteTrack(track.id)
            }
          }, 0.85)}
          onComplete={() => {
            if (isGettingStarred) {
              toggleTrackStarred(track.id)
              setIsGettingStarred(false)
            }
          }}
        >
          <Styled.CollapsedTrack
            currentlyViewed={currentlyViewed}
            isGettingDeleted={isGettingDeleted}
            isGettingStarred={isGettingStarred}
            href="#"
          >
            <Styled.PlayButton>
              <img src={playIcon} alt="" />
            </Styled.PlayButton>
            <div>
              {track.starred && 'i am starred'}
              <h3>{track.title}</h3>
              <p>{track.artist}</p>
            </div>
          </Styled.CollapsedTrack>
        </Flipped>
      </Swipe>
    </Styled.CollapsedTrackContainer>
  )
}

const updateSearch = (location, searchObj) => {}

export const updateLocationWithSearchParams = (location, search) => {
  const searchParams = new URLSearchParams(location.search)
  Object.keys(search).forEach(key => searchParams.set(key, search[key]))
  const newLocation = Object.assign({}, location, {
    search: searchParams.toString()
  })
  return newLocation
}

const Playlist = props => {
  const playlist = playlists.find(
    playlist => playlist.id === parseInt(props.match.params.id, 10)
  )
  const [currentlyViewed, setCurrentlyViewed] = useState(null)
  const [visibleTracks, setVisibleTracks] = useState(playlist.tracks)

  const headerCollapsed =
    new URLSearchParams(props.location.search).get('headerCollapsed') ===
    'false'
  const toggleCollapsed = () => {
    props.history.push(
      updateLocationWithSearchParams(props.location, {
        headerCollapsed
      })
    )
  }

  const deleteTrack = id => {
    setVisibleTracks(prevState => {
      return prevState.filter(({ id: trackId }) => id !== trackId)
    })
  }

  const toggleTrackStarred = id => {
    setVisibleTracks(prevState => {
      return prevState.map(track => {
        if (track.id === id) {
          return Object.assign({}, track, { starred: !track.starred })
        }
        return track
      })
    })
  }

  return (
    <Flipper flipKey={headerCollapsed}>
      <PlaylistHeader
        playlist={playlist}
        collapsed={headerCollapsed}
        toggleCollapsed={toggleCollapsed}
      />
      <Flipped transform>
        <Styled.Container>
          <Styled.List currentlyViewed={currentlyViewed}>
            {playlist.tracks.map(track => (
              <Styled.Li key={track.id}>
                {
                  <ListItem
                    track={track}
                    currentlyViewed={currentlyViewed}
                    setCurrentlyViewed={setCurrentlyViewed}
                    deleteTrack={deleteTrack}
                    toggleTrackStarred={toggleTrackStarred}
                  />
                }
              </Styled.Li>
            ))}
          </Styled.List>
        </Styled.Container>
      </Flipped>
      <Drawer track={null} setCurrentlyViewed={setCurrentlyViewed} />
    </Flipper>
  )
}

export default React.memo(Playlist)
