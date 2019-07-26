import babel from 'rollup-plugin-babel'
import pkg from './package.json'
import resolve from 'rollup-plugin-node-resolve'
import { uglify } from 'rollup-plugin-uglify'

export default [
  {
    input: 'src/js/main.js',
    output: {
      name: '$.fn.geocomplete',
      file: `dist/${pkg.name}.js`,
      format: 'umd',
    },
    plugins: [
      resolve(),
      babel({
        exclude: ['node_modules/**'],
      }),
    ],
  },
  // minified
  {
    input: 'src/js/main.js',
    output: {
      name: '$.fn.geocomplete',
      file: `dist/${pkg.name}.min.js`,
      format: 'umd',
    },
    plugins: [
      resolve(),
      babel({
        exclude: ['node_modules/**'],
      }),
      uglify(),
    ],
  },
]
