import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'
export default {
	input: 'src/index.tsx',
	output: [
		{
			file: pkg.main,
			format: 'cjs',
			sourcemap: true,
		},
		{
			file: pkg.module,
			format: 'es',
			sourcemap: true,
		},
	],
	external: ['react', 'fast-deep-equal', 'immer'],
	plugins: [typescript(/*{ plugin options }*/)],
}
