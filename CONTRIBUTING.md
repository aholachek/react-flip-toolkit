### Release Checklist

Some unfortunately non-automated tasks that need to be done manually:

1. Run `yarn test` and `yarn test:dom`  in the top level dir and make sure jest + mocha browser tests are passing (you'll need to check mocha tests in the browser)
2. Run `yarn format-and-fix` in the top level dir
3. Make sure readme is up-to-date
4. Verify that no unintended deps were added to `dependencies` in either package.json.

### Beta Version

Publish a beta version by doing something like:

`npm version prepatch | preminor | premajor`
`npm publish --tag beta`

in  `flip-toolkit` (first), then updating the version of `flip-toolkit` in `react-flip-toolkit` and repeating the steps.

### Real release

1. Release `flip-toolkit`, wait a bit (30mins+) and ensure the correct version shows up on:
  - npm: https://www.npmjs.com/package/flip-toolkit
  - unpkg: https://unpkg.com/flip-toolkit
  - package-phobia: https://packagephobia.com/result?p=flip-toolkit
  - and is working on this codesandbox which fetches the latest version of flip-toolkit: https://codesandbox.io/s/5v1k1nwz8l
2. Once everything looks good, release `react-flip-toolkit` after upgrading package.json to the new version of `flip-toolkit` (`yarn upgrade flip-toolkit@^1.0.0`). Once again, verify that everything looks good:
   - npm: https://www.npmjs.com/package/react-flip-toolkit
   - unpkg: https://unpkg.com/react-flip-toolkit
   - package-phobia: https://packagephobia.com/result?p=react-flip-toolkit
    - and is working on this codesandbox which fetches the latest version of react-flip-toolkit: https://codesandbox.io/s/8130rn9q2
