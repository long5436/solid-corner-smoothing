import babel from '@rollup/plugin-babel';
import nodeResolve from '@rollup/plugin-node-resolve';
import dts from 'rollup-plugin-dts';
import terser from '@rollup/plugin-terser';
import size from 'rollup-plugin-sizes';
import bundleSize from 'rollup-plugin-bundle-size';

export default [
  {
    input: 'src/package/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'es',
      },
    ],
    // external: ['solid-js', 'solid-js/web', 'figma-squircle'],
    external: ['solid-js', 'solid-js/web'],
    plugins: [
      nodeResolve({
        extensions: ['.js', '.ts', '.tsx'],
      }),
      babel({
        extensions: ['.js', '.ts', '.tsx'],
        babelHelpers: 'bundled',
        presets: ['solid', '@babel/preset-typescript'],
        exclude: 'node_modules/**',
        minified: true,
      }),
      terser(),
      size(),
      bundleSize(),
    ],
  },
  {
    input: 'src/package/index.ts',
    output: [
      {
        file: 'dist/index.d.ts',
        format: 'es',
      },
    ],
    plugins: [dts()],
  },
];
