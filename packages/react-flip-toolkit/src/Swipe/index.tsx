import React, { Component, cloneElement } from 'react'
import { GestureContext, GestureContextProps } from '../Flipper/context'
import PropTypes from 'prop-types'
import Swipe from '../FlipToolkit/Swipe'
import { SwipeProps } from '../FlipToolkit/Swipe/types'

type SwipeComponentProps = SwipeProps & {
  children: React.ReactElement
}

class SwipeComponent extends Component<SwipeComponentProps> {
  processProps = (props: SwipeComponentProps) => {
    return {
      ...props,
      flipId: props.flipId
        ? String(props.flipId)
        : String(props.children.props.flipId)
    }
  }

  componentDidUpdate(prevProps: SwipeComponentProps) {
    this.swipe.props = this.processProps(this.props)
    this.swipe.prevProps = this.processProps(prevProps)
  }

  swipe = new Swipe(this.processProps(this.props))

  render() {
    React.Children.only(this.props.children)
    // @ts-ignore
    if (this.props.children.type.displayName === 'Flipped') {
      return cloneElement(this.props.children, {
        gestureHandlers: this.swipe.handlers
      })
    }
    return cloneElement(this.props.children, this.swipe.handlers)
  }
}

export default function SwipeWrapper(props: SwipeComponentProps) {
  return (
    <GestureContext.Consumer>
      {(p: GestureContextProps) => {
        return (
          // @ts-ignore
          <SwipeComponent
            inProgressAnimations={p.inProgressAnimations}
            setIsGestureInitiated={p.setIsGestureInitiated}
            {...props}
          />
        )
      }}
    </GestureContext.Consumer>
  )
}

if (process.env.NODE_ENV !== 'production') {
  const configPropTypes = PropTypes.oneOfType([
    PropTypes.shape({
      initFlip: PropTypes.func,
      cancelFlip: PropTypes.func,
      threshold: PropTypes.number
    }),
    PropTypes.bool
  ])

  SwipeWrapper.propTypes = {
    children: PropTypes.node.isRequired,
    flipId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    touchOnly: PropTypes.bool,
    onClick: PropTypes.func,
    onUp: PropTypes.func,
    onDown: PropTypes.func,
    threshold: PropTypes.number,
    right: configPropTypes,
    left: configPropTypes,
    top: configPropTypes,
    bottom: configPropTypes
  }
}
