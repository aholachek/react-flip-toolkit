/*!
 * All equations are adapted from Thomas Fuchs'
 * [Scripty2](https://github.com/madrobby/scripty2/blob/master/src/effects/transitions/penner.js).
 *
 * Based on Easing Equations (c) 2003 [Robert
 * Penner](http://www.robertpenner.com/), all rights reserved. This work is
 * [subject to terms](http://www.robertpenner.com/easing_terms_of_use.html).
 */

/*!
 *  TERMS OF USE - EASING EQUATIONS
 *  Open source under the BSD License.
 *  Easing Equations (c) 2003 Robert Penner, all rights reserved.
 */

/**
 * @member shifty.Tweenable.formulas
 * @description A static Object of {@link shifty.easingFunction}s that can by
 * used by Shifty. The default values are defined in
 * [`easing-functions.js`](easing-functions.js.html), but you can add your own
 * {@link shifty.easingFunction}s by defining them as keys to this Object.
 *
 * Shifty ships with an implementation of [Robert Penner's easing
 * equations](http://robertpenner.com/easing/), as adapted from
 * [Scripty2](https://github.com/madrobby/scripty2/blob/master/src/effects/transitions/penner.js)'s
 * implementation.
 * <p data-height="934" data-theme-id="0" data-slug-hash="wqObdO"
 * data-default-tab="js,result" data-user="jeremyckahn" data-embed-version="2"
 * data-pen-title="Shifty - Easing formula names" class="codepen">See the Pen <a
 * href="https://codepen.io/jeremyckahn/pen/wqObdO/">Shifty - Easing formula
 * names</a> by Jeremy Kahn (<a
 * href="https://codepen.io/jeremyckahn">@jeremyckahn</a>) on <a
 * href="https://codepen.io">CodePen</a>.</p>
 * <script async
 * src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
 * @type {Object.<shifty.easingFunction>}
 * @static
 */
export const linear = pos => pos

export const easeInQuad = pos => Math.pow(pos, 2)

export const easeOutQuad = pos => -(Math.pow(pos - 1, 2) - 1)

export const easeInOutQuad = pos =>
  (pos /= 0.5) < 1 ? 0.5 * Math.pow(pos, 2) : -0.5 * ((pos -= 2) * pos - 2)

export const easeInCubic = pos => Math.pow(pos, 3)

export const easeOutCubic = pos => Math.pow(pos - 1, 3) + 1

export const easeInOutCubic = pos =>
  (pos /= 0.5) < 1 ? 0.5 * Math.pow(pos, 3) : 0.5 * (Math.pow(pos - 2, 3) + 2)

export const easeInQuart = pos => Math.pow(pos, 4)

export const easeOutQuart = pos => -(Math.pow(pos - 1, 4) - 1)

export const easeInOutQuart = pos =>
  (pos /= 0.5) < 1
    ? 0.5 * Math.pow(pos, 4)
    : -0.5 * ((pos -= 2) * Math.pow(pos, 3) - 2)

export const easeInQuint = pos => Math.pow(pos, 5)

export const easeOutQuint = pos => Math.pow(pos - 1, 5) + 1

export const easeInOutQuint = pos =>
  (pos /= 0.5) < 1 ? 0.5 * Math.pow(pos, 5) : 0.5 * (Math.pow(pos - 2, 5) + 2)

export const easeInSine = pos => -Math.cos(pos * (Math.PI / 2)) + 1

export const easeOutSine = pos => Math.sin(pos * (Math.PI / 2))

export const easeInOutSine = pos => -0.5 * (Math.cos(Math.PI * pos) - 1)

export const easeInExpo = pos => (pos === 0 ? 0 : Math.pow(2, 10 * (pos - 1)))

export const easeOutExpo = pos => (pos === 1 ? 1 : -Math.pow(2, -10 * pos) + 1)

