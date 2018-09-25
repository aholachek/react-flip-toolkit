import { createSpring, staggeredSprings } from "./spring"

const initiateImmediateAnimations = immediate => {
  if (!immediate) return
  immediate.forEach(flipped => {
    createSpring(flipped)
    initiateImmediateAnimations(flipped.immediate)
  })
}

export default ({ staggerConfig, flipDict, topLevelChildren }) => {
  const initiateStaggeredAnimations = staggered => {
    if (!staggered || !Object.keys(staggered).length) return
    Object.keys(staggered).forEach(staggerKey => {
      const funcs =
        staggerConfig && staggerConfig[staggerKey] === "reverse"
          ? staggered[staggerKey].reverse()
          : staggered[staggerKey]

      staggeredSprings(funcs)
    })
  }

  //build a data struct to run the springs
  const d = {
    root: {
      staggered: {},
      immediate: []
    }
  }

  // helper function to build the nested structure
  const appendChild = (node, flipId) => {
    const flipData = flipDict[flipId]
    // might have been filtered (e.g. because it was off screen)
    if (!flipData) return
    flipData.staggered = {}
    flipData.immediate = []
    if (flipData.stagger) {
      node.staggered[flipData.stagger]
        ? node.staggered[flipData.stagger].push(flipDict[flipId])
        : (node.staggered[flipData.stagger] = [flipDict[flipId]])
    } else node.immediate.push(flipDict[flipId])

    // only when the spring is first activated, activate the child animations as well
    // this enables nested stagger
    flipData.onSpringActivate = () => {
      initiateImmediateAnimations(flipData.immediate)
      initiateStaggeredAnimations(flipData.staggered)
    }

    flipData.childIds.forEach(childId => appendChild(flipDict[flipId], childId))
  }

  // create the nested structure
  topLevelChildren.forEach(c => {
    appendChild(d.root, c)
  })

  initiateImmediateAnimations(d.root.immediate)
  initiateStaggeredAnimations(d.root.staggered)
}
