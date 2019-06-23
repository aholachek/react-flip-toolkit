import { createSpring, staggeredSprings } from './spring'
import {
  FlipDataDict,
  TopLevelChildren,
  InitiateStaggeredAnimations,
  FlipDataArray,
  StaggeredChildren,
  TreeNode
} from './types'
import { StaggerConfig } from '../../Flipper/types'
import { FlipId } from '../../Flipped/types'

const initiateImmediateAnimations = (
  immediate: FlipDataArray,
  isGestureControlled?: boolean
) => {
  if (!immediate) {
    return
  }
  immediate.forEach(flipped => {
    createSpring(flipped, isGestureControlled)
    initiateImmediateAnimations(flipped.immediateChildren, isGestureControlled)
  })
}

export const createCallTree = ({
  flipDataDict,
  topLevelChildren,
  initiateStaggeredAnimations,
  isGestureControlled
}: {
  flipDataDict: FlipDataDict
  topLevelChildren: TopLevelChildren
  initiateStaggeredAnimations: InitiateStaggeredAnimations
  isGestureControlled?: boolean
}) => {
  // build a data struct to run the springs
  const tree = {
    root: {
      staggeredChildren: {} as StaggeredChildren,
      immediateChildren: [] as FlipDataArray
    }
  }

  // helper function to build the nested structure
  const appendChild = (parent: TreeNode, childId: FlipId) => {
    const flipData = flipDataDict[childId]
    // might have been filtered (e.g. because it was off screen)
    if (!flipData) {
      return
    }

    if (flipData.stagger) {
      parent.staggeredChildren[flipData.stagger]
        ? parent.staggeredChildren[flipData.stagger].push(flipData)
        : (parent.staggeredChildren[flipData.stagger] = [flipData])
    } else {
      parent.immediateChildren.push(flipData)
    }

    // only when the spring is first activated, activate the child animations as well
    // this enables nested stagger
    flipData.onSpringActivate = () => {
      initiateImmediateAnimations(
        flipData.immediateChildren,
        isGestureControlled
      )
      initiateStaggeredAnimations(
        flipData.staggeredChildren,
        isGestureControlled
      )
    }

    flipData.staggeredChildren = {}
    flipData.immediateChildren = []

    flipData.childIds.forEach(childId => appendChild(flipData, childId))
  }

  // create the nested structure
  topLevelChildren.forEach(c => {
    appendChild(tree.root, c)
  })

  return tree
}

export default ({
  staggerConfig,
  flipDataDict,
  topLevelChildren,
  isGestureControlled
}: {
  staggerConfig: StaggerConfig
  flipDataDict: FlipDataDict
  topLevelChildren: TopLevelChildren
  isGestureControlled?: boolean
}) => {
  const initiateStaggeredAnimations: InitiateStaggeredAnimations = (
    staggered,
    isGestureControlled
  ) => {
    if (!staggered || !Object.keys(staggered).length) {
      return
    }
    Object.keys(staggered).forEach(staggerKey =>
      staggeredSprings(
        staggered[staggerKey],
        staggerConfig[staggerKey],
        isGestureControlled
      )
    )
  }

  const tree = createCallTree({
    flipDataDict,
    topLevelChildren,
    initiateStaggeredAnimations,
    isGestureControlled
  })

  initiateImmediateAnimations(tree.root.immediateChildren, isGestureControlled)
  initiateStaggeredAnimations(tree.root.staggeredChildren, isGestureControlled)
}
