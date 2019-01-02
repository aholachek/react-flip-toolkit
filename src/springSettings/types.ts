export interface SpringConfig {
  stiffness?: number
  damping?: number
  overshootClamping?: boolean
}

export interface SpringPresets {
  noWobble: SpringConfig
  gentle: SpringConfig
  veryGentle: SpringConfig
  wobbly: SpringConfig
  stiff: SpringConfig
}

export type SpringOption = SpringConfig | keyof SpringPresets
