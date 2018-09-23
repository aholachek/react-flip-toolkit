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

let _onFrame
if (typeof window !== "undefined") {
  _onFrame = window.requestAnimationFrame
}

_onFrame =
  _onFrame ||
  function(callback: () => mixed) {
    window.setTimeout(callback, 1000 / 60)
  }

export default _onFrame
