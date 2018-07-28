import { Spring } from "wobble"
import getSpringInterface from "../../getSpringInterface"

const allowedConfigKeys = Object.keys(getSpringInterface())

export default function springUpdate({
  getOnUpdateFunc,
  onAnimationEnd,
  springConfig
}) {
  // avoid potential passing in of variables that will cause a mistake
  let spring
  if (typeof springConfig === "object") {
    // use whitelist
    Object.keys(springConfig).forEach(configKey => {
      if (allowedConfigKeys.indexOf(configKey) === -1) {
        delete springConfig[configKey]
      }
    })
    springConfig.mass = 1
    spring = new Spring(springConfig)
  }

  const stop = () => spring.stop()

  const onUpdate = getOnUpdateFunc(stop)

  spring.onUpdate(onUpdate)
  spring.onStop(onAnimationEnd)

  spring.start()

  return stop
}
