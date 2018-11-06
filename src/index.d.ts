import * as React from "react"

export interface Spring {
  stiffness?: number
  damping?: number
  overshootClamping?: boolean
}

export type SpringConfig =
  | "stiff"
  | "noWobble"
  | "veryGentle"
  | "gentle"
  | "wobbly"
  | Spring

export interface FlippedProps {
  children: React.ReactNode
  inverseFlipId?: string
  flipId?: string
  opacity?: boolean
  translate?: boolean
  scale?: boolean
  transformOrigin?: string
  stagger?: string | boolean
  spring?: SpringConfig
  onStart?: (element: HTMLElement) => void
  onComplete?: (element: HTMLElement) => void
  onAppear?: (element: HTMLElement, index: number) => any
  onExit?: (
    element: HTMLElement,
    index: number,
    removeElement: () => any
  ) => any
  shouldFlip?: (prevDecisionData: any, currentDecisionData: any) => boolean
  shouldInvert?: (prevDecisionData: any, currentDecisionData: any) => boolean
  portalKey?: string
}

export const Flipped: React.ComponentType<FlippedProps>

export interface StaggerConfigValue {
  reverse?: boolean
  speed: number
}

export interface StaggerConfig {
  [key: string]: StaggerConfigValue
}

export interface FlipperProps {
  flipKey: any
  children: React.ReactNode
  spring?: SpringConfig
  applyTransformOrigin?: boolean
  debug?: boolean
  element?: string
  className?: string
  portalKey?: string
  decisionData?: any
  staggerConfig?: StaggerConfig
}

export const Flipper: React.ComponentType<FlipperProps>
