# Changelog

## 7.0.0 Release

** Summary ** This release adds swipe-enabled FLIP, a spring utility, and reduces the size of the main library by a bit.

## Breaking changes
- Stagger delays for nested `Flipped` components are now no longer automatically handled. If you want a `Flipped` animation to wait for another (staggered) `Flipped` animation to begin, you need to explicitly provide a prop that references the `flipId` of the `Flipped` component to wait until: `delayUntil="flipId"`. Getting rid of auttomatically handled nested staggers reduced the complexity of the code and made the library a bit smaller and a lot more maintainable.

## Added
- `spring`, a function to handle spring tweening of style attributes for you.
- `Swipe`, a component which allows for swipe-driven FLIP.

## Improved
- `flip-toolkit`, the base of the library without any React, is now [its own package on npm](https://www.npmjs.com/package/flip-toolkit)

## 6.0.0 Release

**Summary:** A small release with only one breaking change: streamlining animation sequencing by removing the option to provide `onDelayedAppear` callbacks to `Flipped` components, and adding a new optional callback to the `Flipper` component, `handleEnterUpdateDelete`, that allows for complete control of animation sequencing.

### Improved

Animation sequencing is now more flexible with the `handleEnterUpdateDelete` function.
[Check out this Codesandbox for a comprehensive example.](https://codesandbox.io/s/4q7qpkn8q0)

### Removed

Instead of optionally using `onDelayedAppear`, all entering animations should be specified with the standard `onAppear` callback.

Some code that was handling an edge case with FLIP-ped images in the Safari browser has been removed for simplicity's sake. Please be sure to QA FLIP animations that use images in Safari.

## 5.0.0 Release

**Summary:** Use a `Reboundjs` fork instead of `Wobblejs` for better performance. Add a lot more options for staggering.

### Improved

1. **Better performance:** Moved from the library `Wobblejs`, that creates a render loop for each spring animation, to a custom fork of `Reboundjs`, that creates only a single render loop for all existing animations. Chrome perftools profiling shows significantly less JavaScript time for each frame, resulting in a slightly higher average frame rate.

2. **Nested Stagger:** Before, you could only stagger elements a single level. Now, you can have elements that are staggered for arbitrarily deep levels, enabling animations such as [this one](https://react-flip-toolkit-demos.surge.sh/staggered-list).

### Added

1. More stagger configuration options: `speed` and `reverse`. You can config the stagger in the `staggerConfig` prop on the `Flipper` component.

2. An improved API for deciding whether a `Flipped` component should actually flip. Now you can pass down some state from the `Flipper` component in the `decisionData` prop, which will be passed into the `shouldFlip` or `shouldInvert` functions on the children `Flipped` components.

3. A new spring preset, `veryGentle`, that has just the tiniest bit of bounce.

### Removed

1. As a corollary to #3 in the **Added** section, removed the old way of telling a `Flipped` element whether or not to animate (`componentId` and `componentIdFilter`).

### Degraded

The size of the library increased by about 1kb (gzipped) to 8kb gzipped. Most of the additional code was handling improved stagger configurability although the switch to rebound added a tiny bit as well. I'll be attempting to reduce the size of the library in an upcoming pr.

## 4.0.0 Release

Summary: Went all-in on springs and removed option to hard-code easing curves.

### Added

1.  There are 4 new spring presets: `noWobble` (default), `gentle`, `wobbly`, or `stiff`, inspired by react-motion, that you can use for different effects by providing the relevant string to the `spring` prop. You can also specify spring parameters (stiffness and damping) in an object as before.
2.  There's a new `stagger` prop for the `Flipped` component that provides a more natural effect than hard-coded delays. You can have multiple staggered "sets" in a single `Flipper` component by providing a key to the `stagger` prop.
3.  The `debug` prop outlines all `Flipped` components with a pink outline for better understanding of `Flipped` element dimensions. [Read more here.](./README.md#troubleshooting)
4.  This was technically added a bit before, but you can use `Flipper` component with portals by providing a `portalKey` to the `Flipper` component.

### Removed (Breaking Changes)

1.  The `delay` prop has been replaced with the `stagger` prop as mentioned above. (If you have a use case for `delay` that is not covered by `stagger` please let me know).
2.  All timing functions are now using springs. That means that the `easing` and `duration` props have been removed.

### Fixed

1.  Better handling of animations dealing with images that haven't loaded yet. Before, if the image hadn't loaded, react-flip-toolkit would think it had `width: 0, height: 0`, resulting in a warped animation. Now, react-flip-toolkit waits for the image to load for a brief period of time, and then retries the animation.
2.  The new stagger prop fixes frame-rate issues caused by the previous `delay` prop's use of `setTimeout`.
3.  Went from ~9kb minified and gzipped to ~7kb.
