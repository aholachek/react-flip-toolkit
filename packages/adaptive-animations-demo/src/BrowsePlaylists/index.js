import React from 'react'
import { Flipped, Swipe, spring } from 'react-flip-toolkit'
import * as Styled from './styled-components'
import * as Core from '../core-components'
import playlists from '../playlists'
import playIcon from '../assets/play-icon.svg'
import { Flex } from 'rebass'

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
    title,
    alt,
    id,
    setNextCardId,
    prevCardId,
    nextCardId,
    isCurrentCard,
    history
  }) => {
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
        <Styled.Card isCurrentCard={isCurrentCard} draggable="false">
          <Flipped inverseFlipId={id}>
            <div>
              <Flipped flipId={`img-${id}`}>
                <Styled.Img
                  src={src}
                  alt={alt}
                  draggable="false"
                  decoding="async"
                />
              </Flipped>
            </div>
          </Flipped>
        </Styled.Card>
      </Flipped>
    )
    return (
      <li>
        <Swipe
          threshold={0.5}
          onClick={() => history.push(`/playlists/${id}/tracks`)}
          right={
            isCurrentCard && {
              initFlip: () => {
                return setNextCardId(prevCardId)
              },
              cancelFlip: () => setNextCardId(id)
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

const GestureCardSwipe = ({ history, match }) => {
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
          class="svg-inline--fa fa-music fa-w-16 fa-3x"
        >
          <path
            fill="currentColor"
            d="M511.99 32.01c0-21.71-21.1-37.01-41.6-30.51L150.4 96c-13.3 4.2-22.4 16.5-22.4 30.5v261.42c-10.05-2.38-20.72-3.92-32-3.92-53.02 0-96 28.65-96 64s42.98 64 96 64 96-28.65 96-64V214.31l256-75.02v184.63c-10.05-2.38-20.72-3.92-32-3.92-53.02 0-96 28.65-96 64s42.98 64 96 64 96-28.65 96-64l-.01-351.99z"
            class=""
          ></path>
        </svg>
        Playlists for Dogs
      </Styled.Header>
      <Styled.Title>{currentCard.title}</Styled.Title>
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
      <Flipped flipId={`${currentCard.id}-metadata`}>
        <Styled.Meta key={`${currentCard.title}-meta`}>
          <Flipped inverseFlipId={`${currentCard.id}-metadata`}>
            <div>
              <Core.TagList>
                {currentCard.tags.map((t, i) => (
                  <Flipped flipId={`${i}-tag`}>
                    <Core.Tag>
                      <Flipped inverseFlipId={`${i}-tag`} scale>
                        <span>{t}</span>
                      </Flipped>
                    </Core.Tag>
                  </Flipped>
                ))}
              </Core.TagList>
            </div>
          </Flipped>
        </Styled.Meta>
      </Flipped>
    </>
  )
}

export default GestureCardSwipe
