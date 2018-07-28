import * as React from "react"

export interface Spring {
  stiffness?: number
  damping?: number
  mass?: number
  initialVelocity?: number
  allowsOverdamping?: boolean
  overshootClamping?: boolean
}

export type FlippedComponentIdFilter = string | any[]

export interface FlippedWithContextProps {
  children: React.ReactNode
  inverseFlipId?: any
  flipId?: any
  opacity?: boolean
  translate?: boolean
  scale?: boolean
  transformOrigin?: string
  ease?: string
  duration?: number
  delay?: number
  spring?: Spring
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
}

export const FlippedWithContext: React.SFC<FlippedWithContextProps>

export type FlipperFlipKey = string | number | boolean

export interface FlipperProps {
  flipKey: FlipperFlipKey
  children: React.ReactNode
  duration?: number
  ease?: string
  spring?: Spring | string
  applyTransformOrigin?: boolean
  debug?: boolean
}

export class Flipper extends React.Component<FlipperProps, any> {
  render(): JSX.Element
}
