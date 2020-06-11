import { Flipper } from '../src/index.ts'

const container = document.querySelector('.container')
const box = document.querySelector('.box')
const innerBox = document.querySelector('.innerBox')

const flipper = new Flipper({ element: container })

box.addEventListener('click', () => {
  flipper.recordBeforeUpdate()
  box.classList.toggle('big-box')
  flipper.update()
})

flipper.addFlipped({
  element: box,
  flipId: 'box',
  inverted: innerBox,
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
const flipper2 = new Flipper({
  element: container2,
  spring: { stiffness: 4, damping: 4 },
})

container2.addEventListener('click', () => {
  flipper2.recordBeforeUpdate()
  container2.classList.toggle('reversed')
  flipper2.update()
})

Array.from(container2.querySelectorAll('li')).forEach((li, i) => {
  flipper2.addFlipped({
    element: li,
    flipId: `li-${i}`,
    stagger: true
  })
})

Array.from(container2.querySelectorAll('.container-2 .inner')).forEach(
  (div, i) => {
    flipper2.addFlipped({
      element: div,
      flipId: `inner-${i}`,
      delayUntil: `li-${i}`,
    })
  }
)

Array.from(container2.querySelectorAll('.container-2 .inverted')).forEach(
  (div, i) => {
    flipper2.addInverted({
      element: div,
      parent: div.parentNode,
    })
  }
)
