import React, { Component } from 'react'
import Flipper from '../Flipper'
import DefaultFlipped from '../Flipped'
import Gesture from './withGesture'
import { GestureContext } from '../Flipper'
import clamp from 'lodash-es/clamp'
import Spring from '../forked-rebound/Spring'
import {
  InProgressAnimations,
  GestureParams,
  SetIsGestureControlled
} from '../Flipper/types'
import {
  OnNonSwipeClick,
  GestureFlippedProps,
  GestureEventHandlers
} from './types'
export { Flipper }

const defaultCompleteThreshhold = 0.99

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
  throw new Error('direction was not recognized')
}

const finishFlip = ({
  inProgressAnimations,
  velocity,
  onFinished
}: {
  inProgressAnimations: InProgressAnimations
  velocity: number
  onFinished?: () => void
}) => {
  const clampedVelocity = velocity !== undefined && clamp(velocity, 0.025, 15)
  const onFinishedPromises = Object.keys(inProgressAnimations)
    .map(flipId => {
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
    .filter(Boolean)
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

  const onCompletePromises: Array<Promise<unknown>> | [] = Object.keys(
    inProgressAnimations
  ).map(flipId => {
    const { spring } = inProgressAnimations[flipId]
    if (!spring) {
      return Promise.resolve()
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
        inProgressAnimations[flipId].spring!.destroy()
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
    inProgressAnimations[flipId].spring!.setEndValue(clampedPercentage)
  })
}

const getDirection = (deltaX: number, deltaY: number) => {
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    return deltaX > 0 ? 'right' : 'left'
  }
  return deltaY > 0 ? 'down' : 'up'
}

export class Flipped extends Component<GestureFlippedProps> {
  // maintain a list of flip ids that have a mousedown but not a mouseup event
  private temporarilyInvalidFlipIds: string[] = []
  private prevProps = {}
  private flipInitiatorData = null

  componentDidMount() {
    this.gestureHandler = this.gestureHandler.bind(this)
  }

  componentDidUpdate(prevProps: Object) {
    this.prevProps = prevProps
  }

  gestureHandler({
    inProgressAnimations,
    setIsGestureControlled,
    onNonSwipeClick = () => {}
  }: {
    inProgressAnimations: InProgressAnimations
    setIsGestureControlled: SetIsGestureControlled
    onNonSwipeClick?: OnNonSwipeClick
  }) {
    return ({
      velocity,
      delta: [deltaX, deltaY],
      down,
      first
    }: {
      velocity: number
      delta: number[]
      down: boolean
      first: boolean
    }) => {
      const gestureIsSimpleClick =
        down === false && Math.abs(deltaX) < 2 && Math.abs(deltaY) < 2
      if (gestureIsSimpleClick) {
        onNonSwipeClick()
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

      const gestureIsTooSmallToTriggerFLIP =
        Math.abs(deltaX) + Math.abs(deltaY) < 3

      if (!flipInProgress && gestureIsTooSmallToTriggerFLIP) {
        return
      }

      const currentDirection = getDirection(deltaX, deltaY)

      const anotherGestureIsInProgress = Object.keys(inProgressAnimations)
        .map(flipId => inProgressAnimations[flipId].flipInitiator)
        .filter(Boolean)
        .some(flipInitiator => flipInitiator !== this.props.flipId)

      if (anotherGestureIsInProgress) {
        console.log('foo')
        Object.keys(inProgressAnimations).forEach(flipId =>
          inProgressAnimations[flipId].stop()
        )
      }

      const initiateGestureControlledFLIP = () => {
        const normalizedRespondToGesture = isArray(this.props.flipOnSwipe)
          ? this.props.flipOnSwipe
          : [this.props.flipOnSwipe]

        let configMatchingCurrentDirection = normalizedRespondToGesture.filter(
          config => config && config.direction === currentDirection
        )[0]

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

        // we have to cache all config BEFORE calling initFLIP
        // which can dramatically change the UI and/or the FLIP config
        // that the component has
        this.flipInitiatorData = {
          cachedConfig: configMatchingCurrentDirection,
          id: this.props.flipId
        }

        configMatchingCurrentDirection.initFLIP({
          props: this.props,
          prevProps: this.prevProps
        })

        const afterFLIPHasBeenInitiated = () => {
          // maybe gesture occurred but nothing changed position
          if (!inProgressAnimations[this.props.flipId]) {
            delete this.flipInitiatorData
            return
          }

          Object.keys(inProgressAnimations).forEach(
            inProgressAnimationFlipId => {
              inProgressAnimations[
                inProgressAnimationFlipId
              ].flipInitiator = this.props.flipId
            }
          )
        }

        setTimeout(afterFLIPHasBeenInitiated, 0)
      }

      if (!flipInProgress) {
        return initiateGestureControlledFLIP()
      }
      if (!this.flipInitiatorData) return

      // animations are not interruptible while an animation is completing
      // this helps prevent some bugs that I couldn't otherwise solve
      // // maybe this can be revisited in the future
      // if (
      //   Object.keys(inProgressAnimations).some(
      //     k => inProgressAnimations[k].isFinishing
      //   )
      // ) {
      //   return
      // }

      const returnToUnFlippedState = () => {
        cancelFlip({
          velocity,
          inProgressAnimations,
          onFlipCancelled: () => {
            setIsGestureControlled(false)
            this.flipInitiatorData &&
              this.flipInitiatorData.cachedConfig.cancelFLIP({
                props: this.props,
                prevProps: this.prevProps
              })
            delete this.flipInitiatorData
          }
        })
      }

      if (this.flipInitiatorData!.cachedConfig.direction !== currentDirection) {
        // user might have done a mouseup while moving in another direction
        if (flipInProgress && !down) {
          returnToUnFlippedState()
        }
        return
      }

      const absoluteMovement = getMovementScalar({
        deltaX,
        deltaY,
        direction: this.flipInitiatorData.cachedConfig.direction
      })

      const gestureData = inProgressAnimations[this.props.flipId]

      const {
        translateXDifference,
        translateYDifference,
        scaleXDifference,
        scaleYDifference
      } = gestureData.difference

      const difference =
        ['up', 'down'].indexOf(this.flipInitiatorData.cachedConfig.direction) >
        -1
          ? scaleYDifference + translateYDifference
          : scaleXDifference + translateXDifference

      const percentage = absoluteMovement / difference

      // abort flip -- this is interruptible if user
      // tries to drag before animation is completed
      if (
        !down &&
        percentage < this.flipInitiatorData.cachedConfig.completeThreshold
      ) {
        return returnToUnFlippedState()
      }

      // gesture has gone far enough, animation can complete
      if (percentage > this.flipInitiatorData.cachedConfig.completeThreshold) {
        inProgressAnimations[this.props.flipId].isFinishing = true
        this.temporarilyInvalidFlipIds.push(String(this.props.flipId))
        return finishFlip({
          velocity,
          inProgressAnimations,
          onFinished: () => {
            delete this.flipInitiatorData
            setIsGestureControlled(false)
          }
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

    if (flipOnSwipe || this.flipInitiatorData) {
      return (
        <GestureContext.Consumer>
          {({
            inProgressAnimations,
            setIsGestureControlled,
            isGestureControlled
          }: GestureParams) => {
            return (
              <Gesture
                onAction={this.gestureHandler({
                  inProgressAnimations,
                  setIsGestureControlled,
                  onNonSwipeClick
                })}
              >
                {(gestureHandlers: GestureEventHandlers) => {
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
