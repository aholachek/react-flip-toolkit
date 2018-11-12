import onFlipKeyUpdate from "./flip"
import { getFlippedElementPositionsBeforeUpdate } from "./flip/getFlippedElementPositions"
import { assign } from "./utilities"

class Flipper {
  constructor({
    element,
    staggerConfig,
    spring,
    applyTransformOrigin,
    handleEnterUpdateDelete,
    debug,
    decisionData
  }) {
    this.element = element
    this.staggerConfig = staggerConfig
    this.spring = spring
    this.applyTransformOrigin =
      applyTransformOrigin === undefined ? true : applyTransformOrigin
    this.handleEnterUpdateDelete = handleEnterUpdateDelete
    this.debug = debug
    this.decisionData = decisionData

    this.inProgressAnimations = {}
    this.flipCallbacks = {}

    this.recordBeforeUpdate = this.recordBeforeUpdate.bind(this)
    this.onUpdate = this.onUpdate.bind(this)
    this.addFlipped = this.addFlipped.bind(this)
    this.addInverted = this.addInverted.bind(this)
  }

  recordBeforeUpdate() {
    this.snapshot = getFlippedElementPositionsBeforeUpdate({
      element: this.element,
      flipCallbacks: this.flipCallbacks,
      inProgressAnimations: this.inProgressAnimations
    })
  }
  onUpdate() {
    if (this.snapshot) {
      onFlipKeyUpdate({
        cachedFlipChildrenPositions: this.snapshot.flippedElementPositions,
        cachedOrderedFlipIds: this.snapshot.cachedOrderedFlipIds,
        containerEl: this.element,
        inProgressAnimations: this.inProgressAnimations,
        flipCallbacks: this.flipCallbacks,
        applyTransformOrigin: this.applyTransformOrigin,
        spring: this.spring,
        debug: this.debug,
        staggerConfig: this.staggerConfig,
        handleEnterUpdateDelete: this.handleEnterUpdateDelete,
        decisionData: this.decisionData
      })
      this.snapshot = null
    }
  }

  addFlipped({
    element,
    flipId,
    opacity,
    translate,
    scale,
    transformOrigin,
    spring,
    stagger,
    onAppear,
    onStart,
    onComplete,
    onExit,
    shouldFlip
  }) {
    if (!element) throw new Error("no element provided")
    if (!flipId) throw new Error("No flipId provided")
    const flipConfig = {
      scale,
      translate,
      opacity,
      transformOrigin,
      spring,
      stagger
    }
    if (!flipConfig.scale && !flipConfig.translate && !flipConfig.opacity) {
      assign(flipConfig, {
        translate: true,
        scale: true,
        opacity: true
      })
    }
    if (flipId) element.dataset.flipId = flipId
    element.dataset.flipConfig = JSON.stringify(flipConfig)
    // finally, add callbacks
    this.flipCallbacks[flipId] = {
      shouldFlip,
      onAppear,
      onStart,
      onComplete,
      onExit
    }
  }

  addInverted({ element, parent, opacity, translate, scale, transformOrigin }) {
    if (!element) throw new Error("no element provided")
    if (!parent) throw new Error("parent must be provided")

    const inverseFlipId = parent.dataset.flipId
    const flipConfig = {
      scale,
      translate,
      opacity,
      transformOrigin
    }
    if (!flipConfig.scale && !flipConfig.translate && !flipConfig.opacity) {
      assign(flipConfig, {
        translate: true,
        scale: true,
        opacity: true
      })
    }
    element.dataset.inverseFlipId = inverseFlipId
    element.dataset.flipConfig = JSON.stringify(flipConfig)
  }
}

export default Flipper
