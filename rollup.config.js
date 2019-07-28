import babel from 'rollup-plugin-babel'
import banner from 'rollup-plugin-banner'
import pkg from './package.json'
import resolve from 'rollup-plugin-node-resolve'
import { uglify } from 'rollup-plugin-uglify'

const bannerText =
  `${pkg.name} v${pkg.version} (${pkg.homepage})\n` +
  `Copyright 2017-${new Date().getFullYear()} ${pkg.author}\n` +
  `Licensed under ${pkg.license}`

export default [
  {
    input: 'src/js/geocomplete.js',
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
      banner(bannerText),
    ],
  },
  // minified
  {
    input: 'src/js/geocomplete.js',
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
      banner(bannerText),
    ],
  },
]
