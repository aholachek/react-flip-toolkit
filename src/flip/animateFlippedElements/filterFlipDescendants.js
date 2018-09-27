import { toArray } from "../../utilities"
import * as constants from "../../constants"

const selectFlipChildIds = (base, selector, flippedIds) => {
  const childIds = toArray(base.querySelectorAll(selector)).map(
    el => el.dataset.flipId
  )
  // now return an array ordered by the original order in the DOM
  return flippedIds.filter(id => childIds.indexOf(id) > -1)
}

const baseSelector = `[${constants.DATA_FLIP_ID}]`

export default (flipDict, flippedIds) => {
  const levelToChildren = {}

  const buildHierarchy = (selector, level, oldResult) => {
    const newSelector = `${selector} ${baseSelector}`
    const newResult = selectFlipChildIds(document, newSelector, flippedIds)

    const oldLevelChildren = oldResult.filter(
      id => newResult.indexOf(id) === -1
    )
    levelToChildren[level] = oldLevelChildren
    oldLevelChildren.forEach(childId => {
      if (flipDict[childId]) {
        flipDict[childId].level = level
      }
    })

    if (newResult.length !== 0)
      buildHierarchy(newSelector, level + 1, newResult)
  }

  buildHierarchy(
    baseSelector,
    0,
    selectFlipChildIds(document, baseSelector, flippedIds)
  )

  // now make sure childIds in each flippedData contains only direct children
  // since to enable nested stagger  we want each parent to be able to kick off
  // the animations only for its direct children
  Object.keys(flipDict).forEach(flipId => {
    const data = flipDict[flipId]
    data.childIds = selectFlipChildIds(
      data.element,
      baseSelector,
      flippedIds
    ).filter(id => levelToChildren[data.level + 1].indexOf(id) > -1)
  })
  return { topLevelChildren: levelToChildren["0"] }
}
