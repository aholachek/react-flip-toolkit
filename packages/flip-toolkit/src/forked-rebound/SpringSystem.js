//
/**
 *  Copyright (c) 2013, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 *
 */

import { AnimationLooper } from './Loopers'
import Spring from './Spring'
import { removeFirst } from './util'

/**
 * A set of Springs that all run on the same physics
 * timing loop. To get started with a Rebound animation, first
 * create a new SpringSystem and then add springs to it.
 * @public
 */
class SpringSystem {
  constructor(looper) {
    this.looper = looper || new AnimationLooper()
    this.looper.springSystem = this

    this.listeners = []
    this._activeSprings = []
    this._idleSpringIndices = []
    this._isIdle = true
    this._lastTimeMillis = -1
    this._springRegistry = {}
  }

  /**
   * Add a new spring to this SpringSystem. This Spring will now be solved for
   * during the physics iteration loop. By default the spring will use the
   * default Origami spring config with 40 tension and 7 friction, but you can
   * also provide your own values here.
   * @public
   */
  createSpring(tension, friction) {
    return this.createSpringWithConfig({ tension, friction })
  }
  /**
   * Add a spring with the provided SpringConfig.
   * @public
   */
  createSpringWithConfig(springConfig) {
    const spring = new Spring(this)
    this.registerSpring(spring)
    spring.setSpringConfig(springConfig)
    return spring
  }

  /**
   * Check if a SpringSystem is idle or active. If all of the Springs in the
   * SpringSystem are at rest, i.e. the physics forces have reached equilibrium,
   * then this method will return true.
   * @public
   */
  getIsIdle() {
    return this._isIdle
  }

  /**
   * Manually add a spring to this system. This is called automatically
   * if a Spring is created with SpringSystem#createSpring.
   *
   * This method sets the spring up in the registry so that it can be solved
   * in the solver loop.
   * @public
   */
  registerSpring(spring) {
    this._springRegistry[spring.getId()] = spring
  }

  /**
   * Deregister a spring with this SpringSystem. The SpringSystem will
   * no longer consider this Spring during its integration loop once
   * this is called. This is normally done automatically for you when
   * you call Spring#destroy.
   * @public
   */
  deregisterSpring(spring) {
    removeFirst(this._activeSprings, spring)
    delete this._springRegistry[spring.getId()]
  }

  advance(time, deltaTime) {
    while (this._idleSpringIndices.length > 0) {
      this._idleSpringIndices.pop()
    }
    this._activeSprings.filter(Boolean).forEach(spring => {
      if (spring.systemShouldAdvance()) {
        spring.advance(time / 1000.0, deltaTime / 1000.0)
      } else {
        this._idleSpringIndices.push(this._activeSprings.indexOf(spring))
      }
    })

    while (this._idleSpringIndices.length > 0) {
      const idx = this._idleSpringIndices.pop()
      idx >= 0 && this._activeSprings.splice(idx, 1)
    }
  }

  /**
   * This is the main solver loop called to move the simulation
   * forward through time. Before each pass in the solver loop
   * onBeforeIntegrate is called on an any listeners that have
   * registered themeselves with the SpringSystem. This gives you
   * an opportunity to apply any constraints or adjustments to
   * the springs that should be enforced before each iteration
   * loop. Next the advance method is called to move each Spring in
   * the systemShouldAdvance forward to the current time. After the
   * integration step runs in advance, onAfterIntegrate is called
   * on any listeners that have registered themselves with the
   * SpringSystem. This gives you an opportunity to run any post
   * integration constraints or adjustments on the Springs in the
   * SpringSystem.
   * @public
   */
  loop(currentTimeMillis) {
    let listener
    if (this._lastTimeMillis === -1) {
      this._lastTimeMillis = currentTimeMillis - 1
    }
    const ellapsedMillis = currentTimeMillis - this._lastTimeMillis
    this._lastTimeMillis = currentTimeMillis

    let i = 0
    const len = this.listeners.length
    for (i = 0; i < len; i++) {
      listener = this.listeners[i]
      listener.onBeforeIntegrate && listener.onBeforeIntegrate(this)
    }

    this.advance(currentTimeMillis, ellapsedMillis)
    if (this._activeSprings.length === 0) {
      this._isIdle = true
      this._lastTimeMillis = -1
    }

    for (i = 0; i < len; i++) {
      listener = this.listeners[i]
      listener.onAfterIntegrate && listener.onAfterIntegrate(this)
    }

    if (!this._isIdle) {
      this.looper.run()
    }
  }

  /**
   * Used to notify the SpringSystem that a Spring has become displaced.
   * The system responds by starting its solver loop up if it is currently idle.
   */
  activateSpring(springId) {
    const spring = this._springRegistry[springId]
    if (this._activeSprings.indexOf(spring) === -1) {
      this._activeSprings.push(spring)
    }
    if (this.getIsIdle()) {
      this._isIdle = false
      this.looper.run()
    }
  }
}

export default SpringSystem
