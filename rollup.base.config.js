import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import resolve from 'rollup-plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import replace from 'rollup-plugin-replace'
import babel from 'rollup-plugin-babel'

export const basePluginsArr = [
  replace({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  external(),
  resolve(),
  typescript(),
  babel({
    include: 'src/forked-rebound/**/*.js',
    presets: ['@babel/preset-env']
  }),
  commonjs()
]

