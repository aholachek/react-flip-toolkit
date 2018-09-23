import { SpringSystem } from "../../forked-rebound"

// this should get created only 1x
const springSystem = new SpringSystem()

export default ({
  springConfig: { stiffness, damping, overshootClamping },
  noOp,
  getOnUpdateFunc,
  onAnimationEnd
}) => {
  if (noOp) return
  const spring = springSystem.createSpring(stiffness, damping)
  spring.setOvershootClampingEnabled(!!overshootClamping)
  spring.addListener({
    onSpringUpdate: getOnUpdateFunc(spring.destroy.bind(spring)),
    onSpringAtRest: () => {
      // spring.destroy()
      onAnimationEnd()
    }
  })
  spring.setEndValue(1)
}
