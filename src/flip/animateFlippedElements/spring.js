import { Spring } from "wobble"

export default function springUpdate({
  getOnUpdateFunc,
  onAnimationEnd,
  springConfig = {}
}) {
  // pass in only allowed vars
  const spring = new Spring({
    mass: 1,
    stiffness: springConfig.stiffness,
    damping: springConfig.damping,
    overshootClamping: springConfig.overshootClamping
  })
  
  const stop = spring.stop.bind(spring)
  spring.onUpdate(getOnUpdateFunc(stop))
  spring.onStop(onAnimationEnd)

  spring.start()

  return spring
}
