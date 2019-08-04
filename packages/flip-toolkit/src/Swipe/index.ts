import gestureHandlers from './gestureHandlers'
import Spring from '../forked-rebound/Spring'
import { InProgressAnimations, FlipId } from '../types'
import {
  SwipeProps,
  SwipeEventHandlers,
  OnActionArgs,
  Direction,
  FlipInitiatorData,
  Set
} from './types'

const NonFlippedElement = 'nonFlippedElement'

const defaultCompleteThreshhold = 0.25

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

const cleanUpAnimation = (
  inProgressAnimations: InProgressAnimations,
  flipId: FlipId
) => {
  if (inProgressAnimations[flipId] && inProgressAnimations[flipId].spring) {
    inProgressAnimations[flipId].spring.destroy()
  }
  delete inProgressAnimations[flipId]
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
  const springsCompleted = Object.keys(inProgressAnimations).map(flipId => {
    const { spring, onAnimationEnd } = inProgressAnimations[flipId]
    if (!spring) {
      return
    }
    /// HAAACCKKK
    if (velocity > 3) {
      spring.setSpringConfig({
        tension: spring._springConfig.tension * 0.75,
        friction: spring._springConfig.friction * 0.75
      })
    }
    spring.setVelocity(Math.min(velocity, 15)).setEndValue(1)

    spring.addOneTimeListener({
      onSpringAtRest: (spring: Spring) => {
        // it was interrupted by another animation
        if (
          inProgressAnimations[flipId] &&
          inProgressAnimations[flipId].flipInitiator !== flipInitiator
        ) {
          return
        }
        // if not 1, assume this has been interrupted by subsequent gesture animation
        if (spring.getCurrentValue() !== 1) {
          return
        }
        onAnimationEnd!()
        cleanUpAnimation(inProgressAnimations, flipId)
        return Promise.resolve()
      }
    })
  })
  Promise.all(springsCompleted.filter(Boolean)).then(deleteFlipInitiatorData)
}

const cancelFlip = ({
  velocity = 1,
  inProgressAnimations,
  onFlipCancelled,
  flipInitiator
}: {
  velocity: number
  inProgressAnimations: InProgressAnimations
  onFlipCancelled: () => void
  flipInitiator: FlipId
}) => {
  const onCompletePromises: Array<Promise<void>> = Object.keys(
    inProgressAnimations
  ).map(flipId => {
    const { spring } = inProgressAnimations[flipId]
    if (!spring) {
      return Promise.resolve()
    }

    spring.setVelocity(Math.min(velocity, 15)).setEndValue(0)

    return new Promise(resolve => {
      spring.addOneTimeListener({
        onSpringAtRest: (spring: Spring) => {
          // if not 0, assume this has been interrupted by subsequent gesture
          if (spring.getCurrentValue() !== 0) {
            return
          }
          // it was interrupted by another animation
          if (
            inProgressAnimations[flipId] &&
            inProgressAnimations[flipId].flipInitiator !== flipInitiator
          ) {
            return
          }
          resolve()
          cleanUpAnimation(inProgressAnimations, flipId)
        }
      })
    })
  })
  Promise.all(onCompletePromises.filter(Boolean)).then(onFlipCancelled)
}

const updateSprings = ({
  inProgressAnimations,
  percentage
}: {
  inProgressAnimations: InProgressAnimations
  percentage: number
}) => {
  Object.keys(inProgressAnimations).forEach(flipId => {
    inProgressAnimations[flipId].spring
      .setVelocity(0.01)
      .setEndValue(percentage)
  })
}

const getDirection = (deltaX: number, deltaY: number) => {
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    return deltaX > 0 ? 'right' : 'left'
  }
  return deltaY > 0 ? 'down' : 'up'
}

class Swipe {
  // prevent people from using the same gesture to do multiple things
  // force a mouse up
  private set: Set
  public handlers: SwipeEventHandlers
  private flipInitiatorData: FlipInitiatorData | undefined = undefined

  public prevProps = {}

  constructor(public props: SwipeProps) {
    const { handlers, set } = gestureHandlers({
      onAction: this.onAction.bind(this),
      config: this.props
    })
    this.handlers = handlers
    this.set = set
  }

