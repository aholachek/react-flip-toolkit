import { BaseFlipArgs, FlippedIds } from '../types.js'
import { SpringOption, SpringConfig } from '../../springSettings/types.js'
import { StaggerConfig, OnFlipperComplete, FlipId } from '../../types.js'
import { SerializableFlippedProps } from '../../types.js'
import { Spring } from '../../forked-rebound/types.js'

export type ScopedSelector = (selector: string) => HTMLElement[]

export interface AnimateFlippedElementsArgs extends BaseFlipArgs {
  flippedIds: FlippedIds
  applyTransformOrigin: boolean
  spring: SpringOption
  debug: boolean
  staggerConfig: StaggerConfig
  decisionData: any
  scopedSelector: ScopedSelector
  onComplete: OnFlipperComplete
  containerEl: HTMLElement
}

export type OnUpdate = (spring: Spring) => void

export type GetOnUpdateFunc = ({
  spring,
  onAnimationEnd
}: {
  spring: Spring
  onAnimationEnd: () => void
}) => OnUpdate

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
  getOnUpdateFunc: GetOnUpdateFunc
  initializeFlip: InitializeFlip
  onAnimationEnd: () => void
  childIds: ChildIds
  delayUntil?: FlipId
  onSpringActivate?: () => void
}
export type FlipDataArray = FlipData[]

export interface FlipDataDict {
  [flipId: string]: FlipData
}
