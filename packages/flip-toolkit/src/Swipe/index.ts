import gestureHandlers from './gestureHandlers'
import Spring from '../forked-rebound/Spring'
import { InProgressAnimations, FlipId } from '../types'
import {
  SwipeProps,
  SwipeEventHandlers,
  OnActionArgs,
  Direction,
  FlipInitiatorData
} from './types'

const defaultCompleteThreshhold = 0.2

const getMovementScalar = ({
  deltaX,
  deltaY,
  direction
}: {
  deltaX: number
  deltaY: number
  direction: Direction
}) => {
  const normalized = {
    up: -deltaY,
    down: deltaY,
    left: -deltaX,
    right: deltaX
  }
  return normalized[direction]
}

const finishFlip = ({
  inProgressAnimations,
  deleteFlipInitiatorData,
  flipInitiator,
  velocity = 1
}: {
  inProgressAnimations: InProgressAnimations
  deleteFlipInitiatorData: () => void
  flipInitiator: FlipId
  velocity: number
}) => {
  const onFinishedPromises = Object.keys(inProgressAnimations)
    .map(flipId => {
      const { spring, onAnimationEnd } = inProgressAnimations[flipId]
      if (!spring) {
        return
      }
      console.log({ velocity })
      spring.setVelocity(velocity).setEndValue(1)

      return new Promise(resolve => {
        spring.addOneTimeListener({
          onSpringAtRest: (spring: Spring) => {
            // it was interrupted by another animation
            if (
              inProgressAnimations[flipId] &&
              inProgressAnimations[flipId].flipInitiator !== flipInitiator
            ) {
              return deleteFlipInitiatorData()
            }
            // if not 1, assume this has been interrupted by subsequent gesture animation
            if (spring.getCurrentValue() !== 1) {
              return deleteFlipInitiatorData()
            }
            resolve()
            onAnimationEnd!()
            spring.destroy()
          }
        })
      })
    })
    .filter(Boolean)
  return Promise.all(onFinishedPromises).then(deleteFlipInitiatorData)
}

