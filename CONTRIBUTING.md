## Installation

- Running `npm install` in the component's root directory will install everything you need for development.

## Demo Development Server

- `npm start` will run a development server with the component's demo app at [http://localhost:3000](http://localhost:3000) with hot module reloading.

## Running Tests

There are two types of tests: jest for tests that don't interface with the DOM, and mocha for DOM tests. To run them,
`yarn run test:all` (you have to check that the page rendered by mocha shows all passing tests.)

## Building

- `npm run build` will build the component for publishing to npm and also bundle the demo app.

- `npm run clean` will delete built resources.

## Publishing Beta versions

Publish a beta version by doing something like:

`npm version 3.0.0-beta1`
`npm publish --tag beta`

When making an actual release, provide an associated commit message to explain what the release does:

`npm version patch -m "Upgrade to %s for reasons"`
