### Release Checklist

Some unfortunately non-automated tasks that need to be done manually:

1. Run `yarn test` and `yarn test:dom`  in the top level dir and make sure jest + mocha browser tests are passing (you'll need to check mocha tests in the browser)
2. Run `yarn format-and-fix` in the top level dir
3. Make sure readme is up-to-date
4. Verify that no unintended deps were added to `dependencies` in either package.json.'

### Beta Version

Publish a beta version by doing something like:

`npm version prepatch | preminor | premajor`
`npm publish --tag beta`

in both `flip-toolkit` (first), then updating the version of flip-toolkit` in `react-flip-toolkit` and completing the steps.

### Real release

When making an actual release, provide an associated commit message to explain what the release does:

`npm version patch -m "Upgrade to %s for reasons"`

