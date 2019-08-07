import React from 'react'
import { Flipped, Swipe, spring } from 'react-flip-toolkit'
import * as Styled from './styled-elements'
import * as Core from '../core-components'
import playlists from '../playlists'
import { callOnDesktop } from '../utilities'

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

const Card = React.memo(({ id, title, tags, isCurrentCard, onCardClick }) => {
  const card = (
    <Flipped flipId={id} spring="gentle">
      <Styled.Card
        isCurrentCard={isCurrentCard}
        draggable="false"
        to={`/playlists/${id}/tracks`}
        onClick={onCardClick(id)}
        data-card={id}
      >
        <Flipped inverseFlipId={id}>
          <div>
            <Styled.ImgContainer draggable="false">
              <Flipped flipId={`${id}-img`}>
                <Core.PreloadedImg id={`img-${id}`} draggable="false" />
              </Flipped>
            </Styled.ImgContainer>

            <Styled.Meta isCurrentCard={isCurrentCard}>
              <Styled.Title>{title}</Styled.Title>
              <Core.TagList>
                {tags.map((t, i) => (
                  <Core.Tag>{t}</Core.Tag>
                ))}
              </Core.TagList>
            </Styled.Meta>
          </div>
        </Flipped>
      </Styled.Card>
    </Flipped>
  )
  return card
})

const GestureCardSwipe = props => {
  const { history, match, previousPath } = props
  const previousPageWasTracksPage =
    previousPath && previousPath.match(/\/playlists\/(\d+)\/tracks/)

  const previousTrackId =
    previousPageWasTracksPage && previousPageWasTracksPage[1]

  const [swipeInProgress, setSwipeInProgress] = React.useState(false)
  const listRef = React.useRef(null)
  const currentCardId = match.params.id || playlists[0].id
  const currentCard = linkedCards[currentCardId]
  const cardsToRender = playlists

  // only relevant for mobile
  const currentCardIndex = Math.floor(playlists.length / 2)
  const swipeOrder = {
    [currentCard.prev.prev.id]: currentCardIndex - 2,
    [currentCard.prev.id]: currentCardIndex - 1,
    [currentCard.id]: currentCardIndex,
    [currentCard.next.id]: currentCardIndex + 1,
    [currentCard.next.next.id]: currentCardIndex + 2
  }
  const setNextCardId = id => history.push(`/playlists/${id}`)

  const onCardClick = React.useCallback(id => {
    return callOnDesktop(event => {
      event.preventDefault()
      event.persist()
      const cardsToFade = [
        ...listRef.current.querySelectorAll('[data-card]')
      ].filter(card => {
        return card.dataset.flipId !== id
      })

      cardsToFade.forEach((card, i) => {
        card.classList.add('animate-out')
      })

      setTimeout(() => {
        history.push(event.target.href.replace(event.target.origin, ''))
      }, 200)
    })
  })

  React.useLayoutEffect(() => {
    callOnDesktop(() => {
      const cardsToFade = [
        ...listRef.current.querySelectorAll('[data-card]')
      ].filter(card => card.dataset.flipId !== previousTrackId)
      cardsToFade.forEach((card, i) => {
        card.style.opacity = 0
        setTimeout(() => {
          card.classList.add('animate-in')
        }, i * 50 + (previousPageWasTracksPage ? 150 : 0))
      })
    })()
  }, [])

  return (
    <>
      <Core.Header />
      <Styled.Container>
        <Swipe
          flipId={currentCard.id}
          onDown={state => {
            setSwipeInProgress(true)
          }}
          onUp={state => {
            setSwipeInProgress(false)
          }}
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
            ref={listRef}
          >
            {cardsToRender.map((card, i) => {
              return (
                <Styled.ListItem
                  key={card.id}
                  order={swipeOrder[card.id] || -1}
                >
                  <Card
                    {...card}
                    onCardClick={onCardClick}
                    isCurrentCard={card.id === currentCardId}
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
