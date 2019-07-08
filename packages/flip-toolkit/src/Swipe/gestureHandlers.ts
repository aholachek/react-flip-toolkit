// edited from https://github.com/react-spring/react-use-gesture/blob/v4.0.7/index.js
// TODO: stop using ts-ignore everywhere
import { OnAction, SwipeEvent } from './types'

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

const defaultProps = {
  window,
  touch: true,
  mouse: true,
  onAction: undefined,
  onDown: undefined,
  onUp: undefined
}

type State = {
  event?: SwipeEvent
  target: EventTarget | null
  time: number
  xy: [number, number]
  delta: [number, number]
  initial: [number, number]
  previous: [number, number]
  direction: [number, number]
  local: [number, number]
  lastLocal: [number, number]
  velocity: number
  distance: number
  down: boolean
  first: boolean
  shiftKey: boolean
}

type Props = {
  onAction: OnAction
  onUp?: (state: State) => void
  onDown?: (state: State) => void
  window: Window
  touch: boolean
  mouse: boolean
}

type PropsArgs = Partial<Props> & {
  onAction: OnAction
}

type SetCallback = (state: State) => State
type Set = (cb: SetCallback) => void

function handlers(set: Set, props: Props) {
  const handleUp = (event: SwipeEvent) => {
    event.stopPropagation()
    event.preventDefault()
    set(state => {
      const newState = { ...state, down: false, first: false }
      // @ts-ignores
      if (props.onAction) props.onAction(newState)
      if (props.onUp) props.onUp(newState)
      return {
        ...newState,
        event,
        shiftKey: event.shiftKey,
        lastLocal: state.local
      }
    })
  }
  const handleDown = (event: any) => {
    event.stopPropagation()
    event.preventDefault()
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
      props.onAction!(newState)
      // @ts-ignore
      if (props.onDown) props.onDown(newState)
      return { ...newState }
    })
  }
  const handleMove = (event: any) => {
    event.stopPropagation()
    event.preventDefault()
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
      props.onAction && props.onAction!(newState)
      return { ...newState }
    })
  }

  const onDown = (e: SwipeEvent | MouseEvent): void => {
    if (props.mouse) {
      props.window.addEventListener(mouseMove, handleMove, { passive: false })
      // @ts-ignore
      props.window.addEventListener(mouseUp, onUp, { passive: false })
    }
    if (props.touch) {
      props.window.addEventListener(touchMove, handleMove, { passive: false })
      props.window.addEventListener(touchEnd, onUp, { passive: false })
    }

    handleDown(e)
  }

  const stop = () => {
    if (props.mouse) {
      props.window.removeEventListener(mouseMove, handleMove, {
        // @ts-ignore
        passive: false
      })
      // @ts-ignore
      props.window.removeEventListener(mouseUp, onUp, { passive: false })
    }
    if (props.touch) {
      props.window.removeEventListener(touchMove, handleMove, {
        // @ts-ignore
        passive: false
      })
      // @ts-ignore
      props.window.removeEventListener(touchEnd, onUp, { passive: false })
    }
  }

  const onUp = (e: SwipeEvent) => {
    stop()
    handleUp(e)
  }
  const output: {
    onMouseDown?: (e: SwipeEvent) => void
    onTouchStart?: (e: SwipeEvent) => void
  } = {}

  if (props.mouse) {
    output[`onMouseDown`] = onDown
  }

  if (props.touch) {
    output[`onTouchStart`] = onDown
  }
  return output
}

function Gesture(props: PropsArgs) {
  const propsWithDefaults = Object.assign({}, defaultProps, props) as Props
  let _state = initialState
  // @ts-ignore
  const set: Set = (cb: SetCallback) => (_state = cb(_state))
  return handlers(set, propsWithDefaults)
}

export default Gesture
