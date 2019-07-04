import { basePluginsArr } from './rollup.base.config'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

const umdPath = 'umd/react-flip-toolkit.min.js'

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
        file: umdPath.replace('.min', ''),
        name: 'ReactFlipToolkit',
        format: 'umd',
        sourcemap: true
      }
    ],
    plugins: basePluginsArr
  },
  {
    input: 'src/index.ts',
    output: {
      file: umdPath,
      name: 'ReactFlipToolkit',
      format: 'umd',
      sourcemap: true
    },
    plugins: basePluginsArr.concat([terser()])
  }
]
