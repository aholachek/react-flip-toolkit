import React, { useReducer } from 'react'
import { Flipper, Flipped } from '../../../src/gesture'
import styled from 'styled-components'

const actionMixin = props => `
display: flex;
justify-content: center;
align-items: center;
width: 40%;
`

const Favorite = styled.div`
  background-color: blue;
  ${actionMixin};
`
const Trash = styled.div`
  background-color: red;
  ${actionMixin};
`

const MessageContainer = styled.div`
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
  box-shadow: 0 2px 4px hsla(0, 0%, 0%, 0.3);
  background-color: white;
  padding: 1rem;
  cursor: grab;
  z-index: 1;
`

const StyledLi = styled.li`
  position: relative;
  list-style-type: none;
  display: flex;
  justify-content: space-between;
  height: 10rem;
  margin-bottom: 0.5rem;
`

const StyledList = styled.ul`
  width: 100%;
  max-width: 30rem;
  margin: 0 auto;
  overflow: hidden;
  padding: 0;
`

const ListItem = ({ updatePosition, position, email }) => {
  const cancelFLIP = ({ prevProps }) => {
    return updatePosition({
      position: prevProps.position,
      id: email.id
    })
  }
  return (
    <StyledLi>
      <Flipped flipId={`${email.id}-favorite`}>
        <Favorite position={position}> favorite </Favorite>
      </Flipped>
      <Flipped
        flipId={`${email.id}-message`}
        position={position}
        respondToGesture={[
          {
            direction: 'left',
            initFLIP: ({ props }) => {
              if (props.position === 'center')
                return updatePosition({ position: 'left', id: email.id })
              if (props.position === 'right')
                return updatePosition({ position: 'center', id: email.id })
            },
            cancelFLIP
          },
          {
            direction: 'right',
            initFLIP: ({ props }) => {
              if (props.position === 'center')
                return updatePosition({ position: 'right', id: email.id })
              if (props.position === 'left')
                return updatePosition({ position: 'center', id: email.id })
            },
            cancelFLIP
          }
        ]}
      >
        <MessageContainer position={position}>
          <h3>{email.title}</h3>
        </MessageContainer>
      </Flipped>
      <Flipped flipId={`${email.id}-trash`}>
        <Trash position={position}> trash </Trash>
      </Flipped>
    </StyledLi>
  )
}

const reducer = (state, { position, id }) => {
  return { ...state, [id]: position }
}

const emails = [
  { title: 'Foo', id: 1 },
  { title: 'Foo', id: 2 },
  { title: 'Foo', id: 3 }
]

const App = () => {
  const initialState = emails
    .map(({ id }) => id)
    .reduce((acc, curr) => {
      return { ...acc, [curr]: 'center' }
    }, {})

  const [state, updatePosition] = useReducer(reducer, initialState)

  return (
    <Flipper flipKey={JSON.stringify(state)}>
      <StyledList>
        {emails.map(email => (
          <ListItem
            key={email.id}
            email={email}
            position={state[email.id]}
            updatePosition={updatePosition}
          />
        ))}
      </StyledList>
    </Flipper>
  )
}

export default App
