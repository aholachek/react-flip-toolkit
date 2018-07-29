import { Spring } from "wobble"

export default function springUpdate({
  getOnUpdateFunc,
  onAnimationEnd,
  springConfig = {}
}) {
  // avoid potential passing in of variables that will cause a mistake
  // by destructuring to pass in only allowed vars
  const { stiffness, damping, overshootClamping } = springConfig
  const spring = new Spring({
    mass: 1,
    stiffness,
    damping,
    overshootClamping
  })

  const stop = () => spring.stop()

  const onUpdate = getOnUpdateFunc(stop)

  spring.onUpdate(onUpdate)
  spring.onStop(onAnimationEnd)

  spring.start()

  return stop
}
