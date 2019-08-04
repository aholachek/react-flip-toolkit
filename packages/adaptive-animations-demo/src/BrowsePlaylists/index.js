import React from 'react'
import { Flipped, Swipe } from 'react-flip-toolkit'
import * as Styled from './styled-elements'
import * as Core from '../core-components'
import playlists from '../playlists'
const linkedCards = playlists
  .map((card, index) => {
    return Object.assign(card, {
      next:
        index === playlists.length - 1 ? playlists[0] : playlists[index + 1],
      prev: index === 0 ? playlists[playlists.length - 1] : playlists[index - 1]
    })
  })
  .reduce(
    (acc, curr) =>
      Object.assign(acc, {
        [curr.id]: {
          ...curr
        }
      }),
    {}
  )

const Card = React.memo(
  ({ id, title, src, tags, setNextCardId, prev, next, isCurrentCard }) => {
    const card = (
      <Flipped
        flipId={id}
        onStart={(element, decisionData) => {
          if (
            decisionData.previous.tracks === 'tracks' &&
            decisionData.current.tracks !== 'tracks'
          ) {
            element.style.zIndex = 1
          }
        }}
        onComplete={element => {
          element.style.zIndex = ''
        }}
      >
        <Styled.Card
          isCurrentCard={isCurrentCard}
          draggable="false"
          to={`/playlists/${id}/tracks`}
        >
          <Flipped inverseFlipId={id}>
            <div>
              <Styled.ImgContainer draggable="false">
                <Flipped flipId={`${id}-img`}>
                  <Core.PreloadedImg id={`img-${id}`} draggable="false" />
                </Flipped>
              </Styled.ImgContainer>

              <Styled.Meta isCurrentCard={isCurrentCard}>
                <Flipped flipId={`${id}-title`}>
                  <Styled.Title>{title}</Styled.Title>
                </Flipped>
                <Flipped flipId={`${id}-taglist`}>
                  <Core.TagList>
                    {tags.map((t, i) => (
                      <Core.Tag>{t}</Core.Tag>
                    ))}
                  </Core.TagList>
                </Flipped>
              </Styled.Meta>
            </div>
          </Flipped>
        </Styled.Card>
      </Flipped>
    )
    return card
  }
)

const GestureCardSwipe = ({ history, match }) => {
  const [swipeInProgress, setSwipeInProgress] = React.useState(false)
  const currentCardId = parseInt(match.params.id, 10) || playlists[0].id
  const currentCard = linkedCards[currentCardId]
  const cardsToRender = playlists

  // only relavent for mobile
  const currentCardIndex = Math.floor(playlists.length / 2)
  const swipeOrder = {
    [currentCard.prev.prev.id]: currentCardIndex - 2,
    [currentCard.prev.id]: currentCardIndex - 1,
    [currentCard.id]: currentCardIndex,
    [currentCard.next.id]: currentCardIndex + 1,
    [currentCard.next.next.id]: currentCardIndex + 2
  }
  const setNextCardId = React.useCallback(
    id => history.push(`/playlists/${id}`),
    []
  )

  return (
    <>
      <Styled.Header>
        <svg
          aria-hidden="true"
          focusable="false"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            fill="currentColor"
            d="M511.99 32.01c0-21.71-21.1-37.01-41.6-30.51L150.4 96c-13.3 4.2-22.4 16.5-22.4 30.5v261.42c-10.05-2.38-20.72-3.92-32-3.92-53.02 0-96 28.65-96 64s42.98 64 96 64 96-28.65 96-64V214.31l256-75.02v184.63c-10.05-2.38-20.72-3.92-32-3.92-53.02 0-96 28.65-96 64s42.98 64 96 64 96-28.65 96-64l-.01-351.99z"
          ></path>
        </svg>
        Playlists for Dogs
      </Styled.Header>
      <Styled.Container>
        <Swipe
          onDown={state => {
            setSwipeInProgress(true)
          }}
          onUp={state => {
            setSwipeInProgress(false)
          }}
          threshold={25}
          right={{
            initFlip: () => {
              return setNextCardId(currentCard.prev.id)
            },
            cancelFlip: () => {
              return setNextCardId(currentCard.id)
            }
          }}
          left={{
            initFlip: () => {
              setNextCardId(currentCard.next.id)
            },
            cancelFlip: () => {
              setNextCardId(currentCard.id)
            }
          }}
        >
          <Styled.List
            length={playlists.length}
            swipeInProgress={swipeInProgress}
          >
            {cardsToRender.map((card, i) => {
              return (
                <Styled.ListItem
                  key={card.id}
                  order={swipeOrder[card.id] || -1}
                >
                  <Card
                    {...card}
                    setNextCardId={setNextCardId}
                    isCurrentCard={card.id === currentCardId}
                    history={history}
                  />
                </Styled.ListItem>
              )
            })}
          </Styled.List>
        </Swipe>
      </Styled.Container>
    </>
  )
}

export default GestureCardSwipe
