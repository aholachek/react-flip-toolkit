import React, { useState } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Flipper, Flipped } from '../../../src/gesture'
import Aussie from '../assets/dogs/australian-shepard.jpg'
import Corgi from '../assets/dogs/corgi.jpg'
import Golden from '../assets/dogs/golden-with-flower.jpg'

const cards = [
  { src: Aussie, title: 'lorem', id: 1 },
  { src: Corgi, title: 'lorem', id: 2 },
  { src: Golden, title: 'lorem', id: 3 }
]

const StyledContainer = styled.div`
  height: 800px;
  width: 500px;
  margin: 0 auto;
  border: 1px solid gray;
`

const StyledCard = styled.div`
  height: 20rem;
  width: 15rem;
`

const StyledImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const StyledList = styled.ul`
  position: relative;
  padding: 0;
  margin: 0;
  list-style: none;

  > li {
    position: absolute;
    top: 4rem;
  }

  > li:nth-of-type(1) {
    right: 90%;
  }
  > li:nth-of-type(2) {
    transform: translateX(-50%);
    left: 50%;
    > ${StyledCard} {
      height: 25rem;
      width: 20rem;
    }
  }
  > li:nth-of-type(3) {
    left: 90%;
  }
`

const Card = ({
  src,
  title,
  alt,
  id,
  setNextCardId,
  prevCardId,
  nextCardId
}) => {
  const isSwipeable = Boolean(setNextCardId)
  return (
    <li>
      <Flipped
        flipId={id}
        flipOnSwipe={
          isSwipeable && [
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
        // onNonSwipeClick={e => {
        //   setCurrentlyViewed(article.id)
        // }}
      >
        <StyledCard>
          <StyledImg src={src} alt={alt} />
          {id} {title}
        </StyledCard>
      </Flipped>
    </li>
  )
}

const GestureCardSwipe = ({}) => {
  const [currentCardId, setCurrentCardId] = useState(cards[0].id)
  const currentCardIndex = cards.findIndex(c => c.id === currentCardId)
  const currentCard = cards[currentCardIndex]
  const prevCardIndex =
    currentCardIndex - 1 < 0 ? cards.length - 1 : currentCardIndex - 1
  const nextCardIndex = (currentCardIndex + 1) % cards.length
  const cardsToRender = [
    cards[prevCardIndex],
    currentCard,
    cards[nextCardIndex]
  ]
  return (
    <Flipper flipKey={currentCardId}>
      <StyledContainer>
        <StyledList>
          {cardsToRender.map(card => {
            if (card.id === currentCardId) {
              return (
                <Card
                  {...card}
                  setNextCardId={setCurrentCardId}
                  prevCardId={cardsToRender[0].id}
                  nextCardId={cardsToRender[2].id}
                />
              )
            } else {
              return <Card {...card} />
            }
          })}
        </StyledList>
      </StyledContainer>
    </Flipper>
  )
}

GestureCardSwipe.defaultProps = {}
GestureCardSwipe.propTypes = {}

export default GestureCardSwipe
