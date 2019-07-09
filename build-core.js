const fs = require('fs')
const npm = require('npm')
const package = require('./package.json')

const customConfig = {
  source: 'src/core.ts',
  main: 'core/index.js',
  'umd:main': 'core/index.umd.js',
  module: 'core/index.es.js',
  types: 'core/index.d.ts'
}

const newPackage = Object.assign({}, package, customConfig)

fs.writeFileSync(`${__dirname}/package.json`, JSON.stringify(newPackage))

npm.load(function(err) {
  npm.commands['run-script'](['microbundle'], function(er) {
    if (er) {
      throw new Error(err)
    }
    fs.writeFileSync(
      `${__dirname}/package.json`,
      JSON.stringify(package, null, 2)
    )
  })
})
