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

1. Release `flip-toolkit`, wait a bit (30mins+) and ensure it shows up on npm, unpkg, maybe even https://bundlephobia.com/result?p=flip-toolkit@7.0.13 to make sure nothing unexpected changed with the size, and is working on this codesandbox: https://codesandbox.io/s/5v1k1nwz8l?file=/package.json. 
2. Once everything looks good, release `react-flip-toolkit` after upgrading package.json to the new version of `flip-toolkit`.
