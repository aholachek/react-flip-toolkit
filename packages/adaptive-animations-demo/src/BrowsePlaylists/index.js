import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { Flipper, Flipped, Swipe } from 'react-flip-toolkit'
import cards from '../playlists'

const linkedCards = cards
  .map((card, index) => {
    return Object.assign(card, {
      next: index === cards.length - 1 ? cards[0] : cards[index + 1],
      prev: index === 0 ? cards[cards.length - 1] : cards[index - 1]
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

const StyledHeader = styled.div`
  background: black;
  padding: 1rem;
  color: white;
`

const StyledContainer = styled.div`
  padding-top: 1rem;
  padding-bottom: 1rem;
  height: 100vh;
  width: 100%;
  max-width: 375px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
`

const StyledCard = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 4%;
  ${props =>
    props.isCurrentCard
      ? css`
          height: 22rem;
          width: 100%;
        `
      : css`
          height: 14rem;
          width: 100%;
        `};
`

const StyledCardContent = styled.div`
  background-color: white;
  padding: 1rem;
`

const StyledImg = styled.img`
  width: 26rem;
  position: relative;
  top: -4rem;
  left: -4rem;
  background-color: black;
  user-select: none;
`

const StyledList = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: 10rem 10rem 18rem 10rem 10rem;
  align-items: center;
  transform: translateX(-50%);
  position: absolute;
  left: 50%;
`

const Card = ({
  src,
  title,
  alt,
  id,
  setNextCardId,
  prevCardId,
  nextCardId,
  isCurrentCard
}) => {
  const isEndCard = (id, cardsToRender) => {
    return cardsToRender[0].id === id || cardsToRender.slice(-1)[0].id === id
  }
  const card = (
    <Flipped
      flipId={id}
      shouldFlip={(prevCardsToRender, currentCardsToRender) => {
        return (
          !isEndCard(id, prevCardsToRender) ||
          !isEndCard(id, currentCardsToRender)
        )
      }}
    >
      <StyledCard isCurrentCard={isCurrentCard} draggable="false">
        <Flipped inverseFlipId={id} scale>
          <div>
            <StyledImg src={src} alt={alt} draggable="false" />
          </div>
        </Flipped>
        <StyledCardContent>
          {id}
          <h3>{title}</h3>
        </StyledCardContent>
      </StyledCard>
    </Flipped>
  )
  return (
    <li>
      <Swipe
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

const CardList = ({}) => {
  const [currentCardId, setCurrentCardId] = useState(cards[0].id)
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
      {/* <StyledHeader>Playlists for Dogs</StyledHeader> */}
      <Flipper
        flipKey={currentCardId}
        decisionData={cardsToRender}
        spring={{ stiffness: 280, damping: 22 }}
      >
        <StyledContainer>
          <StyledList>
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
                />
              )
            })}
          </StyledList>
        </StyledContainer>
      </Flipper>
    </>
  )
}

export default CardList
