import React, { useState, useRef, useEffect } from 'react'
import { Flipper, Flipped, Swipe } from 'react-flip-toolkit'
import styled, { css, keyframes } from 'styled-components'
import playlists from '../playlists'
import * as Components from './components'

const Title = styled.h1`
  color: white;
  font-size: 3rem;
  max-width: 100vh;
  letter-spacing: 0.1rem;
  line-height: 1;
`
const BackgroundImg = styled.img`
  width: 30rem;
  height: auto;
  top: -2rem;
  left: -2.5rem;
  position: relative;
  z-index: -1;
`

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

const BackgroundImgContainer = styled.div`
  border-radius: 4%;
  width: calc(100% + 2rem);
  position: relative;
  left: -1rem;
  right: -1rem;
  height: calc(100vh - 5rem);
  /* &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    right: -100%;
    bottom: -100%;
    background: hsla(0, 0%, 0%, 0.3);
  } */
`

const StyledFlipper = styled(Flipper)`
  position: relative;
  width: 100%;
  max-width: 30rem;
  margin: 0 auto;
  overflow: hidden;
`

const StyledContainer = styled.div`
  background-color: #ececec;
  padding: 0.4rem;
  overflow: auto;
  height: 600px;
`

const StyledLi = styled.li`
  position: relative;
  list-style-type: none;
  height: 10rem;
  margin-bottom: 0.4rem;
  min-height: 5rem;
`

const actionMixin = props => css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40%;
  position: absolute;
`

const Favorite = styled.div`
  ${actionMixin};
  left: 0;
`
const Trash = styled.div`
  ${actionMixin};
  right: 0;
`

const StyledCollapsedTrackContainer = styled(Flipper)`
  position: relative;
  width: 100%;
  height: 100%;
`

const StyledCollapsedTrack = styled.div`
  z-index: 1;
  width: 100%;
  height: 100%;
  background-color: white;
  &:not(:last-of-type) {
    margin-bottom: 0.5rem;
  }
  padding: 1rem;
  cursor: pointer;
  display: block;
  position: relative;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  left: ${props =>
    props.isGettingDeleted ? `110%` : props.isGettingStarred ? '-50%' : 0};
`

const StyledList = styled.ul`
  padding: 0;
  margin: 0;
  transform: ${props => (props.currentlyViewed ? 'scale(.85)' : 'scale(1)')};
`

const StyledDrawer = styled.div`
  z-index: 2;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 100%;
  background: white;
  cursor: ${({ track }) => (track ? 'grab' : 'pointer')};
  transform: ${({ track }) => (track ? 'translateY(0)' : 'translateY(100%)')};
`

const StyledDrawerContent = styled.div`
  user-select: none;
  opacity: ${({ track }) => (track ? 1 : 0)};
`

function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

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
        <StyledDrawer track={track}>
          {trackToRender && (
            <Flipped flipId="track-text" opacity>
              <StyledDrawerContent track={track}>
                <h1>{trackToRender.title}</h1>
                <p>{trackToRender.artist}</p>
              </StyledDrawerContent>
            </Flipped>
          )}
        </StyledDrawer>
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
    <StyledCollapsedTrackContainer
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
          <StyledCollapsedTrack
            currentlyViewed={currentlyViewed}
            isGettingDeleted={isGettingDeleted}
            isGettingStarred={isGettingStarred}
            href="#"
          >
            {track.starred && 'i am starred'}
            <h3>{track.title}</h3>
            <p>{track.artist}</p>
          </StyledCollapsedTrack>
        </Flipped>
      </Swipe>
    </StyledCollapsedTrackContainer>
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
    <div>
      <Flipped flipId={playlist.id}>
        <BackgroundImgContainer>
          <Flipped inverseFlipId={playlist.id}>
            <div>
              <Components.MetaContainer>
                <Title>{playlist.title}</Title>
                <Components.TagList>
                  {playlist.tags.map(t => {
                    return (
                      <Flipped flipId={`${playlist.id}-${t}`} stagger>
                        <Components.Tag>{t}</Components.Tag>
                      </Flipped>
                    )
                  })}
                </Components.TagList>
              </Components.MetaContainer>
              <Flipped flipId={`img-${playlist.id}`}>
                <BackgroundImg src={playlist.src} alt="" />
              </Flipped>
            </div>
          </Flipped>
        </BackgroundImgContainer>
      </Flipped>
      <StyledFlipper
        retainTransform
        flipKey={`${currentlyViewed}-${visibleTracks.map(track => track.id)}`}
      >
        <StyledContainer>
          <StyledList currentlyViewed={currentlyViewed}>
            {playlist.tracks.map(track => (
              <StyledLi key={track.id}>
                {
                  <ListItem
                    track={track}
                    currentlyViewed={currentlyViewed}
                    setCurrentlyViewed={setCurrentlyViewed}
                    deleteTrack={deleteTrack}
                    toggleTrackStarred={toggleTrackStarred}
                  />
                }
              </StyledLi>
            ))}
          </StyledList>
        </StyledContainer>
        <Drawer track={null} setCurrentlyViewed={setCurrentlyViewed} />
      </StyledFlipper>
    </div>
  )
}

export default Playlist
