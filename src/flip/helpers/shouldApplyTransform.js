/**
 * @function passesComponentFilter
 * @param {Object|String} flipComponentIdFilter
 * @param {String} flipId
 * @returns {Boolean}
 */
const passesComponentFilter = (flipComponentIdFilter, flipId) => {
  if (typeof flipComponentIdFilter === "string") {
    if (flipComponentIdFilter !== flipId) return false
  } else if (Array.isArray(flipComponentIdFilter)) {
    if (!flipComponentIdFilter.some(f => f === flipId)) {
      return false
    }
  }
  return true
}

/**
 * @function shouldApplyTransform
 * @param {Object|String} flipComponentIdFilter
 * @param {String} flipStartId
 * @param {String} flipEndId
 * @returns {Boolean}
 */
const shouldApplyTransform = (
  flipComponentIdFilter,
  flipStartId,
  flipEndId
) => {
  if (
    flipComponentIdFilter &&
    !passesComponentFilter(flipComponentIdFilter, flipStartId) &&
    !passesComponentFilter(flipComponentIdFilter, flipEndId)
  ) {
    return false
  }
  return true
}

export default shouldApplyTransform
