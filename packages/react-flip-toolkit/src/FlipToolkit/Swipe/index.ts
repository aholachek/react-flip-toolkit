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

const makeFinishFunction = (endValue: number) => {
  return ({
    inProgressAnimations,
    onFinished,
    velocity = 1
  }: {
    inProgressAnimations: InProgressAnimations
    onFinished: () => void
    velocity: number
  }) => {
    const springsCompleted = Object.keys(inProgressAnimations).map(flipId => {
      const { spring, onAnimationEnd } = inProgressAnimations[flipId]
      if (!spring) {
        return Promise.reject()
      }
      if (Object.keys(spring._cachedSpringConfig).length) {
        spring.setSpringConfig(spring._cachedSpringConfig)
      }
      spring
        .setVelocity(Math.max(Math.min(velocity, 15), 2))
        .setEndValue(endValue)

      return new Promise((resolve, reject) => {
        spring.addOneTimeListener({
          onSpringAtRest: (spring: Spring) => {
            // if not 1/0, assume this has been interrupted by subsequent gesture animation
            if (spring.getCurrentValue() !== endValue) {
              return reject()
            }
            resolve()
            // otherwise transforms will be removed from cancelled flip causing jitter
            endValue === 1 && onAnimationEnd!()
            cleanUpAnimation(inProgressAnimations, flipId)
          }
        })
      })
    })
    Promise.all(springsCompleted).then(onFinished)
  }
}

const finishFlip = makeFinishFunction(1)
const cancelFlip = makeFinishFunction(0)

const updateSprings = ({
  inProgressAnimations,
  percentage
}: {
  inProgressAnimations: InProgressAnimations
  percentage: number
}) => {
  Object.keys(inProgressAnimations).forEach(flipId => {
    const spring = inProgressAnimations[flipId].spring
    if (!Object.keys(spring._cachedSpringConfig).length) {
      inProgressAnimations[flipId].spring._cachedSpringConfig =
        inProgressAnimations[flipId].spring._springConfig
    }
    spring.setSpringConfig({
      tension: 300,
      friction: 26
    })
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
  // prevent people from using the same gesture to do multiple things
  // force a mouse up
  private set: Set
  public handlers: SwipeEventHandlers
  private flipInitiatorData: FlipInitiatorData | undefined = undefined
  private isFinishing: boolean = false

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
    if (this.isFinishing) return
    if (first && deltaX + deltaY === 0) return

    const { inProgressAnimations, setIsGestureInitiated, ...rest } = this.props

    const flipId = String(this.props.flipId)

    if (process.env.NODE_ENV !== 'production') {
      if (!inProgressAnimations || !setIsGestureInitiated) {
        // eslint-disable-next-line no-console
        console.error(
          '[react-flip-toolkit] No parent Flipper component detected for this Swipe component'
        )
        return
      }
    }

    const generalFlipInProgress = Boolean(
      Object.keys(inProgressAnimations).length
    )

    const onFlipCancelled = () => {
      this.flipInitiatorData &&
        this.flipInitiatorData.cancelFlip({
          props: this.props,
          prevProps: this.prevProps
        })
      delete this.flipInitiatorData
      this.isFinishing = false
    }

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
        if (!inProgressAnimations[flipId]) {
          console.log('nothing changed')
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
        console.log('afterFLIP hasBeen initialized', this.flipInitiatorData)
      }

      setTimeout(afterFLIPHasBeenInitiated, 0)
    }

    const currentDirection = getDirection(deltaX, deltaY)

    const configMatchingCurrentDirection = config.filter(
      configEntry => configEntry.direction === currentDirection
    )[0]

    if (!generalFlipInProgress) {
      if (!configMatchingCurrentDirection) {
        return
      }
      return initiateGestureControlledFLIP(configMatchingCurrentDirection)
    }

    if (!this.flipInitiatorData) {
      return
    }

    const returnToUnFlippedState = () => {
      this.isFinishing = true
      cancelFlip({
        velocity,
        inProgressAnimations,
        onFinished: onFlipCancelled
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
    const {
      translateXDifference,
      translateYDifference,
      prevRect,
      currentRect
    } = inProgressAnimations[flipId].difference

    const difference = Math.abs(
      ['up', 'down'].indexOf(this.flipInitiatorData.direction) > -1
        ? currentRect.height - prevRect.height + translateYDifference
        : currentRect.width - currentRect.width + translateXDifference
    )

    const percentage = absoluteMovement / difference

    // cancel flip -- this is interruptible if user
    // tries to drag before animation is completed
    if (!down && percentage < this.flipInitiatorData.threshold) {
      return returnToUnFlippedState()
    }

    // gesture has gone far enough, animation can complete
    if (percentage > this.flipInitiatorData.threshold) {
      this.isFinishing = true
      return finishFlip({
        velocity,
        inProgressAnimations,
        onFinished: () => {
          delete this.flipInitiatorData
          delete this.isFinishing
        }
      })
    }
    updateSprings({
      percentage,
      inProgressAnimations
    })
  }
}

export default Swipe
