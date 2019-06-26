import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'
import { Flipper, Flipped } from '../../../src/gesture'
import Aussie from '../assets/dogs/australian-shepard.jpg'
import Corgi from '../assets/dogs/corgi.jpg'
import Golden from '../assets/dogs/golden-with-flower.jpg'
import BlackDoodle from '../assets/dogs/black-doodle.jpg'
import Pug from '../assets/dogs/pug.jpg'
import Friends from '../assets/dogs/friends.jpg'
import Samoyed from '../assets/dogs/samoyed.jpg'

const cards = [
  { src: Aussie, title: 'Happy Afternoon', id: 1 },
  { src: Golden, title: 'Summertime Love', id: 2 },
  { src: BlackDoodle, title: 'Fitness Beats', id: 3 },
  { src: Friends, title: 'Out with the boys', id: 4 },
  { src: Samoyed, title: 'Meditative beats', id: 5 },
  { src: Pug, title: 'Life is pain', id: 6 },
  { src: Corgi, title: 'Party Time', id: 7 }
]

const StyledFlipper = styled(Flipper)`
  overflow: hidden;
  height: 100vh;
`

const StyledContainer = styled.div`
  padding-top: 1rem;
  padding-bottom: 1rem;
  height: 40vh;
  width: 100%;
  max-width: 375px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
`

const StyledCard = styled.div`
  touch-action: manipulation;
  position: relative;
  overflow: hidden;
  cursor: grab;
  border-top-left-radius: 5%;
  border-top-right-radius: 5%;
  cursor: grab;
  ${props =>
    props.isCurrentCard
      ? css`
          height: 28rem;
          width: 18rem;
        `
      : css`
          height: 16rem;
          width: 9rem;
        `};
`

const StyledCardContent = styled.div`
  background-color: white;
  padding: 1rem;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`

const StyledImg = styled.img`
  height: 30rem;
  user-select: none;
  touch-action: manipulation;
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
  currentCardId
}) => {
  const isCurrentCard = Boolean(setNextCardId)
  const isEndCard = (id, cardsToRender) => {
    return cardsToRender[0].id === id || cardsToRender.slice(-1)[0].id === id
  }
  console.log(src, id)
  return (
    <li>
      <Flipped
        currentCardId={currentCardId}
        shouldFlip={(prevCardsToRender, currentCardsToRender) => {
          if (
            isEndCard(id, prevCardsToRender) &&
            isEndCard(id, currentCardsToRender)
          ) {
            return false
          }
          return true
        }}
        flipId={id}
        flipOnSwipe={
          isCurrentCard && [
            {
              direction: 'right',
              initFLIP: () => {
                return setNextCardId(prevCardId)
              },
              cancelFLIP: () => {
                return setNextCardId(id)
              }
            },
            {
              direction: 'left',
              initFLIP: () => {
                return setNextCardId(nextCardId)
              },
              cancelFLIP: () => {
                return setNextCardId(id)
              }
            }
          ]
        }
      >
        <StyledCard isCurrentCard={isCurrentCard} draggable="false">
          <Flipped inverseFlipId={id} scale>
            <div>
              <StyledImg src={src} alt={alt} draggable="false" />
            </div>
          </Flipped>
          {/* <StyledCardContent>
            <h3>{title}</h3>
          </StyledCardContent> */}
        </StyledCard>
      </Flipped>
    </li>
  )
}

const GestureCardSwipe = ({}) => {
  const [currentCardId, setCurrentCardId] = useState(cards[0].id)
  const currentCardIndex = cards.findIndex(c => c.id === currentCardId)
  const currentCard = cards[currentCardIndex]
  const prevPrevCardIndex =
    currentCardIndex - 2 >= 0
      ? currentCardIndex - 2
      : cards.length + (currentCardIndex - 2)
  const prevCardIndex =
    currentCardIndex - 1 >= 0
      ? currentCardIndex - 1
      : cards.length + (currentCardIndex - 1)
  const nextCardIndex = (currentCardIndex + 1) % cards.length
  const nextNextCardIndex = (currentCardIndex + 2) % cards.length
  const cardsToRender = [
    cards[prevPrevCardIndex],
    cards[prevCardIndex],
    currentCard,
    cards[nextCardIndex],
    cards[nextNextCardIndex]
  ]
  return (
    <StyledFlipper
      flipKey={currentCardId}
      decisionData={cardsToRender}
      spring="gentle"
    >
      <StyledContainer>
        <StyledList>
          {cardsToRender.map((card, i) => {
            if (card.id === currentCardId) {
              return (
                <Card
                  {...card}
                  key={card.id}
                  currentCardId={currentCardId}
                  setNextCardId={setCurrentCardId}
                  prevCardId={cardsToRender[i - 1].id}
                  nextCardId={cardsToRender[i + 1].id}
                />
              )
            } else {
              return <Card {...card} key={card.id} />
            }
          })}
        </StyledList>
      </StyledContainer>
    </StyledFlipper>
  )
}

GestureCardSwipe.defaultProps = {}
GestureCardSwipe.propTypes = {}

export default GestureCardSwipe
