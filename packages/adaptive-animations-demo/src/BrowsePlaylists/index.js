import React, { useRef, useEffect, useState } from 'react'
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
  ({
    src,
    primitive,
    id,
    title,
    tags,
    setNextCardId,
    prevCardId,
    nextCardId,
    isCurrentCard,
    history
  }) => {
    const imgContainerRef = useRef(null)

    const [swipeInProgressOnThisCard, setSwipeInProgressOnThisCard] = useState(
      false
    )

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
          swipeInProgressOnThisCard={swipeInProgressOnThisCard}
          draggable="false"
        >
          {/* <Flipped inverseFlipId={id}>
            <Styled.ImgContainer ref={imgContainerRef}>
              <Flipped flipId={`${id}-img`}>
                <Core.PreloadedImg id={`img-${id}`} draggable="false" />
              </Flipped>
            </Styled.ImgContainer>
          </Flipped> */}

          {/* <Flipped inverseFlipId={id} translate>
            <div> */}
          <Flipped flipId={`${id}-meta`}>
            <Styled.Meta isCurrentCard={isCurrentCard}>
              <Styled.Title>{title}</Styled.Title>
              <Core.TagList>
                {tags.map((t, i) => (
                  <Core.Tag>{t}</Core.Tag>
                ))}
              </Core.TagList>
            </Styled.Meta>
          </Flipped>
          {/* </div>
          </Flipped> */}
        </Styled.Card>
      </Flipped>
    )
    return (
      <li>
        <Swipe
          threshold={0.4}
          onClick={() => history.push(`/playlists/${id}/tracks`)}
          onDown={() => {
            setSwipeInProgressOnThisCard(true)
          }}
          onUp={() => {
            setSwipeInProgressOnThisCard(false)
          }}
          right={
            isCurrentCard && {
              initFlip: () => {
                return setNextCardId(prevCardId)
              },
              cancelFlip: () => {
                return setNextCardId(id)
              }
            }
          }
          left={
            isCurrentCard && {
              initFlip: () => {
                setNextCardId(nextCardId)
              },
              cancelFlip: () => {
                setNextCardId(id)
              }
            }
          }
        >
          {card}
        </Swipe>
      </li>
    )
  }
)

const GestureCardSwipe = ({ history, match, renderFlipped }) => {
  const currentCardId = parseInt(match.params.id, 10) || playlists[0].id
  const currentCard = linkedCards[currentCardId]
  const cardsToRender = [
    currentCard.prev.prev,
    currentCard.prev,
    currentCard,
    currentCard.next,
    currentCard.next.next
  ]

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
        <Styled.List>
          {cardsToRender.map((card, i) => {
            return (
              <Card
                {...card}
                key={card.id}
                currentCardId={currentCardId}
                setNextCardId={setNextCardId}
                prevCardId={card.prev.id}
                nextCardId={card.next.id}
                isCurrentCard={card.id === currentCardId}
                history={history}
              />
            )
          })}
        </Styled.List>
      </Styled.Container>
    </>
  )
}

export default GestureCardSwipe
