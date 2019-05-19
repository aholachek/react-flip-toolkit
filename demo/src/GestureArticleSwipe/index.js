import React, { useState } from 'react'
import { Flipper } from '../../../src'
import { Flipped } from '../../../src/gesture'
import styled from 'styled-components'

const StyledLi = styled.li`
  position: relative;
  list-style-type: none;
  display: flex;
  justify-content: space-between;
  height: 10rem;
  margin-bottom: 0.5rem;
  min-height: 5rem;
`

const StyledCollapsedArticle = styled.a`
  width: 100%;
  height: 100%;
  background-color: white;
  border: 1px solid gray;
  margin-bottom: 0.5rem;
  padding: 1rem;
  cursor: pointer;
  width: 100%;
  height: 100%;
  display: block;
  position: relative;
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

const StyledExpandedArticle = styled.a`
  z-index: 1;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 100%;
  background: white;
  border: 1px solid gray;
`

const ExpandedListItem = ({
  id,
  title,
  description,
  returnToListView,
  setCurrentlyViewed
}) => {
  const cancelFLIP = ({ prevProps }) => {
    return updatePosition({
      position: prevProps.position,
      id: article.id
    })
  }
  return (
    <Flipped
      flipId={`article-${id}`}
      respondToGesture={{
        direction: 'down',
        initFLIP: returnToListView,
        cancelFLIP: () => setCurrentlyViewed(id)
      }}
    >
      <StyledExpandedArticle>
        <h1>{title}</h1>
        <p>{id}</p>
        <p>{description}</p>
      </StyledExpandedArticle>
    </Flipped>
  )
}

const ArticleListItem = ({ setCurrentlyViewed, article }) => {
  return (
    <Flipped
      flipId={`article-${article.id}`}
      onStart={el => {
        el.style.zIndex = 2
      }}
      onComplete={el => {
        el.style.zIndex = null
      }}
    >
      <StyledCollapsedArticle
        href="#"
        onClick={e => {
          e.preventDefault()
          setCurrentlyViewed(article.id)
        }}
      >
        <h3>{article.title}</h3>
        <p>{article.id}</p>
      </StyledCollapsedArticle>
    </Flipped>
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
          {articles.map(article => (
            <StyledLi key={article.id}>
              {article.id !== currentlyViewed && (
                <ArticleListItem
                  article={article}
                  setCurrentlyViewed={setCurrentlyViewed}
                />
              )}
            </StyledLi>
          ))}
        </StyledList>
        {currentlyViewed !== null && (
          <ExpandedListItem
            setCurrentlyViewed={setCurrentlyViewed}
            returnToListView={returnToListView}
            {...articles.find(({ id }) => id === currentlyViewed)}
          />
        )}
      </StyledContainer>
    </Flipper>
  )
}

export default App
