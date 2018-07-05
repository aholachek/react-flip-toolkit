import { Spring } from "wobble"
import { interpolate } from "shifty/src/interpolate"

export default function springUpdate({
  delay,
  fromVals,
  toVals,
  getOnUpdateFunc,
  onAnimationEnd,
  springConfig
}) {
  // avoid potential passing in of variables that will cause a mistake
  let spring
  if (typeof springConfig === "object") {
    delete springConfig.toValue
    delete springConfig.fromValue
    spring = new Spring(springConfig)
  } else {
    spring = new Spring()
  }

  const stop = spring.stop.bind(spring)
  const onUpdate = getOnUpdateFunc(stop)

  spring
    .onUpdate(({ currentValue }) => {
      const vals = interpolate(fromVals, toVals, currentValue)
      onUpdate(vals)
    })
    .onStop(onAnimationEnd)

  if (delay) {
    setTimeout(spring.start.bind(spring), delay)
  } else {
    spring.start()
  }
  return stop
}
