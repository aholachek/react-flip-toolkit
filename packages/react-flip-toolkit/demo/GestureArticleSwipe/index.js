import React, { useState, useRef, useEffect } from 'react'
import { Flipper, Flipped, Swipe } from '../../src'
import styled from 'styled-components'
import { css } from '@emotion/core'

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
  position: absolute;
`

const Favorite = styled.div`
  ${actionMixin};
  left: 0;
`
const Trash = styled.div`
  ${actionMixin};
  right: 0;
`

const StyledCollapsedArticleContainer = styled(Flipper)`
  position: relative;
  width: 100%;
  height: 100%;
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
  position: relative;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  left: ${props =>
    props.isGettingDeleted ? `110%` : props.isGettingStarred ? '-50%' : 0};
`

const StyledList = styled.ul`
  padding: 0;
  margin: 0;
  transform: ${props => (props.currentlyViewed ? 'scale(.85)' : 'scale(1)')};
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
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

const Drawer = ({ article, setCurrentlyViewed }) => {
  const previousArticle = usePrevious(article)
  const articleToRender = article || previousArticle
  return (
    <Swipe
      down={{
        initFlip: () => {
          setCurrentlyViewed(null)
        },
        cancelFlip: () => {
          console.log('cancelling flip')
          setCurrentlyViewed(article.id)
        }
      }}
    >
      <Flipped flipId="drawer">
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
    </Swipe>
  )
}

const ArticleListItem = ({
  setCurrentlyViewed,
  article,
  currentlyViewed,
  deleteArticle,
  toggleArticleStarred
}) => {
  const [isGettingDeleted, setIsGettingDeleted] = useState(false)
  const [isGettingStarred, setIsGettingStarred] = useState(false)

  const callOnce = (func, threshold) => {
    let isCalled = false
    return springVal => {
      if (springVal >= threshold && !isCalled) {
        isCalled = true
        func()
      }
    }
  }
  return (
    <StyledCollapsedArticleContainer
      flipKey={`${isGettingDeleted} ${isGettingStarred}`}
    >
      <Swipe
        right={{
          initFlip: () => setIsGettingDeleted(true),
          cancelFlip: () => setIsGettingDeleted(false)
        }}
        left={{
          initFlip: () => setIsGettingStarred(true),
          cancelFlip: () => setIsGettingStarred(false)
        }}
        onClick={e => {
          console.log('on click!', currentlyViewed)
          setCurrentlyViewed(article.id)
        }}
      >
        <Flipped
          flipId={`article-${article.id}`}
          onSpringUpdate={callOnce(() => {
            if (isGettingDeleted) {
              deleteArticle(article.id)
            }
          }, 0.85)}
          onComplete={() => {
            if (isGettingStarred) {
              toggleArticleStarred(article.id)
              setIsGettingStarred(false)
            }
          }}
        >
          <StyledCollapsedArticle
            currentlyViewed={currentlyViewed}
            isGettingDeleted={isGettingDeleted}
            isGettingStarred={isGettingStarred}
            href="#"
          >
            {article.starred && 'i am starred'}
            <h3>{article.title}</h3>
            <p>{article.id}</p>
          </StyledCollapsedArticle>
        </Flipped>
      </Swipe>
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
  const [visibleArticles, setVisibleArticles] = useState(articles)

  const article = articles.find(article => article.id === currentlyViewed)

  const deleteArticle = id => {
    setVisibleArticles(prevState => {
      return prevState.filter(({ id: articleId }) => id !== articleId)
    })
  }

  const toggleArticleStarred = id => {
    setVisibleArticles(prevState => {
      return prevState.map(article => {
        if (article.id === id) {
          return Object.assign({}, article, { starred: !article.starred })
        }
        return article
      })
    })
  }

  return (
    <StyledFlipper
      flipKey={`${currentlyViewed}-${visibleArticles.map(a => a.id)}`}
    >
      <StyledContainer>
        <StyledList currentlyViewed={currentlyViewed}>
          {visibleArticles.map(article => (
            <StyledLi key={article.id}>
              {
                <ArticleListItem
                  article={article}
                  currentlyViewed={currentlyViewed}
                  setCurrentlyViewed={setCurrentlyViewed}
                  deleteArticle={deleteArticle}
                  toggleArticleStarred={toggleArticleStarred}
                />
              }
            </StyledLi>
          ))}
        </StyledList>
      </StyledContainer>
      <Drawer article={article} setCurrentlyViewed={setCurrentlyViewed} />
    </StyledFlipper>
  )
}

export default App
