import React, { useState, useRef, useEffect } from 'react'
import { Flipper } from '../../../src'
import { Flipped } from '../../../src/gesture'
import styled, { css } from 'styled-components'

const StyledFlipper = styled(Flipper)`
  position: relative;
  width: 100%;
  max-width: 30rem;
  margin: 0 auto;
  overflow: hidden;
`

const StyledContainer = styled.div`
  background-color: #ececec;
  padding: 0.4rem;
  overflow: auto;
  height: 600px;
`

const StyledLi = styled.li`
  position: relative;
  list-style-type: none;
  height: 10rem;
  margin-bottom: 0.4rem;
  min-height: 5rem;
`

const actionMixin = props => css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40%;
`

const Favorite = styled.div`
  ${actionMixin};
`
const Trash = styled.div`
  ${actionMixin};
`

const StyledCollapsedArticleContainer = styled(Flipper)`
  position: relative;
  width: 100%;
  display: flex;
  height: 100%;
  justify-content: space-between;
`

const StyledCollapsedArticle = styled.div`
  z-index: 1;
  width: 100%;
  height: 100%;
  background-color: white;
  &:not(:last-of-type) {
    margin-bottom: 0.5rem;
  }
  padding: 1rem;
  cursor: pointer;
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  left: ${props =>
    props.position === 'left'
      ? `-10rem`
      : props.position === 'right'
      ? '10rem'
      : 0};
`

const StyledList = styled.ul`
  padding: 0;
  margin: 0;
  transform: ${props => (props.article ? 'scale(.85)' : 'scale(1)')};
  overflow: hidden;
`

const StyledDrawer = styled.div`
  z-index: 2;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 100%;
  background: white;
  cursor: ${({ article }) => (article ? 'grab' : 'pointer')};
  transform: ${({ article }) =>
    article ? 'translateY(0)' : 'translateY(100%)'};
`

const StyledDrawerContent = styled.div`
  user-select: none;
  opacity: ${({ article }) => (article ? 1 : 0)};
`

function usePrevious(value) {
  const ref = useRef()
  useEffect(
    () => {
      ref.current = value
    },
    [value]
  )
  return ref.current
}

const Drawer = ({ article, returnToListView, setCurrentlyViewed }) => {
  const previousArticle = usePrevious(article)
  const articleToRender = article || previousArticle
  return (
    <Flipped
      flipId="drawer"
      flipOnSwipe={{
        direction: 'down',
        initFLIP: returnToListView,
        cancelFLIP: () => {
          setCurrentlyViewed(article.id)
        }
      }}
    >
      <StyledDrawer article={article}>
        {articleToRender && (
          <Flipped flipId="article-text" opacity>
            <StyledDrawerContent article={article}>
              <h1>{articleToRender.title}</h1>
              <p>{articleToRender.id}</p>
              <p>{articleToRender.description}</p>
            </StyledDrawerContent>
          </Flipped>
        )}
      </StyledDrawer>
    </Flipped>
  )
}

const ArticleListItem = ({ setCurrentlyViewed, article }) => {
  const [position, setPosition] = useState('center')
  const cancelFLIP = ({ prevProps }) => {
    return setPosition(prevProps.position)
  }
  return (
    <StyledCollapsedArticleContainer flipKey={position}>
      <Flipped flipId={`${article.id}-favorite`}>
        <Favorite position={position}> favorite </Favorite>
      </Flipped>
      <Flipped
        position={position}
        flipId={`article-${article.id}`}
        flipOnSwipe={[
          {
            direction: 'left',
            initFLIP: ({ props }) => {
              if (props.position === 'center') return setPosition('left')
              if (props.position === 'right') return setPosition('center')
            },
            cancelFLIP
          },
          {
            direction: 'right',
            initFLIP: ({ props }) => {
              if (props.position === 'center') return setPosition('right')
              if (props.position === 'left') return setPosition('center')
            },
            cancelFLIP
          }
        ]}
        onNonSwipeClick={e => {
          setCurrentlyViewed(article.id)
        }}
      >
        <StyledCollapsedArticle position={position} href="#">
          <h3>{article.title}</h3>
          <p>{article.id}</p>
        </StyledCollapsedArticle>
      </Flipped>
      <Flipped flipId={`${article.id}-trash`}>
        <Trash position={position}> trash </Trash>
      </Flipped>
    </StyledCollapsedArticleContainer>
  )
}

const articles = [
  {
    title: 'Foo',
    id: 1,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },
  {
    title: 'Foo',
    id: 2,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },
  {
    title: 'Foo',
    id: 3,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },
  {
    title: 'Foo',
    id: 4,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  }
]

const App = () => {
  const [currentlyViewed, setCurrentlyViewed] = useState(null)

  const article = articles.find(article => article.id === currentlyViewed)

  const returnToListView = () => {
    setCurrentlyViewed(null)
  }

  return (
    <StyledFlipper flipKey={currentlyViewed}>
      <StyledContainer>
        <StyledList article={article}>
          {articles.map(article => (
            <StyledLi key={article.id}>
              {
                <ArticleListItem
                  article={article}
                  setCurrentlyViewed={setCurrentlyViewed}
                />
              }
            </StyledLi>
          ))}
        </StyledList>
      </StyledContainer>
      <Drawer
        article={article}
        returnToListView={returnToListView}
        setCurrentlyViewed={setCurrentlyViewed}
      />
    </StyledFlipper>
  )
}

export default App
