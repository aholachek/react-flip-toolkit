import { SpringOption } from './springSettings/types'
export type { FlippedElementPositionsBeforeUpdateReturnVals } from './flip/getFlippedElementPositions/getFlippedElementPositionsBeforeUpdate/types'

export type FlipId = string | number

export type ChildAsFunction = (props: object) => React.ReactNode

export type FlippedChildren = React.ReactNode | ChildAsFunction

export interface SerializableFlippedProps {
  children: FlippedChildren
  portalKey?: string
  /** Tween opacity (applying this prop will remove the default transitions on the scale and transform values) */
  opacity?: boolean
  /** Tween Tween scaleX and scaleY (applying this prop will remove the default transitions on the transform and opacity values) */
  translate?: boolean
  /** Tween Tween scaleX and scaleY (applying this prop will remove the default transitions on the transform and opacity values) */
  scale?: boolean
  transformOrigin?: string
  /** Provide a string referencing one of the spring presets — (default), veryGentle, gentle, wobbly, or stiff, OR provide an object with stiffness and damping parameters */
  spring?: SpringOption
  /** Provide "true" to stagger the element with all other staggered elements. If you want to get more granular, you can provide a string key and the element will be staggered with other elements with the same key. */
  stagger?: string | boolean
  flipId?: FlipId
  inverseFlipId?: string
  /** Prevent this element from animating until the Flipped element with the provided flipId has started its animation, useful for nested animations  */
  delayUntil?: FlipId
}
export interface CallbackFlippedProps {
  /** Called when the FLIP animation for the element starts. It is provided a reference to the DOM element being transitioned as the first argument. */
  onStart?: (element: HTMLElement, decisionData?: DecisionData) => void
  /** Similar to onStart, but guaranteed to run for all FLIP-ped elements on the initial tick of the FLIP animation, before the next frame has rendered, even if the element in question has a stagger delay. It is provided a reference to the DOM element being transitioned as the first argument.   */
  onStartImmediate?: (element: HTMLElement, decisionData?: DecisionData) => void
  /** Called when the FLIP animation completes. It is provided a reference to the DOM element being transitioned as the first argument. (If transitions are interruped by new ones, onComplete will still be called.) */
  onComplete?: (element: HTMLElement, decisionData?: DecisionData) => void
  /** Called with the current spring value (normally between 0 - 1 but might briefly go over or under that range depending on the level of "bounciness" of the spring). Useful if you'd like to tween other, non-FLIP animations in concert with a FLIP transition.  */
  onSpringUpdate?: (springValue: number) => void
  /** Called when the element first appears in the DOM. It is provided a reference to the DOM element being transitioned as the first argument, and the index of the element relative to all appearing elements as the second. Note: If you provide an onAppear prop, the default opacity of the element will be set to 0 to allow you to animate it in without any initial flicker. If you don't want any opacity animation, just set the element's opacity to 1 immediately in your onAppear function. */
  onAppear?: (
    element: HTMLElement,
    index: number,
    decisionData?: DecisionData
  ) => void
  /** Called when the element is removed from the DOM. It must call the removeElement function when the exit transition has completed.   */
  onExit?: (
    element: HTMLElement,
    index: number,
    removeElement: () => void,
    decisionData?: DecisionData
  ) => void
  /** A function provided with the current and previous decisionData props passed down by the Flipper component. Returns a boolean to indicate whether a Flipped component should animate at that particular moment or not. */
  shouldFlip?: (previousDecisionData: any, currentDecisionData: any) => boolean
  /** A function provided with the current and previous decisionData props passed down by the Flipper component. Returns a boolean indicating whether to apply inverted transforms to all Flipped children that request it via an inverseFlipId. */
  shouldInvert?: (
    previousDecisionData: any,
    currentDecisionData: any
  ) => boolean
}

export type FlippedProps = CallbackFlippedProps & SerializableFlippedProps

export type DelayUntil = (
  previousDecisionData: any,
  currentDecisionData: any
) => FlipId

export interface StaggerConfigValue {
  reverse?: boolean
  /** A number between 0 (for a slower stagger) and 1 (for a faster stagger) */
  speed?: number
  delayUntil?: DelayUntil
}

export interface StaggerConfig {
  [key: string]: StaggerConfigValue
}

export interface HandleEnterUpdateDeleteArgs {
  hideEnteringElements: () => void
  animateExitingElements: () => Promise<void>
  animateFlippedElements: () => Promise<void> | void
  animateEnteringElements: () => void
}

export type HandleEnterUpdateDelete = (
  args: HandleEnterUpdateDeleteArgs
) => void

export interface DecisionData {
  previous?: any
  current?: any
}

export type OnFlipperComplete = (
  flipperEl: HTMLElement,
  decisionData: DecisionData
) => void

export type OnFlipperStart = (
  flipperEl: HTMLElement,
  decisionData: DecisionData
) => void

export interface FlipperProps {
  /** Changing this key will initiate a FLIP animation */
  flipKey: any
  children: React.ReactNode
  /** Provide a string referencing one of the spring presets — noWobble (default), veryGentle, gentle, wobbly, or stiff, OR provide an object with stiffness and damping parameters. Explore all spring options here: https://codesandbox.io/s/react-flip-toolkit-spring-settings-explorer-vjrsh  */
  spring?: SpringOption
  /** Whether or not react-flip-toolkit should apply a transform-origin of "0 0" to animating children (this is generally desirable for FLIP animations, and is set to true by default). */
  applyTransformOrigin?: boolean
  /** This experimental prop will pause your animation right at the initial application of FLIP-ped styles. That will allow you to inspect the state of the animation at the very beginning, when it should look similar or identical to the UI before the animation began. */
  debug?: boolean
  /** If you'd like to render an element other than `div`, specify an element string here */
  element?: string
  /** A classname to pass down to the element rendered by the Flipper component */
  className?: string
  /** In general, the Flipper component will only apply transitions to its descendents. This allows multiple Flipper elements to coexist on the same page, but it will prevent animations from working if you use portals. You can provide a unique portalKey prop to Flipper to tell it to scope element selections to the entire document, not just to its children, so that elements in portals can be transitioned. */
  portalKey?: string
  /** Configure the stagger settings for elements that will have stagger delays on their animations. More information in the docs: https://github.com/aholachek/react-flip-toolkit#basic-props */
  staggerConfig?: StaggerConfig
  /** Sometimes, you'll want the animated children of Flipper to behave differently depending on the state transition — maybe only certain Flipped elements should animate in response to a particular change. By providing the decisionData prop to the Flipper component, you'll make that data available to the shouldFlip and shouldInvert methods of each child Flipped component, so they can decided for themselves whether to animate or not. */
  decisionData?: any
  handleEnterUpdateDelete?: HandleEnterUpdateDelete
  /** This callback prop will be called when all individual FLIP animations have completed. */
  onComplete?: OnFlipperComplete
  /** This callback prop will be called when a FLIP transition begins. */
  onStart?: OnFlipperStart
}

export interface InProgressAnimations {
  [key: string]: {
    destroy?: () => void
    onAnimationEnd?: (isCancellation?: boolean) => void
  }
}

export interface FlipCallbacks {
  [key: string]: CallbackFlippedProps
}
