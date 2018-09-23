/**
 *  Copyright (c) 2013, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

import type SpringSystem from "./SpringSystem"
import { onFrame, performanceNow } from "./util"

/**
 * Plays each frame of the SpringSystem on animation
 * timing loop. This is the default type of looper for a new spring system
 * as it is the most common when developing UI.
 * @public
 */
export class AnimationLooper {
  springSystem: ?SpringSystem = null

  run() {
    onFrame(() => {
      this.springSystem.loop(performanceNow())
    })
  }
}

/**
 * Resolves the SpringSystem to a resting state in a
 * tight and blocking loop. This is useful for synchronously generating
 * pre-recorded animations that can then be played on a timing loop later.
 * Sometimes this lead to better performance to pre-record a single spring
 * curve and use it to drive many animations; however, it can make dynamic
 * response to user input a bit trickier to implement.
 * @public
 */
export class SimulationLooper {
  springSystem: ?SpringSystem = null
  timestep: number
  time: number = 0
  running: boolean = false

  constructor(timestep: number) {
    this.timestep = timestep || 16.667
  }

  run() {
    if (this.running) {
      return
    }
    this.running = true
    while (!this.springSystem.getIsIdle()) {
      this.springSystem.loop((this.time += this.timestep))
    }
    this.running = false
  }
}
