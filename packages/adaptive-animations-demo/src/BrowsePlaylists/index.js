import React, { useState } from 'react'
import { Flipper, Flipped, Swipe, spring } from 'react-flip-toolkit'
import * as Component from './components'
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
      <Component.Card isCurrentCard={isCurrentCard} draggable="false">
        <Flipped inverseFlipId={id}>
          <div>
            <Flipped flipId={`img-${id}`}>
              <Component.Img src={src} alt={alt} draggable="false" />
            </Flipped>
          </div>
        </Flipped>
      </Component.Card>
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

const GestureCardSwipe = ({ history }) => {
  const [currentCardId, setCurrentCardId] = useState(playlists[0].id)
  const currentCard = linkedCards[currentCardId]
  const cardsToRender = [
    currentCard.prev.prev,
    currentCard.prev,
    currentCard,
    currentCard.next,
    currentCard.next.next
  ]
  return (
    <>
      {/* <Component.Header>Playlists for Dogs</Component.Header> */}
      <Flipper
        flipKey={currentCardId}
        decisionData={cardsToRender}
        spring="wobbly"
      >
        <Component.Container>
          <Component.List>
            {cardsToRender.map((card, i) => {
              return (
                <Card
                  {...card}
                  key={card.id}
                  currentCardId={currentCardId}
                  setNextCardId={setCurrentCardId}
                  prevCardId={card.prev.id}
                  nextCardId={card.next.id}
                  isCurrentCard={card.id === currentCardId}
                  history={history}
                />
              )
            })}
          </Component.List>
        </Component.Container>
        <Component.CurrentCardMeta key={`${currentCard.title}-meta`}>
          <h2>{currentCard.title}</h2>
          <Component.TagList>
            {currentCard.tags.map(t => (
              <Component.Tag>{t}</Component.Tag>
            ))}
          </Component.TagList>
        </Component.CurrentCardMeta>
      </Flipper>
    </>
  )
}

export default GestureCardSwipe
