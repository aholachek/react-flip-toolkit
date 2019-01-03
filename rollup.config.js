import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'
import replace from 'rollup-plugin-replace'

import pkg from './package.json'

const basePluginsArr = [
  replace({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  external(),
  resolve(),
  typescript(),
  commonjs()
]

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        exports: 'named',
        sourcemap: true
      },
      {
        file: pkg.module,
        format: 'es',
        exports: 'named',
        sourcemap: true
      },
      {
        file: pkg.browser.replace('.min', ''),
        name: 'ReactFlipToolkit',
        format: 'umd',
        sourcemap: true
      }
    ],
    plugins: basePluginsArr
  },
  {
    input: 'src/core.ts',
    output: [
      {
        file: pkg.main.replace('index', 'core'),
        format: 'cjs',
        exports: 'named',
        sourcemap: true
      },
      {
        file: pkg.module.replace('index', 'core'),
        format: 'es',
        exports: 'named',
        sourcemap: true
      },
      {
        file: pkg.browser.replace('react-flip-toolkit', 'core').replace('.min', ''),
        name: 'ReactFlipToolkitCore',
        format: 'umd',
        sourcemap: true
      }
    ],
    plugins: basePluginsArr
  },
  {
    input: 'src/index.ts',
    output: {
      file: pkg.browser,
      name: 'ReactFlipToolkit',
      format: 'umd',
      sourcemap: true
    },
    plugins: basePluginsArr.concat([terser()])
  },
  {
    input: 'src/core.ts',
    output: {
      file: pkg.browser.replace('react-flip-toolkit', 'core'),
      name: 'ReactFlipToolkitCore',
      format: 'umd',
      sourcemap: true
    },
    plugins: basePluginsArr.concat([terser()])
  }
]
