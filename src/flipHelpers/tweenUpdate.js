import { Tweenable } from "shifty"

// animejs' influence
Tweenable.formulas.easeOutElastic = function(t) {
  const p = 0.99
  return Math.pow(2, -10 * t) * Math.sin(((t - p / 4) * (2 * Math.PI)) / p) + 1
}

Tweenable.formulas.easeOutElasticBig = function(t) {
  const p = 0.6
  return Math.pow(2, -10 * t) * Math.sin(((t - p / 4) * (2 * Math.PI)) / p) + 1
}

export const getEasingName = easeToApply => {
  if (!Tweenable.formulas[easeToApply]) {
    const defaultEase = "easeOutExpo"
    console.error(
      `${easeToApply} was not recognized as a valid easing option, falling back to ${defaultEase}`
    )
    easeToApply = defaultEase
  }
  return easeToApply
}

export default function tweenUpdate({
  fromVals,
  toVals,
  duration,
  easing,
  delay,
  getOnUpdateFunc,
  onAnimationEnd
}) {
  const tweenable = new Tweenable()
  let timeoutId

  // force stop the animation
  const stop = () => {
    tweenable.stop.bind(tweenable)
    onAnimationEnd()
    if (timeoutId) clearTimeout(timeoutId)
  }
  // we use setTimeout instead of the tweenable delay prop
  // because it's easier to cancel
  tweenable.setConfig({
    from: fromVals,
    to: toVals,
    duration,
    easing: {
      opacity: "linear",
      matrix: getEasingName(easing)
    },
    step: getOnUpdateFunc(stop)
  })

  const start = () => {
    tweenable
      .tween()
      .then(onAnimationEnd)
      .catch(e => {
        // hmm
      })
  }

  if (delay) {
    timeoutId = setTimeout(start, delay)
  } else {
    start()
  }

  return stop
}
