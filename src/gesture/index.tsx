import React, { Component } from 'react'
import Flipper from '../Flipper'
import DefaultFlipped from '../Flipped'
import { FlippedProps } from '../Flipped/types'
import Gesture from './withGesture'
import { GestureContext } from '../Flipper'
import clamp from 'lodash-es/clamp'
import { InProgressAnimations } from '../../Flipper/types'
import { GestureParams } from './types'
import Spring from '../../forked-rebound/Spring'
import { InProgressAnimations } from '../Flipper/types'

export { Flipper }

const defaultCompleteThreshhold = 0.5

const isArray = (x: any): x is any[] =>
  Object.prototype.toString.call(x) === '[object Array]'

const getMovementScalar = ({
  deltaX,
  deltaY,
  direction
}: {
  deltaX: number
  deltaY: number
  direction: 'up' | 'down' | 'left' | 'right'
}) => {
  if (direction === 'up') {
    return -deltaY
  } else if (direction === 'down') {
    return deltaY
  } else if (direction === 'left') {
    return -deltaX
  } else if (direction === 'right') {
    return deltaX
  }
}

const finishFlip = ({
  inProgressAnimations,
  velocity,
  onFinished
}: {
  inProgressAnimations: InProgressAnimations
  velocity: number
}) => {
  const clampedVelocity = velocity !== undefined && clamp(velocity, 0.025, 15)
  const onFinishedPromises = Object.keys(inProgressAnimations).map(flipId => {
    const { spring, onAnimationEnd } = inProgressAnimations[flipId]
    if (!spring) {
      return
    }
    if (clampedVelocity) {
      spring.setVelocity(clampedVelocity)
    }
    spring.setEndValue(1)
    return new Promise(resolve => {
      spring.addOneTimeListener({
        onSpringAtRest: (spring: Spring) => {
          // if not 1, assume this has been interrupted by subsequent gesture
          if (spring.getCurrentValue() !== 1) {
            return
          }
          resolve()
          onAnimationEnd()
          spring.destroy()
        }
      })
    })
  })
  return Promise.all(onFinishedPromises).then(onFinished)
}

const cancelFlip = ({
  velocity,
  inProgressAnimations,
  onFlipCancelled
}: {
  velocity: number
  inProgressAnimations: InProgressAnimations
  onFlipCancelled: () => void
}) => {
  const clampedVelocity = velocity !== undefined && clamp(velocity, 0.025, 30)

  const onCompletePromises: Array<Promise<void>> | [] = Object.keys(
    inProgressAnimations
  ).map(flipId => {
    const { spring } = inProgressAnimations[flipId]
    if (!spring) {
      return
    }
    if (clampedVelocity) {
      spring.setVelocity(clampedVelocity)
    }

    spring.setEndValue(0)
    return new Promise(resolve => {
      spring.addOneTimeListener({
        onSpringAtRest: (spring: Spring) => {
          // if not 0, assume this has been interrupted by subsequent gesture
          if (spring.getCurrentValue() !== 0) {
            return
          }
          resolve()
        }
      })
    })
  })
  // wait until the end to destroy springs so you don't accidentally destroy some of them
  // and keep others around
  Promise.all(onCompletePromises).then(() => {
    // this can be triggered multiple times so try to bail out if thats the case
    // TODO: figure out a cleaner way to handle
    if (!Object.keys(inProgressAnimations).length) {
      return
    }
    Object.keys(inProgressAnimations).map(flipId => {
      if (inProgressAnimations[flipId]) {
        inProgressAnimations[flipId].spring.destroy()
        delete inProgressAnimations[flipId]
      }
    })
    onFlipCancelled()
  })
}

const updateSprings = ({
  inProgressAnimations,
  percentage
}: {
  inProgressAnimations: InProgressAnimations
  percentage: number
}) => {
  const clampedPercentage = clamp(percentage, 0, 1)
  Object.keys(inProgressAnimations).forEach(flipId => {
    inProgressAnimations[flipId].spring.setEndValue(clampedPercentage)
  })
}

const getDirection = (deltaX: number, deltaY: number) => {
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    return deltaX > 0 ? 'right' : 'left'
  }
  return deltaY > 0 ? 'down' : 'up'
}

export class Flipped extends Component {
  // maintain a list of flip ids that have a mousedown but not a mouseup event
  temporarilyInvalidFlipIds: string[] = []
  componentDidMount() {
    this.gestureHandler = this.gestureHandler.bind(this)
  }

  componentDidUpdate(prevProps) {
    this.prevProps = prevProps
  }

