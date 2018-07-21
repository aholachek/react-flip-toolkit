import { Spring } from "wobble"
import getSpringInterface from "../../getSpringInterface"

const allowedConfigKeys = Object.keys(getSpringInterface())

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
    // use whitelist
    Object.keys(springConfig).forEach(configKey => {
      if (allowedConfigKeys.indexOf(configKey) === -1) {
        delete springConfig[configKey]
      }
    })
    spring = new Spring(springConfig)
  } else {
    spring = new Spring()
  }

  const stop = () => {
    if (timeoutId) clearTimeout(timeoutId)
    spring.stop()
  }

  const onUpdate = getOnUpdateFunc(stop)

  spring.onUpdate(onUpdate)
  spring.onStop(onAnimationEnd)

  if (delay) {
    timeoutId = setTimeout(spring.start.bind(spring), delay)
  } else {
    spring.start()
  }
  return stop
}
