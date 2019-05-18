import React, { useState } from 'react'
import { Flipper, Flipped } from '../../../src/gesture'
import styled from 'styled-components'

const StyledCollapsedArticle = styled.div`
  border: 1px solid gray;
  margin-bottom: 0.5rem;
  padding: 1rem;
  cursor: pointer;
  width: 100%;
  height: 100%;
`

const StyledLi = styled.li`
  position: relative;
  list-style-type: none;
  display: flex;
  justify-content: space-between;
  height: 10rem;
  margin-bottom: 0.5rem;
  > a {
    width: 100%;
    height: 100%;
  }
`

const StyledList = styled.ul`
  padding: 0;
  margin: 0;
`

const StyledContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 30rem;
  margin: 0 auto;
  overflow: hidden;
  min-height: 100vh;
`

const StyledExpandedArticle = styled.div`
  z-index: 1;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 100%;
  background: white;
  border: 1px solid gray;
`

const ExpandedListItem = ({ id, title, description }) => {
  const cancelFLIP = ({ prevProps }) => {
    return updatePosition({
      position: prevProps.position,
      id: article.id
    })
  }
  return (
    <Flipped
      flipId={`article-${id}`}
      // respondToGesture={{
      //   direction: 'down',
      //   initFLIP: ({ props }) => {
      //     if (props.position === 'center')
      //       return updatePosition({ position: 'right', id: article.id })
      //     if (props.position === 'left')
      //       return updatePosition({ position: 'center', id: article.id })
      //   },
      //   cancelFLIP
      // }}
    >
      <StyledExpandedArticle>
        <h1>{title}</h1>
        <p>{description}</p>
      </StyledExpandedArticle>
    </Flipped>
  )
}

const ListItem = ({ setCurrentlyViewed, article }) => {
  return (
    <StyledLi>
      <a
        href="#"
        onClick={e => {
          e.preventDefault()
          setCurrentlyViewed()
        }}
      >
        <Flipped flipId={`article-${article.id}`}>
          <StyledCollapsedArticle>
            <h3>{article.title}</h3>
          </StyledCollapsedArticle>
        </Flipped>
      </a>
    </StyledLi>
  )
}

const articles = [
  { title: 'Foo', id: 1 },
  { title: 'Foo', id: 2 },
  { title: 'Foo', id: 3 }
]

const App = () => {
  const [currentlyViewed, setCurrentlyViewed] = useState(null)

  const returnToListView = () => {
    setCurrentlyViewed(null)
  }

  return (
    <Flipper flipKey={currentlyViewed}>
      <StyledContainer>
        <StyledList>
          {articles
            .filter(({ id }) => id !== currentlyViewed)
            .map(article => (
              <ListItem
                key={article.id}
                article={article}
                setCurrentlyViewed={() => setCurrentlyViewed(article.id)}
              />
            ))}
        </StyledList>
        {currentlyViewed && (
          <ExpandedListItem
            returnToListView={returnToListView}
            {...articles[currentlyViewed]}
          />
        )}
      </StyledContainer>
    </Flipper>
  )
}

export default App
