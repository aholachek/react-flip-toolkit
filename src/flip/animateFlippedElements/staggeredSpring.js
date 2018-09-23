import { SpringSystem, SimulationLooper, onFrame } from "../../forked-rebound"

const springSystem = new SpringSystem(new SimulationLooper())

// adapted from
// https://github.com/facebook/rebound-js/blob/master/examples/src/cascadeEffect/main.js
export default class StaggeredSpringScheduler {
  constructor({ flippedArray }) {
    if (!flippedArray || !flippedArray.length) return

    const {
      stiffness,
      damping,
      overshootClamping
    } = flippedArray[0].springConfig

    this.spring = springSystem.createSpring(stiffness, damping)
    if (overshootClamping) this.spring.setOvershootClampingEnabled(true)
    // an array of objects with callbacks (to animate something)
    this.players = []
    this.currentFrame = 0
    this.renderFrame = this.renderFrame.bind(this)

    flippedArray.forEach(({ getOnUpdateFunc, onAnimationEnd }) =>
      this.addPlayer(getOnUpdateFunc(this.stop.bind(this)), onAnimationEnd)
    )
    this.recordSpring(1)
  }

  stop() {
    this._isCancelled = true
  }

  recordSpring(pos) {
    this.start = this.spring.getCurrentValue()
    this.end = pos
    // an array of values that represent various points
    // in the spring (for staggering)
    this.frames = []
    // addListener causes this.spring to call onSpringUpdate,
    // filling this.frames with a pre-recorded array of spring
    // positions
    this.spring.addListener(this)
    this.spring.setEndValue(pos)
    this.spring.removeListener(this)
  }

  onSpringUpdate(spring) {
    this.frames.push(spring.getCurrentValue())
  }

  addPlayer(onUpdate, onEnd) {
    this.players.push({ frame: 0, onUpdate, onEnd, pos: this.players.length })
  }

  play() {
    if (this.playing) return
    this.reset()
    this.playing = true
    this.renderFrame()
  }

  renderFrame() {
    if (this._isCancelled) return
    const toPlay = this.players.filter((player, i) => {
      return player.frame < this.frames.length && i <= this.currentFrame
    })

    if (toPlay.length) {
      toPlay.forEach(player => {
        const value = this.frames[player.frame]
        player.onUpdate(value)
        player.frame++
      })
      this.currentFrame++
      // basically requestAnimationFrame
      onFrame(this.renderFrame)
    } else {
      this.playing = false
    }
  }
}
