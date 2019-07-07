import { BaseFlipArgs, FlippedIds } from '../types'
import { SpringOption, SpringConfig } from '../../springSettings/types'
import { StaggerConfig, OnFlipperComplete } from '../../Flipper/types'
import { SerializableFlippedProps, FlipId } from '../../Flipped/types'
import { Spring } from '../../../packages/flip-toolkit/src/forked-rebound/types'

export type ScopedSelector = (selector: string) => HTMLElement[]

export interface AnimateFlippedElementsArgs extends BaseFlipArgs {
  flippedIds: FlippedIds
  applyTransformOrigin: boolean
  spring: SpringOption
  debug: boolean
  staggerConfig: StaggerConfig
  decisionData: any
  scopedSelector: ScopedSelector
  retainTransform: boolean
  onComplete: OnFlipperComplete
}

export type OnUpdate = (spring: Spring) => void
export type GetOnUpdateFunc = (stop: () => void) => OnUpdate

export type Matrix = number[]

export type InvertedChild = [
  HTMLElement,
  Omit<SerializableFlippedProps, 'flipId'>
]

export type InvertedChildren = InvertedChild[]

export interface AnimatedVals {
  matrix: Matrix
  opacity?: number
}

export type InitializeFlip = () => void

export type ChildIds = string[]

export interface StaggeredChildren {
  // group by stagger key
  [stagger: string]: FlipDataArray
}

export interface FlipData {
  element: HTMLElement
  id: string
  stagger: string
  springConfig: SpringConfig
  noOp: boolean
  getOnUpdateFunc: GetOnUpdateFunc
  initializeFlip: InitializeFlip
  onAnimationEnd: () => void
  // these fields are added by filterFlipDescendants
  level: number
  childIds: ChildIds
  // added by initiateAnimations
  onSpringActivate: () => void
  immediateChildren: FlipDataArray
  staggeredChildren: StaggeredChildren
}
export type FlipDataArray = FlipData[]

export interface FlipDataDict {
  [flipId: string]: FlipData
}

export interface LevelToChildren {
  [level: string]: ChildIds
}

export type TopLevelChildren = FlipId[]

export type InitiateStaggeredAnimations = (staggered: StaggeredChildren) => void

export interface TreeNode {
  staggeredChildren: StaggeredChildren
  immediateChildren: FlipDataArray
}
