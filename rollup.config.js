import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'

import pkg from './package.json'

const basePluginsArr = [
  external(),
  resolve(),
  typescript(),
  commonjs(),
]

const globals = {
  react: 'React',
  'prop-types': 'PropTypes'
}

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        exports: 'named',
        sourcemap: true,
        globals: globals
      },
      {
        file: pkg.module,
        format: 'es',
        exports: 'named',
        sourcemap: true,
        globals: globals
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
      sourcemap: true,
      globals: globals
    },
    plugins: basePluginsArr.concat([terser()])
  }
]
