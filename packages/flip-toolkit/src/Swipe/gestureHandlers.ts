// modified from from https://github.com/react-spring/react-use-gesture/blob/v4.0.7/index.js
// TODO: figure out how to stop using ts-ignore everywhere
import { OnAction, SwipeEvent, Config, State } from './types'

const touchMove = 'touchmove'
const touchEnd = 'touchend'
const mouseMove = 'mousemove'
const mouseUp = 'mouseup'

const initialState = {
  event: undefined,
  target: undefined,
  time: undefined,
  xy: [0, 0],
  delta: [0, 0],
  initial: [0, 0],
  previous: [0, 0],
  direction: [0, 0],
  local: [0, 0],
  lastLocal: [0, 0],
  velocity: 0,
  distance: 0,
  down: false,
  first: true,
  shiftKey: false
}

const defaultConfig = {
  window,
  touchOnly: true,
  onDown: undefined,
  onUp: undefined
}

interface HandlerProps {
  onAction: OnAction
  config: Config
}

type SetCallback = (state: State) => State
type Set = (cb: SetCallback) => void

function handlers(set: Set, { onAction, config }: HandlerProps) {
  const handleUp = (event: SwipeEvent) => {
    set(state => {
      const newState = { ...state, down: false, first: false }
      // @ts-ignore
      if (onAction) onAction(newState)
      if (config.onUp) config.onUp(newState)
      return {
        ...newState,
        event,
        // @ts-ignore
        shiftKey: event.shiftKey,
        lastLocal: state.local
      }
    })
  }
  const handleDown = (event: any) => {
    const { target, pageX, pageY, shiftKey } = event.touches
      ? event.touches[0]
      : event
    // @ts-ignore
    set(state => {
      const lastLocal = state.lastLocal || initialState.lastLocal
      const newState = {
        ...initialState,
        event,
        target,
        lastLocal,
        shiftKey,
        local: lastLocal,
        xy: [pageX, pageY],
        initial: [pageX, pageY],
        previous: [pageX, pageY],
        down: true,
        time: Date.now(),
        cancel: () => {
          stop()
          requestAnimationFrame(() => handleUp(event))
        }
      }
      onAction!(newState)
      // @ts-ignore
      if (config.onDown) config.onDown(newState)
      return { ...newState }
    })
  }
  const handleMove = (event: any) => {
    const { pageX, pageY, shiftKey } = event.touches ? event.touches[0] : event
    // @ts-ignore
    set(state => {
      const time = Date.now()
      const x_dist = pageX - state.xy[0]
      const y_dist = pageY - state.xy[1]
      const delta_x = pageX - state.initial[0]
      const delta_y = pageY - state.initial[1]
      const distance = Math.sqrt(delta_x * delta_x + delta_y * delta_y)
      const len = Math.sqrt(x_dist * x_dist + y_dist * y_dist)
      const scalar = 1 / (len || 1)
      const newState = {
        ...state,
        event,
        time,
        shiftKey,
        xy: [pageX, pageY],
        delta: [delta_x, delta_y],
        local: [
          state.lastLocal[0] + pageX - state.initial[0],
          state.lastLocal[1] + pageY - state.initial[1]
        ],
        velocity: len / (time - state.time),
        distance: distance,
        direction: [x_dist * scalar, y_dist * scalar],
        previous: state.xy,
        first: false
      }
      onAction && onAction!(newState)
      return { ...newState }
    })
  }

  const onDown = (event: SwipeEvent): void => {
    // @ts-ignore
    if (event.targetTouches.length > 1) return
    if (
      config.maxWidth &&
      !window.matchMedia(`screen and (max-width: ${config.maxWidth}px)`)
    )
      return
    if (!config.touchOnly) {
      config.window.addEventListener(mouseMove, handleMove, { passive: true })
      // @ts-ignore
      config.window.addEventListener(mouseUp, onUp, { passive: true })
    }
    config.window.addEventListener(touchMove, handleMove, { passive: true })
    // @ts-ignore
    config.window.addEventListener(touchEnd, onUp, { passive: true })

    handleDown(event)
  }

  const stop = () => {
    if (!config.touchOnly) {
      config.window.removeEventListener(mouseMove, handleMove, {
        // @ts-ignore
        passive: true
      })
      // @ts-ignore
      config.window.removeEventListener(mouseUp, onUp, { passive: true })
    }
    config.window.removeEventListener(touchMove, handleMove, {
      // @ts-ignore
      passive: true
    })
    // @ts-ignores
    config.window.removeEventListener(touchEnd, onUp, { passive: true })
  }

  const onUp = (e: SwipeEvent) => {
    stop()
    handleUp(e)
  }
  const output: {
    onMouseDown?: (e: SwipeEvent) => void
    onTouchStart?: (e: SwipeEvent) => void
  } = {}

  if (!config.touchOnly) {
    output[`onMouseDown`] = onDown
  }

  output[`onTouchStart`] = onDown

  return output
}

function Gesture(props: HandlerProps) {
  let _state = initialState
  // @ts-ignore
  const set: Set = (cb: SetCallback) => (_state = cb(_state))
  return handlers(set, {
    onAction: props.onAction,
    // passing in an object so that we can automatically get updated settings without
    // rebinding the handlers
    config: Object.assign(defaultConfig, props.config)
  })
}

export default Gesture
