import { Tweenable } from "shifty"

// animejs' influence
Tweenable.formulas.easeOutElastic = function(t) {
  var p = 0.99
  return Math.pow(2, -10 * t) * Math.sin(((t - p / 4) * (2 * Math.PI)) / p) + 1
}

Tweenable.formulas.easeOutElasticBig = function(t) {
  var p = 0.6
  return Math.pow(2, -10 * t) * Math.sin(((t - p / 4) * (2 * Math.PI)) / p) + 1
}

export const getEasingName = (flippedEase, flipperEase) => {
  let easeToApply = flippedEase || flipperEase

  if (!Tweenable.formulas[easeToApply]) {
    const fallbackEase = "easeOutExpo"
    console.error(
      `${easeToApply} was not recognized as a valid easing option, falling back to ${fallbackEase}`
    )
    return fallbackEase
  }
  return easeToApply
}

export default function tweenUpdate({ fromVals, toVals, duration, easing }) {
  // now start the animation
  const tweenable = new Tweenable()

  tweenable.setConfig({
    from: fromVals,
    to: toVals,
    duration: parseFloat(element.dataset.flipDuration || duration),
    easing: {
      opacity: "linear",
      matrix: getEasingName(easing)
    },
    delay: parseFloat(element.dataset.flipDelay),
    step: ({ matrix, opacity }) => {
      if (!body.contains(element)) {
        tweenable.stop()
        return
      }
      applyStyles(element, { opacity, matrix })

      // for children that requested it, cancel out
      // the transform by applying the inverse transform
      invertTransformsForChildren(getInvertedChildren(element, id), matrix, {
        flipStartId,
        flipEndId
      })
    }
  })

  tweenable
    .tween()
    .then(() => {
      delete inProgressAnimations[id]
      onComplete()
    })
    .catch(e => {
      // hmm
    })

  return tweenable.stop.bind(tweenable)
}