  gestureHandler({
    inProgressAnimations,
    setIsGestureControlled,
    onNonSwipeClick
  }) {
    return ({
      velocity,
      delta: [deltaX, deltaY],
      down,
      first,
      event
    }: {
      velocity: number
      delta: number[]
      down: boolean
      first: boolean
    }) => {
      if (down === false && Math.abs(deltaX) < 2 && Math.abs(deltaY) < 2) {
        if (onNonSwipeClick) {
          onNonSwipeClick(event)
        }
        return
      }
      if (
        first &&
        this.temporarilyInvalidFlipIds.indexOf(this.props.flipId) !== -1
      ) {
        this.temporarilyInvalidFlipIds.splice(
          this.temporarilyInvalidFlipIds.indexOf(this.props.flipId),
          1
        )
      } else if (
        this.temporarilyInvalidFlipIds.indexOf(this.props.flipId) !== -1
      ) {
        // require user to mouseup before doing another action
        return
      }
      const flipInProgress = Boolean(inProgressAnimations[this.props.flipId])

      // prevent single clicks or tiny gestures from doing anything
      if (
        first ||
        (!flipInProgress && Math.abs(deltaX) + Math.abs(deltaY) < 4)
      ) {
        return
      }

      const currentDirection = getDirection(deltaX, deltaY)

      const isAnotherGestureInProgress = Object.keys(inProgressAnimations)
        .map(flipId => inProgressAnimations[flipId].flipInitiator)
        .filter(Boolean)
        .some(flipInitiator => flipInitiator !== this.props.flipId)

      if (isAnotherGestureInProgress) {
        return
      }

      if (!flipInProgress) {
        const normalizedRespondToGesture = isArray(this.props.flipOnSwipe)
          ? this.props.flipOnSwipe
          : [this.props.flipOnSwipe]

        let configMatchingCurrentDirection = normalizedRespondToGesture.filter(
          config => config && config.direction === currentDirection
        )[0]

        // user function didn't respond with an object when called
        // with the currentDirection + props
        // likely bc whatever happened shouldnt be animated
        if (!configMatchingCurrentDirection) {
          return
        }

        configMatchingCurrentDirection = {
          // can be overridden
          completeThreshold: defaultCompleteThreshhold,
          ...configMatchingCurrentDirection,
          direction: currentDirection
        }

        setIsGestureControlled(true)

        configMatchingCurrentDirection.initFLIP({
          props: this.props,
          prevProps: this.prevProps
        })
        setTimeout(() => {
          // maybe gesture occurred but nothing changed position
          if (!inProgressAnimations[this.props.flipId]) {
            return
          }
          // cache this because it will likely change in the beginning of FLIP
          // when react re-renders the component
          inProgressAnimations[
            this.props.flipId
          ].cachedConfig = configMatchingCurrentDirection
          Object.keys(inProgressAnimations).forEach(
            inProgressAnimationFlipId => {
              inProgressAnimations[
                inProgressAnimationFlipId
              ].flipInitiator = this.props.flipId
            }
          )
        }, 0)
        return
      }

      // maybe animation just got started (?)
      if (
        !inProgressAnimations[this.props.flipId] ||
        !inProgressAnimations[this.props.flipId].cachedConfig
      ) {
        return
      }
      // animations are not interruptible while an animation is completing
      // this helps prevent some bugs that I couldn't otherwise solve
      // maybe this can be revisited in the future
      if (inProgressAnimations[this.props.flipId].isFinishing) {
        return
      }

      const cachedConfig = inProgressAnimations[this.props.flipId].cachedConfig

      const returnToUnFlippedState = () =>
        cancelFlip({
          velocity,
          inProgressAnimations,
          onFlipCancelled: () => {
            setIsGestureControlled(false)
            cachedConfig.cancelFLIP({
              props: this.props,
              prevProps: this.prevProps
            })
          }
        })

      if (cachedConfig.direction !== currentDirection) {
        // user might have done a mouseup while moving in another direction
        if (flipInProgress && !down) {
          returnToUnFlippedState()
        }
      }

      const absoluteMovement = getMovementScalar({
        deltaX,
        deltaY,
        direction: cachedConfig.direction
      })

      const gestureData = inProgressAnimations[this.props.flipId]

      const {
        translateXDifference,
        translateYDifference,
        scaleXDifference,
        scaleYDifference
      } = gestureData.difference

      const difference =
        ['up', 'down'].indexOf(cachedConfig.direction) > -1
          ? scaleYDifference + translateYDifference
          : scaleXDifference + translateXDifference

      const percentage = absoluteMovement / difference

      // abort flip -- this is interruptible if user
      // tries to drag before animation is completed
      if (!down && percentage < cachedConfig.completeThreshold) {
        return returnToUnFlippedState()
      }

      // gesture has gone far enough, animation can complete
      if (percentage > cachedConfig.completeThreshold) {
        inProgressAnimations[this.props.flipId].isFinishing = true
        this.temporarilyInvalidFlipIds.push(this.props.flipId)
        return finishFlip({
          velocity,
          inProgressAnimations,
          onFinished: () => setIsGestureControlled(false)
        })
      }

      return updateSprings({
        percentage,
        inProgressAnimations
      })
    }
  }

  render() {
    const { flipOnSwipe, onNonSwipeClick, ...rest } = this.props

    const defaultFlipped = <DefaultFlipped {...rest} />

    if (flipOnSwipe) {
      return (
        <GestureContext.Consumer>
          {({
            inProgressAnimations,
            setIsGestureControlled,
            isGestureControlled
          }: {
            inProgressAnimations: InProgressAnimations
            setIsGestureControlled: (isGestureControlled: boolean) => void
            isGestureControlled: boolean
          }) => {
            return (
              <Gesture
                onAction={this.gestureHandler({
                  inProgressAnimations,
                  setIsGestureControlled,
                  onNonSwipeClick
                })}
              >
                {gestureHandlers => {
                  return (
                    <DefaultFlipped
                      {...rest}
                      isGestureControlled={isGestureControlled}
                      gestureHandlers={gestureHandlers}
                    />
                  )
                }}
              </Gesture>
            )
          }}
        </GestureContext.Consumer>
      )
    }
    return defaultFlipped
  }
}

// for umd build
export default {
  Flipper,
  Flipped
}
