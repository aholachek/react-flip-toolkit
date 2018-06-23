# react-flip-toolkit

## Rationale

I couldn't find a pre-existing small, versatile library that offered me the degree of configurability and control I wanted over complex animations.

## Demos

- [Guitar shop](https://literate-fly.surge.sh/guitar)
- [Menu with nested transitions](https://codepen.io/aholachek/pen/KeevYN?)
- [Simplest possible example](https://codepen.io/aholachek/pen/zapEjq?editors=0110)
- [Somewhat absurd overly complex example](https://literate-fly.surge.sh/cards)

## Quick start

`npm install react-flip-toolkit`

1. Wrap your container element with a `Flipper` component that has a `flipKey` prop that changes every time an animation should happen.
2. Wrap elements that should be animated with `Flipped` components that have `flipId` props matching them across renders.

### Simplest example:

[Try it out on Codepen](https://codepen.io/aholachek/pen/zapEjq?editors=0110)

```js
import { Flipper, Flipped } from "react-flip-toolkit"

const data = ["#333366", "#ff5f5f", "#f9e75e"]

class Container extends Component {
  state = { focused: undefined }
  render() {
    return (
      <Flipper flipKey={this.state.focused}>
        <main>
          {typeof this.state.focused === "string" ? (
            <Flipped flipId={this.state.focused}>
              <div
                className="focusedItem"
                style={{ backgroundColor: this.state.focused }}
                onClick={() => this.setState({ focused: null })}
              />
            </Flipped>
          ) : (
            <ul className="list">
              {data.map(color => (
                <Flipped flipId={color}>
                  <li
                    className="listItem"
                    style={{ backgroundColor: color }}
                    onClick={() => this.setState({ focused: color })}
                  />
                </Flipped>
              ))}
            </ul>
          )}
        </main>
      </Flipper>
    )
  }
}
```

In this example, all `Flipped` elements are direct children of the `Flipper` parent component, but in most cases they will probably be contained in different components.

## Flipper component

The parent wrapper that contains all the elements to be animated.

### Props

- **`flipKey`**: (`string`, `number`, `bool`) Changing this tells `react-flip-toolkit` to transition elements wrapped in `Flipped` components.
- **`children`**: (`node`) One or more element children
- **`ease`**: (`string`, default: `easeOut`) Default easing for all FLIP transitions. This string should refer to one of the easings provided by Popmotion, [see the full list here](https://popmotion.io/api/easing/)
- **`duration`**: (`number`, default: `250`) Default duration in ms for all FLIP transitions.
- **`applyTransformOrigin`**: (`bool`, default: `true`) Whether or not `react-flip-toolkit` should apply a transform-origin of "0 0" to animating children (this is generally desirable for FLIP animations)

## Flipped component

### Props:

- *`children`*: (`node`) you have to wrap a single node child with the `Flipped` component. If the child is a React component rather than an element, make sure it passes down unknown props directly to the rendered element.
- *`flipId`*: (`string`) Use this to tell `react-flip-toolkit` how elements should be matched across renders so they can be animated. E.g. in one component you can have

```js
<Flipped flipId="coolDiv">
  <div className="small" />
</Flipped>
```

and in another you can have

```js
<Flipped flipId="coolDiv">
  <div className="big" />
</Flipped>
```

and they will be tweened by `react-flip-toolkit`

- **`inverseFlipId`**: (`string`) refer to the id of the parent `Flipped` container whose transform you want to cancel out.
- **`transformOrigin`**: (`string`, like`"50% 100%"`) this is a convenience method to apply the proper CSS `transform-origin` to the element being FLIPP-ed. This will override `react-flip-toolkit`'s default application of `transform-origin: 0 0` if it is provided as a prop.
- **`ease`**: (`string`) This string should refer to one of the easings provided by Popmotion, [see the full list here](https://popmotion.io/api/easing/). This will override the one specified in the parent `Flipped` component.
- **`duration`**: (`number`) Timing for the individual FLIP transition, this will override the one specified in the parent `Flipped` component
- **`onStart(element)`** : (`func`) called when the FLIP animation starts. It is provided a reference to the DOM element being transitioned as the first argument
- **`onComplete(element)`** : (`func`) called when the FLIP animation starts. It is provided a reference to the DOM element being transitioned as the first argument. (If transitions are interruped by new ones, `onComplete` will still be called.)

#### By default the FLIP-ped elements' translate, scale, and opacity properties are all transformed. However, certain effects require more control so if you specify any of these props, _only the specified attribute(s) will be tweened_:

- **`translate`**: (`bool`) Tween `translateX` and `translateY`
- **`scale`**: (`bool`) Tween `scaleX` and `scaleY`
- **`opacity`**: (`bool`)

#### Advanced and usually unnecessary:

- **`componentId`**: (`string`) Identify the component
- **`componentIdFilter`**: (`string`) Only apply FLIP transitions if the transition originates or ends with a component with the specified `componentId`


## Scale transitions made eas(ier)

Some other FLIP libraries just allow you to animate position changes, but things get a lot more interesting once you can animate scale changes as well (check out the demos at the top of the README to see what scale animations bring to the table).
The problem with scale animations has to do with children -- if you scale a div up 2x, you will warp any children it has by scaling them up too, creating a weird-looking animation. That's why this library allows you to wrap the child with a `Flipped` component that has an `inverseFlipId` to counteract the transforms of the parent:

```js
<Flipped flipId={parentFlipId}>
  <div>
    <Flipped inverseFlipId={parentFlipId} scale>
      <div>some text that will not be warped</div>
    </Flipped>
  </div>
</Flipped>
```

[Try it out on Codepen](https://codepen.io/aholachek/pen/mKXBJR?editors=0110)

By default, not only the scale of the parent will be counteracted, but also the X and Y translations (this allows children components to make their own FLIP animations without being affected by the parent).
But for most use cases, you'll want to additionally specify the `scale` prop to limit the transform adjustment to the scale and allow the positioning to move with the parent.

## Other details

`react-flip-toolkit` is ~9kb minified and gzipped
