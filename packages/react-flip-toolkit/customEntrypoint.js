const fs = require('fs')
const npm = require('npm')
const package = require('./package.json')
const { exec } = require('child_process')

const bundles = ['Swipe/index.tsx', 'Spring/index.ts']

const getConfig = bundle => {
  const bundleName = bundle.split('/')[0]

  return {
    source: `src/${bundle}`,
    'umd:main': 'temp/${bundleName}/index.umd.js',
    main: `temp/${bundleName}/index.js`,
    module: `temp/${bundleName}/index.es.js`
  }
}

const buildBundle = bundle => {
  const customConfig = getConfig(bundle)

  const newPackage = Object.assign({}, package, customConfig)

  fs.writeFileSync(`${__dirname}/package.json`, JSON.stringify(newPackage))

  console.log(newPackage)

  return new Promise((resolve, reject) => {
    npm.load(function(err) {
      npm.commands['run-script'](['microbundle'], function(er) {
        if (er) {
          reject(er)
        }
        resolve()
      })
    })
  })
}

bundles.reduce((acc, bundle) => {
  return acc.then(() => {
    return buildBundle(bundle).then(() => {
      const bundleName = bundle.split('/')[0]

      const files = []
      ;['index.js', 'index.es.js'].forEach(fileType => {
        files.push(`${bundleName}/${fileType}`)
      })
      const commands = files.map(f => `mv temp/${f} lib/${bundleName}/`)

      return new Promise((resolve, reject) => {
        exec(`${commands.join('; ')}; rm -rf temp`, function(err, stdout) {
          if (err) {
            console.error(err)
            reject()
          } else resolve()
        })
      })
    })
  })
}, Promise.resolve())

buildBundle(bundles[0])
  .then(() => {
    buildBundle(bundles[1])
  })
  .catch(er => {
    console.log(er)
  })
  .finally(() => {
    fs.writeFileSync(
      `${__dirname}/package.json`,
      JSON.stringify(package, null, 2)
    )
  })
