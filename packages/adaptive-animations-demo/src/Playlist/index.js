import React, { useState, useRef } from 'react'
import { Flipper, Flipped, Swipe } from 'react-flip-toolkit'
import playlists from '../playlists'
import * as Styled from './styled-components'
import { usePrevious } from '../utilities'

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
            {track.starred && 'i am starred'}
            <h3>{track.title}</h3>
            <p>{track.artist}</p>
          </Styled.CollapsedTrack>
        </Flipped>
      </Swipe>
    </Styled.CollapsedTrackContainer>
  )
}

const Playlist = props => {
  const playlist = playlists.find(
    playlist => playlist.id === parseInt(props.match.params.id, 10)
  )
  const [currentlyViewed, setCurrentlyViewed] = useState(null)
  const [visibleTracks, setVisibleTracks] = useState(playlist.tracks)

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
    <>
      <Flipped flipId={playlist.id}>
        <Styled.BackgroundImgContainer>
          <Flipped inverseFlipId={playlist.id}>
            <div>
              <Styled.MetaContainer>
                <Styled.Title>{playlist.title}</Styled.Title>
                <Styled.TagList>
                  {playlist.tags.map(t => {
                    return (
                      <Flipped flipId={`${playlist.id}-${t}`} stagger>
                        <Styled.Tag>{t}</Styled.Tag>
                      </Flipped>
                    )
                  })}
                </Styled.TagList>
              </Styled.MetaContainer>
              <Flipped flipId={`img-${playlist.id}`}>
                <Styled.BackgroundImg src={playlist.src} alt="" />
              </Flipped>
            </div>
          </Flipped>
        </Styled.BackgroundImgContainer>
      </Flipped>

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
      <Drawer track={null} setCurrentlyViewed={setCurrentlyViewed} />
    </>
  )
}

export default Playlist
