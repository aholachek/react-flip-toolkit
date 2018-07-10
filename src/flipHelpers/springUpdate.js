import { Spring } from "wobble"

export default function springUpdate({
  delay,
  animateOpacity,
  fromVals,
  toVals,
  getOnUpdateFunc,
  onAnimationEnd,
  springConfig
}) {
  // avoid potential passing in of variables that will cause a mistake
  let spring
  let timeoutId
  if (typeof springConfig === "object") {
    delete springConfig.toValue
    delete springConfig.fromValue
    spring = new Spring(springConfig)
  } else {
    spring = new Spring()
  }

  const stop = () => {
    spring.stop()
    if (timeoutId) clearTimeout(timeoutId)
  }

  const onUpdate = getOnUpdateFunc(stop)

  spring.onUpdate(onUpdate).onStop(onAnimationEnd)

  if (delay) {
    timeoutId = setTimeout(spring.start.bind(spring), delay)
  } else {
    spring.start()
  }
  return stop
}
