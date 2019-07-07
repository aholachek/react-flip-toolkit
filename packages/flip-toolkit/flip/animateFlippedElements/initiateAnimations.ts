import { createSpring, staggeredSprings } from './spring'
import {
  FlipDataDict,
  TopLevelChildren,
  InitiateStaggeredAnimations,
  FlipDataArray,
  StaggeredChildren,
  TreeNode
} from './types'
import { StaggerConfig, FlipId } from '../../types'

const initiateImmediateAnimations = (immediate: FlipDataArray) => {
  if (!immediate) {
    return
  }
  immediate.forEach(flipped => {
    createSpring(flipped)
    initiateImmediateAnimations(flipped.immediateChildren)
  })
}

export const createCallTree = ({
  flipDataDict,
  topLevelChildren,
  initiateStaggeredAnimations
}: {
  flipDataDict: FlipDataDict
  topLevelChildren: TopLevelChildren
  initiateStaggeredAnimations: InitiateStaggeredAnimations
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
      initiateImmediateAnimations(flipData.immediateChildren)
      initiateStaggeredAnimations(flipData.staggeredChildren)
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
  topLevelChildren
}: {
  staggerConfig: StaggerConfig
  flipDataDict: FlipDataDict
  topLevelChildren: TopLevelChildren
}) => {
  const initiateStaggeredAnimations: InitiateStaggeredAnimations = staggered => {
    if (!staggered || !Object.keys(staggered).length) {
      return
    }
    Object.keys(staggered).forEach(staggerKey =>
      staggeredSprings(staggered[staggerKey], staggerConfig[staggerKey])
    )
  }

  const tree = createCallTree({
    flipDataDict,
    topLevelChildren,
    initiateStaggeredAnimations
  })

  initiateImmediateAnimations(tree.root.immediateChildren)
  initiateStaggeredAnimations(tree.root.staggeredChildren)
}
