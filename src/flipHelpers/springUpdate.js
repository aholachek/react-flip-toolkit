import { Spring } from "wobble"

export default function springUpdate({
  delay,
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
    onAnimationEnd()
    if (timeoutId) clearTimeout(timeoutId)
  }

  const onUpdate = getOnUpdateFunc(stop)

  spring.onUpdate(onUpdate).onStop(stop)

  if (delay) {
    timeoutId = setTimeout(spring.start.bind(spring), delay)
  } else {
    spring.start()
  }
  return stop
}
