import { toArray } from "../../utilities"
import * as constants from "../../constants"

const selectFlipChildIds = (base, selector) =>
  toArray(base.querySelectorAll(selector)).map(el => el.dataset.flipId)

const baseSelector = `[${constants.DATA_FLIP_ID}]`

export default flipDict => {
  const levelToChildren = {}

  const buildHierarchy = (selector, level, oldResult) => {
    const newSelector = `${selector} ${baseSelector}`
    const newResult = selectFlipChildIds(document, newSelector)

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

  buildHierarchy(baseSelector, 0, selectFlipChildIds(document, baseSelector))

  // now make sure childIds in each flippedData contains only direct children
  // since to enable nested stagger  we want each parent to be able to kick off
  // the animations only for its direct children
  Object.keys(flipDict).forEach(flipId => {
    const data = flipDict[flipId]
    data.childIds = selectFlipChildIds(data.element, baseSelector).filter(
      id => levelToChildren[data.level + 1].indexOf(id) > -1
    )
  })
  return { topLevelChildren: levelToChildren["0"] }
}
