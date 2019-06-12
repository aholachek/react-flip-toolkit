import React, { useState } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

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
  height: 14rem;
  width: 15rem;
`

const StyledImg = styled.img`
  width: 100%;
  height: auto;
`

const StyledList = styled.ul`
  position: relative;
  padding:0;
  margin:0;
  list-style:none;

  ${StyledCard} {
    position: absolute;
    top: 4rem;
  }

  >li:nth-of-type(1) {
    left: -90%
  }
  >li:nth-of-type(2) {
    transform: translateX(-50%);
    left: 50%:
  }
  >li:nth-of-type(3) {
    right: 90%;
  }
`

const Card = ({ src, title, alt, id }) => {
  return (
    <StyledCard>
      <StyledImg src={src} alt={alt} />
      {id}
    </StyledCard>
  )
}

const GestureCardSwipe = ({}) => {
  const [currentCardId, setCurrentCardId] = useState(cards[0])
  const currentCardIndex = cards.filter(c => c.id === currentCardId)
  const currentCard = cards[currentCardIndex]
  const prevCard =
    currentCardIndex - 1 === -1 ? cards.length - 1 : currentCardIndex - 1
  const nextCard = cards[(currentCardIndex + 1) % cards.length]
  return (
    <StyledContainer>
      <StyledList>
        {[prevCard, currentCard, nextCard].map(card => (
          <li>
            <Card {...card} />
          </li>
        ))}
      </StyledList>
    </StyledContainer>
  )
}

GestureCardSwipe.defaultProps = {}
GestureCardSwipe.propTypes = {}

export default GestureCardSwipe
