module.exports = {
  type: "react-component",
  npm: {
    esModules: true,
    umd: {
      global: "ReactFlipToolkit",
      externals: {
        react: "React",
        "prop-types": "PropTypes"
      }
    }
  }
}
