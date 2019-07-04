import { terser } from 'rollup-plugin-terser'
import { basePluginsArr } from '../../rollup.base.config'

import pkg from './package.json'

const umdPath = 'umd/flip-toolkit.min.js'

export default [
  {
    input: 'index.ts',
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
        file: umdPath.replace('.min', ''),
        name: 'FlipToolkit',
        format: 'umd',
        sourcemap: true
      }
    ],
    plugins: basePluginsArr
  },
  {
    input: 'index.ts',
    output: {
      file: umdPath,
      name: 'FlipToolkit',
      format: 'umd',
      sourcemap: true
    },
    plugins: basePluginsArr.concat([terser()])
  }
]
