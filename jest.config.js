// https://kulshekhar.github.io/ts-jest/user/config/
module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testPathIgnorePatterns: ['domtest'],
  globals: {
    'ts-jest': {
      // don't compile typescript to check for errors in tests
      isolatedModules: true
    }
  }
}
