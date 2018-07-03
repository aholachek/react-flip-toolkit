import { Spring } from "wobble"
import { interpolate } from "shifty/src/interpolate"

export default function springUpdate({
  springConfig,
  delay,
  fromVals,
  toVals,
  onUpdate,
  onAnimationEnd
}) {
  const spring = new Spring(springConfig)
  const stop = spring.stop.bind(spring)

  spring
    .onUpdate(({ currentValue }) => {
      const vals = interpolate(fromVals, toVals, currentValue)
      onUpdate(stop)(vals)
    })
    .onStop(onAnimationEnd)
    .start()

  if (delay) {
    setTimeout(spring.start, delay)
  } else {
    spring.start
  }
  return stop
}
