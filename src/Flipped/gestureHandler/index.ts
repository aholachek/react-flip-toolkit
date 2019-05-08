import { useGesture } from 'react-with-gesture'
import clamp from 'lodash-es/clamp'
import { InProgressAnimations } from '../../Flipper/types'
import { GestureParams } from './types'
import Spring from '../../forked-rebound/Spring'

const finishFlip = ({
  inProgressAnimations,
  velocity
}: {
  inProgressAnimations: InProgressAnimations
  velocity: number
}) => {
  const clampedVelocity = velocity !== undefined && clamp(velocity, 0.025, 15)
  Object.keys(inProgressAnimations).map(flipId => {
    const { spring, onAnimationEnd } = inProgressAnimations[flipId]
    if (!spring) {
      return
    }
    if (clampedVelocity) {
      spring.setVelocity(clampedVelocity)
    }
    spring.setEndValue(1)
    spring.addOneTimeListener({
      onSpringAtRest: (spring: Spring) => {
        // if not 1, assume this has been interrupted by subsequent gesture
        if (spring.getCurrentValue() !== 1) {
          return
        }
        onAnimationEnd()
        spring.destroy()
      }
    })
  })
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
  const clampedVelocity = velocity !== undefined && clamp(velocity, 0.025, 15)

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
    // might be some sort of race condition with multiple calls to this function
    if (!Object.keys(inProgressAnimations).length) {
      return
    }
    onFlipCancelled()

    Object.keys(inProgressAnimations).map(flipId =>
      inProgressAnimations[flipId].spring!.destroy()
    )
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

const onGesture = ({
  initFLIP,
  cancelFLIP: onFlipCancelled,
  direction: directionParam = 'right',
  inProgressAnimations,
  flipId,
  completeThreshold = 0.4
}: GestureParams) => {
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
    // prevent single clicks from doing anything
    if (first || (deltaX === 0 && deltaY === 0)) {
      return
    }

    const currentDirection = getDirection(deltaX, deltaY)

    const returnToUnFlippedState = () => {
      cancelFlip({
        velocity,
        inProgressAnimations,
        onFlipCancelled
      })
    }
    const flipInProgress = Boolean(inProgressAnimations[flipId])

    // probably another gesture is happening right now, the user
    // has to wait for it to complete and then try again
    if (
      Object.keys(inProgressAnimations)
        .map(flipId => inProgressAnimations[flipId].flipInitiator)
        .filter(Boolean)
        .some(flipInitiator => flipInitiator !== flipId)
    ) {
      return
    }

    if (!flipInProgress && currentDirection === directionParam) {
      initFLIP()
      setTimeout(() => {
        // cache this because it will change in the beginning of FLIP
        inProgressAnimations[flipId].direction = directionParam
        Object.keys(inProgressAnimations).forEach(inProgressAnimationFlipId => {
          inProgressAnimations[inProgressAnimationFlipId].flipInitiator = flipId
        })
      }, 0)
      return
    }
    // maybe animation just got started (?)
    if (!inProgressAnimations[flipId]) {
      return
    }
    // animations are not interruptible
    // while an animation is completing
    // this helps prevent some bugs that I couldn't otherwise solve
    if (inProgressAnimations[flipId].isFinishing) {
      return
    }

    const requiredDirection = inProgressAnimations[flipId].direction

    if (requiredDirection !== currentDirection) {
      // user might have done a mouseup while moving in another direction
      if (flipInProgress && !down) {
        returnToUnFlippedState()
      } else {
        return
      }
    }

    const absoluteMovement =
      ['up', 'down'].indexOf(requiredDirection) > -1
        ? Math.abs(deltaY)
        : Math.abs(deltaX)

    const gestureData = inProgressAnimations[flipId]

    const {
      translateXDifference,
      translateYDifference,
      scaleXDifference,
      scaleYDifference
    } = gestureData.difference

    const difference =
      ['up', 'down'].indexOf(requiredDirection) > -1
        ? scaleYDifference + translateYDifference
        : scaleXDifference + translateXDifference

    const percentage = absoluteMovement / difference

    // abort flip -- this is interruptible if user
    // tries to drag before animation is completed
    if (!down && percentage < completeThreshold) {
      return returnToUnFlippedState()
    }

    // gesture has gone far enough, animation can complete
    if (percentage > completeThreshold) {
      inProgressAnimations[flipId].isFinishing = true
      return finishFlip({
        velocity,
        inProgressAnimations
      })
    }
    return updateSprings({
      percentage,
      inProgressAnimations
    })
  }
}

export default (gestureparams: GestureParams) =>
  useGesture(onGesture(gestureparams))()
