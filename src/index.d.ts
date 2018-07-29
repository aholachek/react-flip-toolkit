import * as React from "react"

export interface Spring {
  stiffness?: number
  damping?: number
  overshootClamping?: boolean
}

export interface Stagger {
  key?: string
  triggerNext?: number
  drag?: boolean
}

export type SpringConfig = "noWobble" | "gentle" | "wobbly" | "stiff" | Spring

export type FlippedComponentIdFilter = string | any[]

export interface FlippedWithContextProps {
  children: React.ReactNode
  inverseFlipId?: any
  flipId?: any
  opacity?: boolean
  translate?: boolean
  scale?: boolean
  transformOrigin?: string
  stagger?: boolean | Stagger
  spring?: SpringConfig
  onStart?: (element: HTMLElement) => any
  onComplete?: (element: HTMLElement) => any
  onAppear?: (element: HTMLElement, index: number) => any
  onDelayedAppear?: (element: HTMLElement, index: number) => any
  onExit?: (
    element: HTMLElement,
    index: number,
    removeElement: () => any
  ) => any
  componentIdFilter?: FlippedComponentIdFilter
  componentId?: string
  portalKey?: string
}

export const FlippedWithContext: React.SFC<FlippedWithContextProps>

export type FlipperFlipKey = string | number | boolean

export interface FlipperProps {
  flipKey: FlipperFlipKey
  children: React.ReactNode
  duration?: number
  ease?: string
  spring?: SpringConfig
  applyTransformOrigin?: boolean
  debug?: boolean
}

export class Flipper extends React.Component<FlipperProps, any> {
  render(): JSX.Element
}
