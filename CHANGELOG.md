# Changelog

## 5.0.0 Release

**Summary:** Use a `Reboundjs` fork instead of `Wobblejs` for better performance. Add a lot more options for staggering.

### Improved

1. **Better performance:** Moved from the library `Wobblejs`, that creates a render loop for each spring animation, to a custom fork of `Reboundjs`, that creates only a single render loop for all existing animations. Chrome perftools profiling shows significantly less JavaScript needed for each frame, resulting in a slightly higher average frame rate.
2. **Nested Stagger:** Before, you could only stagger elements a single level. Now, you can have elements that are staggered for arbitrarily deep levels, enabling animations such as [this one]().

### Added

1. More stagger configuration options: `speed` and `reverse`. You can config the stagger in the `staggerConfig` prop on the `Flipper` component.

2. An improved API for deciding whether a `Flipped` component should actually flip. Now you can pass down some state from the `Flipper` component in the `decisionData` prop, which will be passed into the `shouldFlip` or `shouldInvert` functions on the children `Flipped` components.

### Removed

1. As a corollary to #3 in the **Added** section, removed the old way of telling a `Flipped` element whether or not to animate (`componentId` and `componentIdFilter`).

### Degraded

The size of the library increased by about .5kb (gzipped) to 7.5kb gzipped. Most of the additional code was handling improved stagger configurability.

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