export const easeInOutExpo = pos => {
  if (pos === 0) {
    return 0
  }

  if (pos === 1) {
    return 1
  }

  if ((pos /= 0.5) < 1) {
    return 0.5 * Math.pow(2, 10 * (pos - 1))
  }

  return 0.5 * (-Math.pow(2, -10 * --pos) + 2)
}

export const easeInCirc = pos => -(Math.sqrt(1 - pos * pos) - 1)

export const easeOutCirc = pos => Math.sqrt(1 - Math.pow(pos - 1, 2))

export const easeInOutCirc = pos =>
  (pos /= 0.5) < 1
    ? -0.5 * (Math.sqrt(1 - pos * pos) - 1)
    : 0.5 * (Math.sqrt(1 - (pos -= 2) * pos) + 1)

export const easeOutBounce = pos => {
  if (pos < 1 / 2.75) {
    return 7.5625 * pos * pos
  } else if (pos < 2 / 2.75) {
    return 7.5625 * (pos -= 1.5 / 2.75) * pos + 0.75
  } else if (pos < 2.5 / 2.75) {
    return 7.5625 * (pos -= 2.25 / 2.75) * pos + 0.9375
  } else {
    return 7.5625 * (pos -= 2.625 / 2.75) * pos + 0.984375
  }
}

export const easeInBack = pos => {
  const s = 1.70158
  return pos * pos * ((s + 1) * pos - s)
}

export const easeOutBack = pos => {
  const s = 1.70158
  return (pos = pos - 1) * pos * ((s + 1) * pos + s) + 1
}

export const easeInOutBack = pos => {
  let s = 1.70158
  if ((pos /= 0.5) < 1) {
    return 0.5 * (pos * pos * (((s *= 1.525) + 1) * pos - s))
  }
  return 0.5 * ((pos -= 2) * pos * (((s *= 1.525) + 1) * pos + s) + 2)
}

export const elastic = pos =>
  -1 * Math.pow(4, -8 * pos) * Math.sin(((pos * 6 - 1) * (2 * Math.PI)) / 2) + 1

export const swingFromTo = pos => {
  let s = 1.70158
  return (pos /= 0.5) < 1
    ? 0.5 * (pos * pos * (((s *= 1.525) + 1) * pos - s))
    : 0.5 * ((pos -= 2) * pos * (((s *= 1.525) + 1) * pos + s) + 2)
}

export const swingFrom = pos => {
  const s = 1.70158
  return pos * pos * ((s + 1) * pos - s)
}

export const swingTo = pos => {
  const s = 1.70158
  return (pos -= 1) * pos * ((s + 1) * pos + s) + 1
}

export const bounce = pos => {
  if (pos < 1 / 2.75) {
    return 7.5625 * pos * pos
  } else if (pos < 2 / 2.75) {
    return 7.5625 * (pos -= 1.5 / 2.75) * pos + 0.75
  } else if (pos < 2.5 / 2.75) {
    return 7.5625 * (pos -= 2.25 / 2.75) * pos + 0.9375
  } else {
    return 7.5625 * (pos -= 2.625 / 2.75) * pos + 0.984375
  }
}

export const bouncePast = pos => {
  if (pos < 1 / 2.75) {
    return 7.5625 * pos * pos
  } else if (pos < 2 / 2.75) {
    return 2 - (7.5625 * (pos -= 1.5 / 2.75) * pos + 0.75)
  } else if (pos < 2.5 / 2.75) {
    return 2 - (7.5625 * (pos -= 2.25 / 2.75) * pos + 0.9375)
  } else {
    return 2 - (7.5625 * (pos -= 2.625 / 2.75) * pos + 0.984375)
  }
}

export const easeFromTo = pos =>
  (pos /= 0.5) < 1
    ? 0.5 * Math.pow(pos, 4)
    : -0.5 * ((pos -= 2) * Math.pow(pos, 3) - 2)

export const easeFrom = pos => Math.pow(pos, 4)

export const easeTo = pos => Math.pow(pos, 0.25)
