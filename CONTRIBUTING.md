### Release Checklist

Some unfortunately non-automated tasks that need to be done manually:

1. Run `yarn test` and `yarn test:dom`  in the top level dir and make sure jest + mocha browser tests are passing (you'll need to check mocha tests in the browser)
2. Run `yarn format-and-fix` in the top level dir
3. Make sure readme is up-to-date
4. Verify that no unintended deps were added to `dependencies` in either package.json.
 

### Beta versions for testing

Sometimes, you will want to test out changes before publishing them widely. In that case, do a pre-release by following these steps:


1. `npm version prepatch | preminor | premajor`

2. `npm publish --tag beta`


### Real release

1. Release `flip-toolkit`:
  - increment version number 
  - run yarn build
  - commit with message formatted like:  `git commit -m 'flip-toolkit@7.4.0'`
  - run npm publish

  Then, wait a bit (30mins+) and ensure the correct version shows up on:
  - npm: https://www.npmjs.com/package/flip-toolkit
  - unpkg: https://unpkg.com/flip-toolkit
  - package-phobia: https://packagephobia.com/result?p=flip-toolkit
  - bundle-phobia: https://bundlephobia.com/package/flip-toolkit
  - type declarations: https://arethetypeswrong.github.io/?p=flip-toolkit
  - and is working on this codesandbox which fetches the latest version of flip-toolkit: https://codesandbox.io/s/5v1k1nwz8l. Also check that type completions work in the sandbox.

2. Once everything looks good, release `react-flip-toolkit`:
  - `yarn upgrade flip-toolkit@^XXX`
  - increment version number 
  - run yarn build
  - commit with message formatted like:  `git commit -m 'react-flip-toolkit@7.4.0'`
  - run npm publish


Once again, verify that everything looks good:
   - npm: https://www.npmjs.com/package/react-flip-toolkit
   - unpkg: https://unpkg.com/react-flip-toolkit
   - package-phobia: https://packagephobia.com/result?p=react-flip-toolkit
   - bundle-phobia: https://bundlephobia.com/package/react-flip-toolkit
   - type declarations: https://arethetypeswrong.github.io/?p=react-flip-toolkit
    - and is working on this codesandbox which fetches the latest version of react-flip-toolkit: https://codesandbox.io/s/8130rn9q2
