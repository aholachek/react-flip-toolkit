// edited from https://github.com/react-spring/react-use-gesture/blob/v4.0.7/index.js
const touchMove = 'touchmove'
const touchEnd = 'touchend'
const mouseMove = 'mousemove'
const mouseUp = 'mouseup'
const initialState = {
  event: undefined,
  args: undefined,
  temp: undefined,
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

function handlers(set, props = {}, args) {
  // Common handlers
  const handleUp = (event, shiftKey) => {
    event.stopPropagation()
    event.preventDefault()
    set(state => {
      const newProps = { ...state, down: false, first: false }
      const temp = props.onAction && props.onAction(newProps)
      if (props.onUp) props.onUp(newProps)
      return {
        ...newProps,
        event,
        shiftKey,
        lastLocal: state.local,
        temp: temp || newProps.temp
      }
    })
  }
  const handleDown = event => {
    event.stopPropagation()
    event.preventDefault()
    const { target, pageX, pageY, shiftKey } = event.touches
      ? event.touches[0]
      : event
    set(state => {
      const lastLocal = state.lastLocal || initialState.lastLocal
      const newProps = {
        ...initialState,
        event,
        target,
        args,
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
      const temp = props.onAction && props.onAction(newProps)
      if (props.onDown) props.onDown(newProps)
      return { ...newProps, temp }
    })
  }
  const handleMove = event => {
    event.stopPropagation()
    event.preventDefault()
    const { pageX, pageY, shiftKey } = event.touches ? event.touches[0] : event
    set(state => {
      const time = Date.now()
      const x_dist = pageX - state.xy[0]
      const y_dist = pageY - state.xy[1]
      const delta_x = pageX - state.initial[0]
      const delta_y = pageY - state.initial[1]
      const distance = Math.sqrt(delta_x * delta_x + delta_y * delta_y)
      const len = Math.sqrt(x_dist * x_dist + y_dist * y_dist)
      const scalar = 1 / (len || 1)
      const newProps = {
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
      const temp = props.onAction && props.onAction(newProps)
      return { ...newProps, temp: temp || newProps.temp }
    })
  }

  const onDown = e => {
    if (props.mouse) {
      props.window.addEventListener(mouseMove, handleMove, { passive: false })
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
        passive: false
      })
      props.window.removeEventListener(mouseUp, onUp, { passive: false })
    }
    if (props.touch) {
      props.window.removeEventListener(touchMove, handleMove, {
        passive: false
      })
      props.window.removeEventListener(touchEnd, onUp, { passive: false })
    }
  }

  const onUp = e => {
    const { shiftKey } = e

    stop()

    handleUp(e, shiftKey)
  }
  const output = {}

  if (props.mouse) {
    output[`onMouseDown`] = onDown
  }

  if (props.touch) {
    output[`onTouchStart`] = onDown
  }
  return output
}

const defaultProps = {
  window,
  touch: true,
  mouse: true,
  passive: { passive: false },
  onAction: undefined,
  onDown: undefined,
  onUp: undefined
}

function Gesture(props) {
  props = Object.assign({}, defaultProps, props)
  let _state = initialState
  const set = cb => (_state = cb(_state))
  return handlers(set, props)
}

export default Gesture
