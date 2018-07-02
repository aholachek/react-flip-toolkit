import { Spring } from "wobble"

const applySpringToVal = (fromVal, toVal, spring) =>
  (toVal - fromVal) * spring + fromVal

export default function springUpdate({
  springConfig,
  delay,
  fromVals,
  toVals,
  onUpdate,
  onComplete
}) {
  const spring = new Spring(springConfig)

  spring
    .onUpdate(s => {
      const matrix = fromVals.matrix.map((f, i) =>
        applySpringToVal(f, toVals.matrix[i], s)
      )
      const opacity = applySpringToVal(fromVals.opacity, toVals.opacity, s)
      onUpdate({ matrix, opacity })
    })
    .onStop(onComplete)
    .start()

  if (delay) {
    setTimeout(spring.start, delay)
  } else {
    spring.start
  }
  return spring.stop
}
