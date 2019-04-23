import clamp from 'lodash-es/clamp'

const seekSpringPosition = ({ percentage, velocity, inProgressAnimations }) => {
  Object.keys(inProgressAnimations).forEach(flipId => {
    const { setVelocity, setEndValue } = inProgressAnimations[flipId]
    setEndValue(clamp(percentage, 0, 1))
    if (velocity !== undefined) {
      setVelocity(clamp(velocity, 0.05, 15))
    }
  })
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
  return ({
    event: { type: eventType },
    velocity,
    delta: [deltaX, deltaY]
  }) => {
    if (finished) {
      return
    }
    if (eventType === 'mousedown') {
      initFLIP()
    }
    if (deltaY > completeThreshold) {
      seekSpringPosition({
        percentage: deltaY,
        inProgressAnimations
      })
      finished = true
      return
    }
    if (eventType === 'mouseup') {
      seekSpringPosition({
        percentage: 0,
        velocity,
        inProgressAnimations
      })
      cancelFLIP()
    }
    const gestureDirection = getDirection(deltaX, deltaY)
    if (gestureDirection !== direction) {
      return
    }
    if (deltaY > Math.abs(deltaX)) {
      seekSpringPosition({
        percentage: deltaY / completeThreshold,
        inProgressAnimations
      })
    }
  }
}
