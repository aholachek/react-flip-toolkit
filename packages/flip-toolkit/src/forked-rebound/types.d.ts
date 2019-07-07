export interface AddListenerArgs {
  onSpringActivate: () => void
  onSpringUpdate: (spring: Spring) => void
  onSpringAtRest: () => void
}

export interface Spring {
  setOvershootClampingEnabled: (overshootClamping: boolean) => void
  addListener: (addListenerArgs: AddListenerArgs) => void
  destroy: () => void
  setEndValue: (endValue: number) => void
  getCurrentValue: () => number
}

export interface SpringSystemInterface {
  createSpring: (stiffness: number, damping: number) => Spring
}
