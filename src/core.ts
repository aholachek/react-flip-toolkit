import onFlipKeyUpdate from './flip'
import getFlippedElementPositionsBeforeUpdate from './flip/getFlippedElementPositions/getFlippedElementPositionsBeforeUpdate'
import { assign } from './utilities'
import {
  StaggerConfig,
  HandleEnterUpdateDelete,
  InProgressAnimations,
  FlipCallbacks
} from './Flipper/types'
import { FlippedProps } from './Flipped/types'
import { SpringOption } from './springSettings/types'
import { FlippedElementPositionsBeforeUpdate } from './flip/getFlippedElementPositions/getFlippedElementPositionsBeforeUpdate/types'
import { FlippedIds } from './flip/types'

class Flipper {
  private element!: HTMLElement
  private staggerConfig!: StaggerConfig
  private applyTransformOrigin: boolean = true
  private handleEnterUpdateDelete!: HandleEnterUpdateDelete
  private debug!: boolean
  private spring!: SpringOption
  private inProgressAnimations: InProgressAnimations
  private flipCallbacks: FlipCallbacks
  private snapshot!: {
    flippedElementPositions: FlippedElementPositionsBeforeUpdate
    cachedOrderedFlipIds: FlippedIds
  }
  private retainTransform: boolean = false

  constructor(options: {
    element: HTMLElement
    staggerConfig: StaggerConfig
    spring: SpringOption
    applyTransformOrigin: boolean
    handleEnterUpdateDelete: HandleEnterUpdateDelete
    debug: boolean,
    retainTransform: boolean
  }) {
    assign(this, options)

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
  onUpdate(prevDecisionData, currentDecisionData) {
    if (this.snapshot) {
      onFlipKeyUpdate({
        flippedElementPositionsBeforeUpdate: this.snapshot
          .flippedElementPositions,
        cachedOrderedFlipIds: this.snapshot.cachedOrderedFlipIds,
        containerEl: this.element,
        inProgressAnimations: this.inProgressAnimations,
        flipCallbacks: this.flipCallbacks,
        applyTransformOrigin: this.applyTransformOrigin,
        spring: this.spring,
        debug: this.debug,
        staggerConfig: this.staggerConfig,
        handleEnterUpdateDelete: this.handleEnterUpdateDelete,
        retainTransform: this.retainTransform,
        decisionData: {
          prev: prevDecisionData,
          current: currentDecisionData
        }
      })
      delete this.snapshot
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
    shouldFlip,
    shouldInvert
  }: FlippedProps & { element: HTMLElement }) {
    if (!element) {
      throw new Error('no element provided')
    }
    if (!flipId) {
      throw new Error('No flipId provided')
    }
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
    if (flipId) {
      element.dataset.flipId = flipId
    }
    element.dataset.flipConfig = JSON.stringify(flipConfig)
    // finally, add callbacks
    this.flipCallbacks[flipId] = {
      shouldFlip,
      shouldInvert,
      onAppear,
      onStart,
      onComplete,
      onExit
    }
  }

  addInverted({
    element,
    parent,
    opacity,
    translate,
    scale,
    transformOrigin
  }: {
    element: HTMLElement
    parent: HTMLElement
    opacity: boolean
    translate: boolean
    scale: boolean
    transformOrigin: string
  }) {
    if (!element) {
      throw new Error('no element provided')
    }
    if (!parent) {
      throw new Error('parent must be provided')
    }

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