  onAction({ velocity, delta: [deltaX, deltaY], down, first }: OnActionArgs) {
    const { inProgressAnimations, setIsGestureInitiated, ...rest } = this.props

    const hasFlippedChild =
      this.props.children &&
      // @ts-ignore
      this.props.children.type &&
      // @ts-ignore
      this.props.children.type.displayName === 'Flipped'

    const flipId = hasFlippedChild
      ? String(this.props.flipId)
      : NonFlippedElement

    const flipInProgress = Boolean(Object.keys(inProgressAnimations).length)

    const gestureFlipOnThisElementInProgress = Boolean(
      inProgressAnimations[flipId] &&
        inProgressAnimations[flipId].flipInitiator === flipId
    )

    if (
      hasFlippedChild &&
      flipInProgress &&
      !gestureFlipOnThisElementInProgress
    )
      return

    const onFlipCancelled = () => {
      this.flipInitiatorData &&
        this.flipInitiatorData.cancelFlip({
          props: this.props,
          prevProps: this.prevProps
        })
      delete this.flipInitiatorData
    }

    const generalFlipInProgress = Boolean(
      Object.keys(inProgressAnimations).length
    )

    // TODO: figure out why the typings don't work :/
    const config = ['left', 'right', 'up', 'down']
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

      // reset the initial arg so that we are calculating gesture delta from the current mouse position
      // this will make interrupted/edge case scenarios smoother
      this.set(state => {
        return Object.assign({}, state, { initial: state.xy })
      })

      setIsGestureInitiated(true)
      configMatchingCurrentDirection.initFlip({
        props: this.props,
        prevProps: this.prevProps
      })

      // must call this func this after getSnapshotBeforeUpdate has run!
      const afterFLIPHasBeenInitiated = () => {
        // maybe gesture occurred but component didn't change posiition
        if (!inProgressAnimations[flipId] && hasFlippedChild) {
          delete this.flipInitiatorData
          return
        }

        Object.keys(inProgressAnimations).forEach(inProgressAnimationFlipId => {
          if (flipId) {
            // @ts-ignore
            inProgressAnimations[
              inProgressAnimationFlipId
            ].flipInitiator = flipId
          }
        })
      }

      setImmediate(afterFLIPHasBeenInitiated)
    }

    const currentDirection = getDirection(deltaX, deltaY)

    const configMatchingCurrentDirection = config.filter(
      configEntry => configEntry.direction === currentDirection
    )[0]

    if (!flipInProgress) {
      if (!configMatchingCurrentDirection) {
        console.warn('no config matching current direction')
        return
      }
      return initiateGestureControlledFLIP(configMatchingCurrentDirection)
    }

    if (!this.flipInitiatorData) {
      return
    }

    const returnToUnFlippedState = () => {
      cancelFlip({
        velocity,
        inProgressAnimations,
        onFlipCancelled,
        flipInitiator: flipId
      })
    }

    if (this.flipInitiatorData!.direction !== currentDirection) {
      // user might have done a mouseup while moving in another direction
      if (generalFlipInProgress && !down) {
        console.warn('return to unflipped')
        return returnToUnFlippedState()
      }
    }

    const absoluteMovement = getMovementScalar({
      deltaX,
      deltaY,
      direction: this.flipInitiatorData.direction
    })

    // must make sure not to call this when the user is starting a new gesture,
    // only when finger has not been lifted
    if (absoluteMovement <= 0 && !first) {
      return onFlipCancelled()
    }

    // this is only the case when the controlling component does not have a flipped child
    // (and threshold should be an absolute number rather than a percentage)
    let percentage = absoluteMovement

    if (hasFlippedChild) {
      const {
        translateXDifference,
        translateYDifference,
        prevRect,
        currentRect
      } = inProgressAnimations[flipId].difference

      const difference =
        ['up', 'down'].indexOf(this.flipInitiatorData.direction) > -1
          ? currentRect.height - prevRect.height + translateYDifference
          : currentRect.width - currentRect.width + translateXDifference

      percentage = absoluteMovement / difference
    }

    console.log({ percentage, threshold: this.flipInitiatorData.threshold })

    // cancel flip -- this is interruptible if user
    // tries to drag before animation is completed
    if (!down && percentage < this.flipInitiatorData.threshold) {
      return returnToUnFlippedState()
    }

    // gesture has gone far enough, animation can complete
    if (percentage > this.flipInitiatorData.threshold) {
      return finishFlip({
        flipInitiator: flipId,
        velocity,
        inProgressAnimations,
        deleteFlipInitiatorData: () => delete this.flipInitiatorData
      })
    }
    updateSprings({
      percentage: hasFlippedChild
        ? percentage
        : absoluteMovement / this.flipInitiatorData.threshold,
      inProgressAnimations
    })
  }
}

export default Swipe
