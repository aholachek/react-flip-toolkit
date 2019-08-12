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

export { default as onFrame } from './onFrame'

const start = Date.now()
export const performanceNow =
  typeof performance === 'object' && typeof performance.now === 'function'
    ? () => performance.now()
    : () => Date.now() - start

// Lop off the first occurence of the reference in the Array.
export function removeFirst(array, item) {
  const idx = array.indexOf(item)
  idx !== -1 && array.splice(idx, 1)
}
