import { useGesture } from 'react-with-gesture'
import clamp from 'lodash-es/clamp'
import { InProgressAnimations } from '../Flipper/types'

const seekSpringPosition = ({
  percentage,
  velocity,
  inProgressAnimations,
  onComplete
}: {
  percentage: number
  velocity?: number
  inProgressAnimations: InProgressAnimations
  onComplete?: () => void
}) => {
  const onCompletePromises: Array<Promise<void>> | [] = Object.keys(
    inProgressAnimations
  ).map(flipId => {
    const { setVelocity, setEndValue, onAnimationEnd } = inProgressAnimations[
      flipId
    ]
    const clampedPercentage = clamp(percentage, 0, 1)
    const spring = setEndValue(clampedPercentage)
    if (velocity !== undefined) {
      console.log(velocity)
      setVelocity(clamp(velocity, 0.01, 15))
    }
    // either cancelled or completed -- we're done
    if (onComplete || clampedPercentage === 1) {
      return new Promise(resolve => {
        spring.addListener({
          onSpringAtRest: () => {
            resolve()
            spring.destroy()
            if (clampedPercentage === 1) {
              onAnimationEnd()
            }
          }
        })
      })
    }
  })
  if (onComplete) {
    Promise.all(onCompletePromises).then(() => {
      onComplete()
    })
  }
}

const getDirection = (deltaX: number, deltaY: number) => {
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    return deltaX > 0 ? 'right' : 'left'
  }
  return deltaY > 0 ? 'down' : 'up'
}

const onGesture = ({
  initFLIP,
  cancelFLIP,
  direction,
  inProgressAnimations,
  flipId,
  completeThreshold = 0.5
}: {
  initFLIP: () => void
  cancelFLIP: () => void
  direction: 'right' | 'left' | 'down' | 'up'
  inProgressAnimations: InProgressAnimations
  flipId: string
  completeThreshold: number
}) => {
  let finished = false
  let flipInitiated = false
  // useGesture callback
  return ({ velocity, delta: [deltaX, deltaY], down }) => {
    // block weird things from happening while animation completes
    if (finished) {
      console.log('is finished!')
      return
    }

    const currentDirection = getDirection(deltaX, deltaY)

    if (currentDirection !== direction) {
      return
    }

    if (!flipInitiated) {
      flipInitiated = true
      initFLIP()
    }

    const absoluteMovement =
      ['up', 'down'].indexOf(direction) > -1
        ? Math.abs(deltaY)
        : Math.abs(deltaX)

    const gestureData = inProgressAnimations[flipId]

    // TODO: figure out why this happens
    if (!gestureData) {
      return
    }

    const {
      translateXDifference,
      translateYDifference,
      scaleXDifference,
      scaleYDifference
    } = gestureData.difference

    const difference =
      ['up', 'down'].indexOf(direction) > -1
        ? scaleYDifference + translateYDifference
        : scaleXDifference + translateXDifference

    const percentage = absoluteMovement / difference

    if (percentage > completeThreshold) {
      finished = true
      return seekSpringPosition({
        percentage: 1,
        velocity,
        inProgressAnimations
      })
    }
    if (!down) {
      return seekSpringPosition({
        percentage: 0,
        velocity,
        inProgressAnimations,
        onComplete: cancelFLIP
      })
    }

    return seekSpringPosition({
      percentage,
      inProgressAnimations
    })
  }
}

export default (...args) => useGesture(onGesture(...args))()
