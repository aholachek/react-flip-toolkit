module.exports = {
  type: "react-component",
  npm: {
    esModules: true,
    umd: {
      global: "ReactFlipToolkit",
      externals: {
        react: "React"
      }
    }
  },
  webpack: {
    copy: [{ from: "src/index.d.ts" }]
  }
}
