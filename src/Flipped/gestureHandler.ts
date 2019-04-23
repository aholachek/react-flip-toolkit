import clamp from 'lodash-es/clamp'

const seekSpringPosition = ({
  percentage,
  velocity,
  inProgressAnimations,
  onComplete
}) => {
  const onCompletePromises = Object.keys(inProgressAnimations).map(flipId => {
    const { setVelocity, setEndValue } = inProgressAnimations[flipId]
    const spring = setEndValue(clamp(percentage, 0, 1))
    if (velocity !== undefined) {
      setVelocity(clamp(velocity, 1, 15))
    }
    if (onComplete) {
      return new Promise(resolve => {
        spring.addListener({
          onSpringAtRest: resolve
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

const getDirection = (deltaX, deltaY) => {
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    return deltaX > 0 ? 'right' : 'left'
  }
  return deltaY > 0 ? 'down' : 'up'
}

export const gestureHandler = ({
  initFLIP,
  cancelFLIP,
  direction,
  completeThreshold,
  inProgressAnimations
}) => {
  let finished = false
  return ({ first, down, velocity, delta: [deltaX, deltaY] }) => {
    if (finished) {
      return
    }
    if (first) {
      initFLIP()
    }

    const currentDirection = getDirection(deltaX, deltaY)
    if (currentDirection !== direction) {
      return
    }

    if (deltaY > completeThreshold) {
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
    const absoluteMovement =
      ['up', 'down'].indexOf(direction) > -1
        ? Math.abs(deltaY)
        : Math.abs(deltaX)

    return seekSpringPosition({
      percentage: absoluteMovement / completeThreshold
      inProgressAnimations
    })
  }
}
