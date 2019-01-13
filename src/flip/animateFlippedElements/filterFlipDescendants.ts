import { toArray } from '../../utilities'
import * as constants from '../../constants'
import { ScopedSelector, LevelToChildren, FlipDataDict } from './types'
import { FlippedIds } from '../types'

// scoped selector makes sure we're querying inside the right Flipper
// container, either internally or with the right portal key
const selectFlipChildIds = (
  scopedSelector: ScopedSelector,
  selector: string,
  flippedIds: FlippedIds
): string[] => {
  const childIds = scopedSelector(selector).map(
    (el: HTMLElement) => el.dataset.flipId
  )
  // now return an array ordered by the original order in the DOM
  return flippedIds.filter(id => childIds.indexOf(id) > -1)
}

const baseSelector = `[${constants.DATA_FLIP_ID}]`

export default ({
  flipDataDict,
  flippedIds,
  scopedSelector
}: {
  flipDataDict: FlipDataDict
  flippedIds: FlippedIds
  scopedSelector: ScopedSelector
}) => {
  const levelToChildren: LevelToChildren = {}

  const buildHierarchy = (
    selector: string,
    level: number,
    oldResult: string[]
  ) => {
    const newSelector = `${selector} ${baseSelector}`
    // make sure this is scoped to the Flipper element in case there are
    // mulitiple Flipper elements on the page
    const newResult = selectFlipChildIds(
      scopedSelector,
      newSelector,
      flippedIds
    )

    const oldLevelChildren = oldResult.filter(
      id => newResult.indexOf(id) === -1
    )
    levelToChildren[level] = oldLevelChildren
    oldLevelChildren.forEach(childId => {
      if (flipDataDict[childId]) {
        flipDataDict[childId].level = level
      }
    })

    if (newResult.length !== 0) {
      buildHierarchy(newSelector, level + 1, newResult)
    }
  }

  // the top level selectChildFlipIds should use the scopedSelector
  buildHierarchy(
    baseSelector,
    0,
    selectFlipChildIds(scopedSelector, baseSelector, flippedIds)
  )

  // now make sure childIds in each flippedData contains only direct children
  // since to enable nested stagger we want each parent to be able to kick off
  // the animations only for its direct children
  Object.keys(flipDataDict).forEach(flipId => {
    const data = flipDataDict[flipId]
    // scope by parent element
    data.childIds = selectFlipChildIds(
      selector => toArray(data.element.querySelectorAll(selector)),
      baseSelector,
      flippedIds
    )

    data.childIds = data.childIds.filter(
      id =>
        levelToChildren[data.level + 1] &&
        levelToChildren[data.level + 1].indexOf(id) > -1
    )
  })
  return levelToChildren['0']
}
