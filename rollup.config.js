import babel from 'rollup-plugin-babel'
import banner from 'rollup-plugin-banner'
import cleanup from 'rollup-plugin-cleanup'
import pkg from './package.json'
import resolve from 'rollup-plugin-node-resolve'
import { uglify } from 'rollup-plugin-uglify'

const bannerText =
  `${pkg.name} v${pkg.version} (${pkg.homepage})\n` +
  `Copyright 2017-${new Date().getFullYear()} ${pkg.author}\n` +
  `Licensed under ${pkg.license}`

export default [
  // demo
  {
    input: 'src/js/geocomplete.js',
    output: {
      name: '$.fn.geocomplete',
      file: `demo/assets/${pkg.name}.js`,
      format: 'iife',
    },
    plugins: [
      resolve(),
      babel({
        exclude: ['node_modules/**'],
      }),
      cleanup(),
      banner(bannerText),
    ],
  },

  // minified
  {
    input: 'src/js/geocomplete.js',
    output: {
      name: '$.fn.geocomplete',
      file: `dist/${pkg.name}.min.js`,
      format: 'iife',
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

  // compiled
  {
    input: 'src/js/geocomplete.js',
    output: {
      name: '$.fn.geocomplete',
      file: `dist/${pkg.name}.js`,
      format: 'iife',
    },
    plugins: [
      resolve(),
      babel({
        exclude: ['node_modules/**'],
      }),
      cleanup(),
      banner(bannerText),
    ],
  },
]
