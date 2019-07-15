import React, { useState } from 'react'
import { Flipper, Flipped, Swipe, spring } from 'react-flip-toolkit'
import * as Components from './components'

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

const Card = ({
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
  const isEndCard = (id, cardsToRender) => {
    return cardsToRender[0].id === id || cardsToRender.slice(-1)[0].id === id
  }
  const card = (
    <Flipped
      flipId={id}
      shouldFlip={(prevCardsToRender, currentCardsToRender) => {
        if (
          isEndCard(id, prevCardsToRender) &&
          isEndCard(id, currentCardsToRender)
        ) {
          return false
        }
        return true
      }}
    >
      <Components.Card isCurrentCard={isCurrentCard} draggable="false">
        <Flipped inverseFlipId={id}>
          <div>
            <Flipped flipId={`img-${id}`}>
              <Components.Img src={src} alt={alt} draggable="false" />
            </Flipped>
          </div>
        </Flipped>
      </Components.Card>
    </Flipped>
  )
  return (
    <li>
      <Swipe
        onClick={() => history.push(`/playlists/${id}`)}
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

const GestureCardSwipe = ({ history, match }) => {
  const currentCardId = match.params.id || playlists[0].id
  const currentCard = linkedCards[currentCardId]
  const cardsToRender = [
    currentCard.prev.prev,
    currentCard.prev,
    currentCard,
    currentCard.next,
    currentCard.next.next
  ]

  const setNextCardId = id => history.push(`/browse/${id}`)

  return (
    <>
      {/* <Components.Header>Playlists for Dogs</Components.Header> */}
      <Flipper
        flipKey={currentCardId}
        decisionData={cardsToRender}
        spring="wobbly"
      >
        <Components.Container>
          <Components.List>
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
          </Components.List>
        </Components.Container>
        <Components.CurrentCardMeta key={`${currentCard.title}-meta`}>
          <h2>{currentCard.title}</h2>
          <Components.TagList>
            {currentCard.tags.map(t => (
              <Flipped flipId={`${currentCard.id}-${t}`} stagger>
                <Components.Tag>{t}</Components.Tag>
              </Flipped>
            ))}
          </Components.TagList>
        </Components.CurrentCardMeta>
      </Flipper>
    </>
  )
}

export default GestureCardSwipe
