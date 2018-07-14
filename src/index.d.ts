import * as React from "react"

// umd
export as namespace ReactFlipToolkit

interface Spring {
  stiffness?: number
  damping?: number
  mass?: number
  initialVelocity?: number
  allowsOverdamping?: boolean
  overshootClamping?: boolean
}

export interface FlippedProps {
  children: React.ReactNode
  inverseFlipId?: string
  flipId?: string
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
  componentIdFilter?: string | any[]
  componentId?: string
}

export const Flipped: React.SFC<FlippedProps>

export type FlipperFlipKey = string | number | boolean

export interface FlipperProps {
  flipKey: FlipperFlipKey
  children: React.ReactNode
  duration?: number
  ease?: string
  spring?: Spring
  applyTransformOrigin?: boolean
  debug?: boolean
  element?: string
  className?: string
}

export class Flipper extends React.Component<FlipperProps> {
  render(): JSX.Element
}
