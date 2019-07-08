[![Minified & Gzipped size](https://badgen.net/bundlephobia/minzip/flip-toolkit)](https://bundlephobia.com/result?p=flip-toolkit)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)
[![npm version](http://img.shields.io/npm/v/flip-toolkit.svg?style=flat)](https://npmjs.org/package/flip-toolkit 'View this project on npm')

This library is suitable for use with Vanilla JS can be made to work with any JS framework. Try these framework-readyalternatives if you're using React or Vue:

- [React-Flip-Toolkit](../../)
- [Vue-Flip-Toolkit](https://github.com/mattrothenberg/vue-flip-toolkit)

### Example 1: Expanding Div ([Fork on Code Sandbox](https://codesandbox.io/s/5v1k1nwz8l))

```js
import { Flipper } from 'react-flip-toolkit'
const container = document.querySelector('.container')
const square = document.querySelector('.square')
const innerSquare = document.querySelector('.inner-square')

const flipper = new Flipper({ element: container })

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
  flipper.update()
})
```
