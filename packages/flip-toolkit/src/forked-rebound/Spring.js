/**
 *  Copyright (c) 2013, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 *
 *
 */

import { removeFirst } from './util'

class PhysicsState {
  constructor() {
    this.position = 0
    this.velocity = 0
  }
}

let ID = 0
const MAX_DELTA_TIME_SEC = 0.064
const SOLVER_TIMESTEP_SEC = 0.001

/**
 * Provides a model of a classical spring acting to
 * resolve a body to equilibrium. Springs have configurable
 * tension which is a force multipler on the displacement of the
 * spring from its rest point or `endValue` as defined by [Hooke's
 * law](http://en.wikipedia.org/wiki/Hooke's_law). Springs also have
 * configurable friction, which ensures that they do not oscillate
 * infinitely. When a Spring is displaced by updating it's resting
 * or `currentValue`, the SpringSystems that contain that Spring
 * will automatically start looping to solve for equilibrium. As each
 * timestep passes, `SpringListener` objects attached to the Spring
 * will be notified of the updates providing a way to drive an
 * animation off of the spring's resolution curve.
 * @public
 */
class Spring {
  constructor(springSystem) {
    this._id = `s${ID++}`
    this._springSystem = springSystem

    this.listeners = []
    this._startValue = 0

    this._currentState = new PhysicsState()
    this._displacementFromRestThreshold = 0.001
    this._endValue = 0
    this._overshootClampingEnabled = false
    this._previousState = new PhysicsState()
    this._restSpeedThreshold = 0.001

    this._tempState = new PhysicsState()
    this._timeAccumulator = 0
    this._wasAtRest = true
    // hack from alex -- only call 1x
    this._onActivateCalled
    this._cachedSpringConfig = {}
  }

  getId() {
    return this._id
  }

  /**
   * Remove a Spring from simulation and clear its listeners.
   * @public
   */
  destroy() {
    this.listeners = []
    this._springSystem.deregisterSpring(this)
  }

  /**
   * Set the configuration values for this Spring. A SpringConfig
   * contains the tension and friction values used to solve for the
   * equilibrium of the Spring in the physics loop.
   * @public
   */
  setSpringConfig(springConfig) {
    this._springConfig = springConfig
    return this
  }
  /**
   * Retrieve the current value of the Spring.
   * @public
   */
  getCurrentValue() {
    return this._currentState.position
  }

  /**
   * Get the absolute distance of the Spring from a given state value
   */
  getDisplacementDistanceForState(state) {
    return Math.abs(this._endValue - state.position)
  }

  /**
   * Set the endValue or resting position of the spring. If this
   * value is different than the current value, the SpringSystem will
   * be notified and will begin running its solver loop to resolve
   * the Spring to equilibrium. Any listeners that are registered
   * for onSpringEndStateChange will also be notified of this update
   * immediately.
   * @public
   */

  setEndValue(endValue) {
    if (endValue === this._endValue) return this
    this.prevEndValue = endValue
    if (this._endValue === endValue && this.isAtRest()) {
      return this
    }
    this._startValue = this.getCurrentValue()
    this._endValue = endValue
    this._springSystem.activateSpring(this.getId())
    for (let i = 0, len = this.listeners.length; i < len; i++) {
      const listener = this.listeners[i]
      const onChange = listener.onSpringEndStateChange
      onChange && onChange(this)
    }
    return this
  }

  /**
   * Set the current velocity of the Spring, in pixels per second. As
   * previously mentioned, this can be useful when you are performing
   * a direct manipulation gesture. When a UI element is released you
   * may call setVelocity on its animation Spring so that the Spring
   * continues with the same velocity as the gesture ended with. The
   * friction, tension, and displacement of the Spring will then
   * govern its motion to return to rest on a natural feeling curve.
   * @public
   */
  setVelocity(velocity) {
    if (velocity === this._currentState.velocity) {
      return this
    }
    this._currentState.velocity = velocity
    this._springSystem.activateSpring(this.getId())
    return this
  }

  setCurrentValue(currentValue) {
    this._startValue = currentValue
    this._currentState.position = currentValue
    for (var i = 0, len = this.listeners.length; i < len; i++) {
      var listener = this.listeners[i]
      listener.onSpringUpdate && listener.onSpringUpdate(this)
    }
    return this
  }

  setAtRest() {
    this._endValue = this._currentState.position
    this._tempState.position = this._currentState.position
    this._currentState.velocity = 0
    return this
  }

  /**
   * Enable overshoot clamping. This means that the Spring will stop
   * immediately when it reaches its resting position regardless of
   * any existing momentum it may have. This can be useful for certain
   * types of animations that should not oscillate such as a scale
   * down to 0 or alpha fade.
   * @public
   */
  setOvershootClampingEnabled(enabled) {
    this._overshootClampingEnabled = enabled
    return this
  }

  /**
   * Check if the Spring has gone past its end point by comparing
   * the direction it was moving in when it started to the current
   * position and end value.
   * @public
   */
  isOvershooting() {
    const start = this._startValue
    const end = this._endValue
    return (
      this._springConfig.tension > 0 &&
      ((start < end && this.getCurrentValue() > end) ||
        (start > end && this.getCurrentValue() < end))
    )
  }

