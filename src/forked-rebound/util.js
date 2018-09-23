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

/* eslint-disable flowtype/no-weak-types */

import _onFrame from "./onFrame"

// Cross browser/node timer functions.
export function onFrame(func: Function) {
  return _onFrame(func)
}

const start = Date.now()
export const performanceNow =
  typeof performance === "object" && typeof performance.now === "function"
    ? () => performance.now()
    : () => Date.now() - start

// Lop off the first occurence of the reference in the Array.
export function removeFirst<T>(array: Array<T>, item: T): void {
  const idx = array.indexOf(item)
  idx !== -1 && array.splice(idx, 1)
}
