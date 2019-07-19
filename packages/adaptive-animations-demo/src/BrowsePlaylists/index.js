import React from 'react'
import { Flipped, Swipe, spring } from 'react-flip-toolkit'
import * as Styled from './styled-components'
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
              <Styled.Img src={src} alt={alt} draggable="false" />
            </Flipped>
          </div>
        </Flipped>
      </Styled.Card>
    </Flipped>
  )
  return (
    <li>
      <Swipe
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

  const setNextCardId = id => history.push(`/playlists/${id}`)

  return (
    <>
      {/* <Styled.Header>Playlists for Dogs</Styled.Header> */}
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
      <Styled.CurrentCardMeta key={`${currentCard.title}-meta`}>
        <h2>{currentCard.title}</h2>
        <Styled.TagList>
          {currentCard.tags.map(t => (
            <Flipped flipId={`${currentCard.id}-${t}`} stagger>
              <Styled.Tag>{t}</Styled.Tag>
            </Flipped>
          ))}
        </Styled.TagList>
      </Styled.CurrentCardMeta>
    </>
  )
}

export default GestureCardSwipe
