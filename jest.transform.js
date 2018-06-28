module.exports = require("babel-jest").createTransformer({
  presets: ["env", "react"],
  plugins: ["transform-class-properties"]
})
