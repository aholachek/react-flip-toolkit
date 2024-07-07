import { SpringOption } from '../springSettings/types.js'

type TweenStart = number
type TweenEnd = number
type Values = Record<string, [TweenStart, TweenEnd]>

type SpringSnapshot = Record<string, number>

export interface SimpleSpringOptions {
  /** Provide a string referencing one of the spring presets — noWobble (default), veryGentle, gentle, wobbly, or stiff, OR provide an object with stiffness and damping parameters. */
  config?: SpringOption
  /** An object like: { opacity: [0, 1], translateY: [-30, 0]} */
  values?: Values
  /** If you provided no values argument, this will be called with the current spring value (between 0-1). Otherwise, this will be an object with keys corresponding to the values argument you passed in, an object like: { opacity: .5, translateY: -15 } */
  onUpdate: (value: number | SpringSnapshot) => void
  /** Number of milliseconds to wait before the animation is started */
  delay?: number
  /** Function to be called when spring is at rest */
  onComplete?: () => void
}