const cancelFlip = ({
  velocity = 1,
  inProgressAnimations,
  onFlipCancelled
}: {
  velocity: number
  inProgressAnimations: InProgressAnimations
  onFlipCancelled: () => void
}) => {
  const onCompletePromises: Array<Promise<void>> = Object.keys(
    inProgressAnimations
  ).map(flipId => {
    const { spring } = inProgressAnimations[flipId]
    if (!spring) {
      return Promise.resolve()
    }

    spring.setVelocity(velocity)

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
        if (inProgressAnimations[flipId].spring) {
          inProgressAnimations[flipId].spring!.destroy()
        }
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
  Object.keys(inProgressAnimations).forEach(flipId => {
    // might not have a spring if the element is just entering or exiting
    if (!inProgressAnimations[flipId].spring) return
    inProgressAnimations[flipId].spring.setEndValue(percentage)
  })
}

const getDirection = (deltaX: number, deltaY: number) => {
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    return deltaX > 0 ? 'right' : 'left'
  }
  return deltaY > 0 ? 'down' : 'up'
}

class Swipe {
  constructor(public props: SwipeProps) {}
  // prevent people from using the same gesture to do multiple things
  private isCompletingFlipIds: string[] = []
  private flipInitiatorData: FlipInitiatorData | undefined = undefined

  public prevProps = {}

  handlers: SwipeEventHandlers = gestureHandlers({
    onAction: this.onAction.bind(this),
    config: this.props
  }) as SwipeEventHandlers

  onAction({
    velocity,
    delta: [deltaX, deltaY],
    down,
    first,
    event
  }: OnActionArgs) {
    const {
      inProgressAnimations,
      onClick,
      setIsGestureInitiated,
      ...rest
    } = this.props

    const flipId = String(this.props.flipId)

    // previous animation was probably cancelled
    if (
      this.flipInitiatorData &&
      inProgressAnimations[flipId] &&
      // if flipInitiator is undefined, this could be right before
      // afterFlipHasBeenInitiated gets called
      // and adds a flipInitiator id
      inProgressAnimations[flipId].flipInitiator &&
      inProgressAnimations[flipId].flipInitiator !== flipId
    ) {
      delete this.flipInitiatorData
    }

    const gestureFlipOnThisElementInProgress =
      Boolean(this.flipInitiatorData) && inProgressAnimations[flipId]

    const onFlipCancelled = () => {
      this.flipInitiatorData &&
        this.flipInitiatorData.cancelFlip({
          props: this.props,
          prevProps: this.prevProps
        })
      delete this.flipInitiatorData
    }

    const gestureIsSimpleClick =
      down === false && Math.abs(deltaX) < 3 && Math.abs(deltaY) < 3
    if (gestureIsSimpleClick) {
      if (gestureFlipOnThisElementInProgress) {
        const animationIsCancelling =
          this.isCompletingFlipIds.indexOf(flipId) === -1
        if (animationIsCancelling) {
          onFlipCancelled()
        }
      }
      if (onClick) return onClick(event)
    }

    if (first) {
      this.isCompletingFlipIds = []
    } else if (this.isCompletingFlipIds.indexOf(flipId) > -1) {
      // require user to mouseup before doing another action
      return
    }

    if (!inProgressAnimations) {
      // developer probably didn't update the flipKey properly after a gesture
      return
    }
    const generalFlipInProgress = Boolean(inProgressAnimations[flipId])

    const gestureIsTooSmallToTriggerFLIP =
      Math.abs(deltaX) + Math.abs(deltaY) < 3

    if (!gestureFlipOnThisElementInProgress && gestureIsTooSmallToTriggerFLIP) {
      return
    }

    // TODO: figure out why the typings don't work :/
    const config = Object.keys(Direction)
      .map(direction => {
        // @ts-ignore
        if (!rest[direction]) return null
        return Object.assign(
          {
            direction,
            threshold: this.props.threshold || defaultCompleteThreshhold
          },
          // @ts-ignore
          rest[direction]
        )
      })
      .filter(Boolean)

    const initiateGestureControlledFLIP = (
      configMatchingCurrentDirection: FlipInitiatorData
    ) => {
      // we have to cache all config BEFORE calling initFlip
      // which can dramatically change the UI and/or the FLIP config
      // that the component has
      // copying it for safety but maybe that isnt necessary
      this.flipInitiatorData = Object.assign({}, configMatchingCurrentDirection)

      setIsGestureInitiated(true)
      configMatchingCurrentDirection.initFlip({
        props: this.props,
        prevProps: this.prevProps
      })

      // must call this func this after getSnapshotBeforeUpdate has run!
      const afterFLIPHasBeenInitiated = () => {
        // maybe gesture occurred but nothing changed position
        if (!inProgressAnimations[flipId]) {
          delete this.flipInitiatorData
          return
        }

        Object.keys(inProgressAnimations).forEach(inProgressAnimationFlipId => {
          inProgressAnimations[inProgressAnimationFlipId].flipInitiator = flipId
        })
      }
      setTimeout(afterFLIPHasBeenInitiated, 0)
    }

    const currentDirection = getDirection(deltaX, deltaY)

    if (!gestureFlipOnThisElementInProgress) {
      const configMatchingCurrentDirection = config.filter(
        configEntry => configEntry.direction === currentDirection
      )[0]

      if (!configMatchingCurrentDirection) {
        return
      }
      return initiateGestureControlledFLIP(configMatchingCurrentDirection)
    }

    const gestureData = inProgressAnimations[flipId]

    if (!this.flipInitiatorData) {
      console.warn('flip initiator data missing')
      return
    }

    const returnToUnFlippedState = () => {
      cancelFlip({
        velocity,
        inProgressAnimations,
        onFlipCancelled
      })
    }

    if (this.flipInitiatorData!.direction !== currentDirection) {
      // user might have done a mouseup while moving in another direction
      if (generalFlipInProgress && !down) {
        returnToUnFlippedState()
        return
      }
    }

    const absoluteMovement = getMovementScalar({
      deltaX,
      deltaY,
      direction: this.flipInitiatorData.direction
    })

    // user might have switched direction mid-gesture and have brought element back to original position
    if (absoluteMovement < 0) {
      return onFlipCancelled()
    }

    const {
      translateXDifference,
      translateYDifference,
      scaleXDifference,
      scaleYDifference
    } = gestureData.difference

    const difference =
      ['up', 'down'].indexOf(this.flipInitiatorData.direction) > -1
        ? scaleYDifference + translateYDifference
        : scaleXDifference + translateXDifference

    const percentage = absoluteMovement / difference

    // abort flip -- this is interruptible if user
    // tries to drag before animation is completed
    if (!down && percentage < this.flipInitiatorData.threshold) {
      return returnToUnFlippedState()
    }

    // gesture has gone far enough, animation can complete
    if (percentage > this.flipInitiatorData.threshold) {
      this.isCompletingFlipIds.push(String(flipId))
      return finishFlip({
        flipInitiator: flipId,
        velocity,
        inProgressAnimations,
        deleteFlipInitiatorData: () => delete this.flipInitiatorData
      })
    }
    updateSprings({
      percentage,
      inProgressAnimations
    })
  }
}

export default Swipe
