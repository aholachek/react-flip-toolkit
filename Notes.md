Random notes to myself.

## Publishing Beta versions

Publish a beta version by doing something like:

`npm version 3.0.0-beta2`
`npm publish --tag beta`

When making an actual release, provide an associated commit message to explain what the release does:

`npm version patch -m "Upgrade to %s for reasons"`

## Will Change

Watch out for `will-change: transform`. It seemed to decrease performance significantly (?) in the flip-move example.
