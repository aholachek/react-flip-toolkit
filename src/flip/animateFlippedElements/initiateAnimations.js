import { createSpring, staggeredSprings } from "./spring"

const initiateImmediateAnimations = immediate => {
  if (!immediate) return
  immediate.forEach(flipped => {
    createSpring(flipped)
    initiateImmediateAnimations(flipped.immediate)
  })
}

export const createCallTree = ({
  flipDict,
  topLevelChildren,
  initiateStaggeredAnimations
}) => {
  //build a data struct to run the springs
  const tree = {
    root: {
      staggeredChildren: {},
      immediateChildren: []
    }
  }

  // helper function to build the nested structure
  const appendChild = (parent, childId) => {
    const flipData = flipDict[childId]
    // might have been filtered (e.g. because it was off screen)
    if (!flipData) return

    if (flipData.stagger) {
      parent.staggeredChildren[flipData.stagger]
        ? parent.staggeredChildren[flipData.stagger].push(flipData)
        : (parent.staggeredChildren[flipData.stagger] = [flipData])
    } else parent.immediateChildren.push(flipData)

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

export default ({ staggerConfig, flipDict, topLevelChildren }) => {
  const initiateStaggeredAnimations = staggered => {
    if (!staggered || !Object.keys(staggered).length) return
    Object.keys(staggered).forEach(staggerKey =>
      staggeredSprings(staggered[staggerKey], staggerConfig[staggerKey])
    )
  }

  const tree = createCallTree({
    flipDict,
    topLevelChildren,
    initiateStaggeredAnimations
  })

  initiateImmediateAnimations(tree.root.immediateChildren)
  initiateStaggeredAnimations(tree.root.staggeredChildren)
}
