module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'ReactFlipPrimitives',
      externals: {
        react: 'React'
      }
    }
  }
}
