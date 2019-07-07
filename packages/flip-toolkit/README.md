

## Usage with Vanilla JS or Other Frameworks Like Vue.js

`React-Flip-Toolkit` exports a special file, `core`, that allows you to use the methods from the library imperatively, without requiring React. You could use this with vanilla JavaScript or any UI library. (For usage with Vue.js, try [Vue-Flip-Toolkit](https://github.com/mattrothenberg/vue-flip-toolkit)).

You can refer to the React documentation below to see what options can be passed to the `Flipper` class constructor as well as the `addFlipped` function exposed by the `Flipper` instance (which takes options corresponding to the `Flipped` component's props).

### Expanding Div ([Fork on Code Sandbox](https://codesandbox.io/s/5v1k1nwz8l))

```js
import { Flipper } from 'react-flip-toolkit'
const container = document.querySelector('.container')
const square = document.querySelector('.square')
const innerSquare = document.querySelector('.inner-square')

const flipper = new Flipper({ element: container })

// add flipped children to the parent
// options are the same as the props
// for the Flipped component
flipper.addFlipped({
  element: square,
  flipId: 'square',
  onStart: () => console.log('animation started!'),
  onSpringUpdate: springValue =>
    console.log(`current spring value: ${springValue}`),
  onComplete: () => console.log('animation completed!')
})

// to add an inverted child, use this method with
// a reference to the parent element
flipper.addInverted({
  element: innerSquare,
  parent: square
})

square.addEventListener('click', () => {
  // record positions before they change
  flipper.recordBeforeUpdate()
  square.classList.toggle('big-square')
  // record new positions and begin animations
  flipper.onUpdate()
})
```
