import { defineConfig } from "vite";
import builtins from "builtin-modules";
import commonjsExternals from "vite-plugin-commonjs-externals";

import pkg from "./package.json";
import { escapeRegExp } from "lodash";

const externals = [
	...builtins,
	// @ts-ignore
	...Object.keys(pkg.dependencies || {}).map(
		(name) => new RegExp(`^${escapeRegExp(name)}(\\/.+)?$`)
	),
] as const;

export default defineConfig({
	plugins: [commonjsExternals({ externals })],
	build: {
		lib: {
			entry: "./src/index.ts",
			fileName: (format) => `index.${format}.js`,
			formats: ["cjs"],
		},
	},
});
