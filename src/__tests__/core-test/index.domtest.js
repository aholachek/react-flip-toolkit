import Flipper from '../../core'

const container = document.querySelector('.container')
const box = document.querySelector('.box')
const innerBox = document.querySelector('.innerBox')

const flipper = new Flipper({
  element: container,
  onComplete: flipIds => console.log(`onComplete: ${flipIds}`)
})

box.addEventListener('click', () => {
  flipper.recordBeforeUpdate()
  box.classList.toggle('big-box')
  flipper.onUpdate()
})

flipper.addFlipped({
  element: box,
  flipId: 'box',
  inverted: innerBox,
  onSpringUpdate: springValue => console.log(`onUpdate:${springValue}`),
  shouldFlip: () => {
    console.log('shouldFlip called')
    return true
  },
  shouldInvert: () => {
    console.log('shouldInvert called')
    return true
  }
})

flipper.addInverted({
  element: innerBox,
  parent: box
})

const container2 = document.querySelector('.container-2')
const flipper2 = new Flipper({ element: container2, spring: 'wobbly' })

container2.addEventListener('click', () => {
  flipper2.recordBeforeUpdate()
  container2.classList.toggle('reversed')
  flipper2.onUpdate()
})

Array.from(container2.querySelectorAll('li')).forEach((li, i) => {
  flipper2.addFlipped({
    element: li,
    flipId: `li-${i}`,
    stagger: true
  })
})
