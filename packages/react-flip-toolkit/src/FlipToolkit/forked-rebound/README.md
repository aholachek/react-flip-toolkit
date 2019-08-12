This version of [rebound-js](https://github.com/facebook/rebound-js) has been forked to reduce payload size because the current version of the library doesn't offer an easy way to import only what you need.

Rebound is used instead of React-Flip-Toolkit's previous spring library, WobbleJS, because rebound's unified render loop results in significantly increased performance, especially when there are more than a few animated elements.

I stripped the flow types because I was having trouble getting it to work with the parcel-built dom tests for some reason. That might have been a bad idea.