  /**
   * The main solver method for the Spring. It takes
   * the current time and delta since the last time step and performs
   * an RK4 integration to get the new position and velocity state
   * for the Spring based on the tension, friction, velocity, and
   * displacement of the Spring.
   * @public
   */
  advance(time, realDeltaTime) {
    let isAtRest = this.isAtRest()

    if (isAtRest && this._wasAtRest) {
      return
    }

    let adjustedDeltaTime = realDeltaTime
    if (realDeltaTime > MAX_DELTA_TIME_SEC) {
      adjustedDeltaTime = MAX_DELTA_TIME_SEC
    }

    this._timeAccumulator += adjustedDeltaTime

    const tension = this._springConfig.tension
    const friction = this._springConfig.friction
    let position = this._currentState.position
    let velocity = this._currentState.velocity
    let tempPosition = this._tempState.position
    let tempVelocity = this._tempState.velocity
    let aVelocity
    let aAcceleration
    let bVelocity
    let bAcceleration
    let cVelocity
    let cAcceleration
    let dVelocity
    let dAcceleration
    let dxdt
    let dvdt

    while (this._timeAccumulator >= SOLVER_TIMESTEP_SEC) {
      this._timeAccumulator -= SOLVER_TIMESTEP_SEC

      if (this._timeAccumulator < SOLVER_TIMESTEP_SEC) {
        this._previousState.position = position
        this._previousState.velocity = velocity
      }

      aVelocity = velocity
      aAcceleration =
        tension * (this._endValue - tempPosition) - friction * velocity

      tempPosition = position + aVelocity * SOLVER_TIMESTEP_SEC * 0.5
      tempVelocity = velocity + aAcceleration * SOLVER_TIMESTEP_SEC * 0.5
      bVelocity = tempVelocity
      bAcceleration =
        tension * (this._endValue - tempPosition) - friction * tempVelocity

      tempPosition = position + bVelocity * SOLVER_TIMESTEP_SEC * 0.5
      tempVelocity = velocity + bAcceleration * SOLVER_TIMESTEP_SEC * 0.5
      cVelocity = tempVelocity
      cAcceleration =
        tension * (this._endValue - tempPosition) - friction * tempVelocity

      tempPosition = position + cVelocity * SOLVER_TIMESTEP_SEC
      tempVelocity = velocity + cAcceleration * SOLVER_TIMESTEP_SEC
      dVelocity = tempVelocity
      dAcceleration =
        tension * (this._endValue - tempPosition) - friction * tempVelocity

      dxdt =
        (1.0 / 6.0) * (aVelocity + 2.0 * (bVelocity + cVelocity) + dVelocity)
      dvdt =
        (1.0 / 6.0) *
        (aAcceleration + 2.0 * (bAcceleration + cAcceleration) + dAcceleration)

      position += dxdt * SOLVER_TIMESTEP_SEC
      velocity += dvdt * SOLVER_TIMESTEP_SEC
    }

    this._tempState.position = tempPosition
    this._tempState.velocity = tempVelocity

    this._currentState.position = position
    this._currentState.velocity = velocity

    if (this._timeAccumulator > 0) {
      this._interpolate(this._timeAccumulator / SOLVER_TIMESTEP_SEC)
    }

    if (
      this.isAtRest() ||
      (this._overshootClampingEnabled && this.isOvershooting())
    ) {
      if (this._springConfig.tension > 0) {
        this._startValue = this._endValue
        this._currentState.position = this._endValue
      } else {
        this._endValue = this._currentState.position
        this._startValue = this._endValue
      }
      this.setVelocity(0)
      isAtRest = true
    }

    let notifyActivate = false
    if (this._wasAtRest) {
      this._wasAtRest = false
      notifyActivate = true
    }

    let notifyAtRest = false
    if (isAtRest) {
      this._wasAtRest = true
      notifyAtRest = true
    }

    this.notifyPositionUpdated(notifyActivate, notifyAtRest)
  }

  notifyPositionUpdated(notifyActivate, notifyAtRest) {
    this.listeners.filter(Boolean).forEach(listener => {
      if (
        notifyActivate &&
        listener.onSpringActivate &&
        !this._onActivateCalled
      ) {
        listener.onSpringActivate(this)
        this._onActivateCalled = true
      }

      if (listener.onSpringUpdate) {
        listener.onSpringUpdate(this)
      }

      if (notifyAtRest && listener.onSpringAtRest) {
        listener.onSpringAtRest(this)
      }
    })
  }

  /**
   * Check if the SpringSystem should advance. Springs are advanced
   * a final frame after they reach equilibrium to ensure that the
   * currentValue is exactly the requested endValue regardless of the
   * displacement threshold.
   * @public
   */
  systemShouldAdvance() {
    return !this.isAtRest() || !this.wasAtRest()
  }

  wasAtRest() {
    return this._wasAtRest
  }

  /**
   * Check if the Spring is atRest meaning that it's currentValue and
   * endValue are the same and that it has no velocity. The previously
   * described thresholds for speed and displacement define the bounds
   * of this equivalence check. If the Spring has 0 tension, then it will
   * be considered at rest whenever its absolute velocity drops below the
   * restSpeedThreshold.
   * @public
   */
  isAtRest() {
    const isAtRest =
      Math.abs(this._currentState.velocity) < this._restSpeedThreshold &&
      (this.getDisplacementDistanceForState(this._currentState) <=
        this._displacementFromRestThreshold ||
        this._springConfig.tension === 0)
    return isAtRest
  }

  _interpolate(alpha) {
    this._currentState.position =
      this._currentState.position * alpha +
      this._previousState.position * (1 - alpha)
    this._currentState.velocity =
      this._currentState.velocity * alpha +
      this._previousState.velocity * (1 - alpha)
  }

  addListener(newListener) {
    this.listeners.push(newListener)
    return this
  }

  addOneTimeListener(newListener) {
    const oneTimeFunc = func => (...args) => {
      func(...args)
      this.removeListener(newListener)
    }
    Object.keys(newListener).forEach(key => {
      newListener[key] = oneTimeFunc(newListener[key])
    })
    this.listeners.push(newListener)
    return this
  }

  removeListener(listenerToRemove) {
    removeFirst(this.listeners, listenerToRemove)
    return this
  }
}

export default Spring
