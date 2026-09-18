import { defineConfig, type RolldownOptions } from "rolldown";
import dts from "unplugin-dts/rolldown";

const defaultConfig = {
	treeshake: false,
	external: [
		/^@duplojs\/lang/,
		/^@duplojs\/server/,
		/^@duplojs\/tools/,
		/^node:/,
	],
	output: [
		{
			dir: "dist",
			format: "esm",
			preserveModules: true,
			preserveModulesRoot: "scripts",
			entryFileNames: "[name].mjs",
		},
		{
			dir: "dist",
			format: "cjs",
			preserveModules: true,
			preserveModulesRoot: "scripts",
			entryFileNames: "[name].cjs",
		},
	],
} as const satisfies RolldownOptions;

export default defineConfig([
	// plugins
	{
		...defaultConfig,
		input: "scripts/plugins/openApiGenerator/index.ts",
		tsconfig: "scripts/plugins/openApiGenerator/tsconfig.build.json",
		plugins: [
			dts({
				tsconfigPath: "scripts/plugins/openApiGenerator/tsconfig.build.json",
				outDirs: "dist",
				bundleTypes: false,
			}),
		],
	},
	{
		...defaultConfig,
		input: "scripts/plugins/codeGenerator/index.ts",
		tsconfig: "scripts/plugins/codeGenerator/tsconfig.build.json",
		plugins: [
			dts({
				tsconfigPath: "scripts/plugins/codeGenerator/tsconfig.build.json",
				outDirs: "dist",
				bundleTypes: false,
			}),
		],
	},
	{
		...defaultConfig,
		input: "scripts/plugins/static/index.ts",
		tsconfig: "scripts/plugins/static/tsconfig.build.json",
		plugins: [
			dts({
				tsconfigPath: "scripts/plugins/static/tsconfig.build.json",
				outDirs: "dist",
				bundleTypes: false,
			}),
		],
	},
	{
		...defaultConfig,
		input: "scripts/plugins/cacheController/index.ts",
		tsconfig: "scripts/plugins/cacheController/tsconfig.build.json",
		plugins: [
			dts({
				tsconfigPath: "scripts/plugins/cacheController/tsconfig.build.json",
				outDirs: "dist",
				bundleTypes: false,
			}),
		],
	},
	{
		...defaultConfig,
		input: "scripts/plugins/cors/index.ts",
		tsconfig: "scripts/plugins/cors/tsconfig.build.json",
		plugins: [
			dts({
				tsconfigPath: "scripts/plugins/cors/tsconfig.build.json",
				outDirs: "dist",
				bundleTypes: false,
			}),
		],
	},
	{
		...defaultConfig,
		input: "scripts/plugins/cookie/index.ts",
		tsconfig: "scripts/plugins/cookie/tsconfig.build.json",
		plugins: [
			dts({
				tsconfigPath: "scripts/plugins/cookie/tsconfig.build.json",
				outDirs: "dist",
				bundleTypes: false,
			}),
		],
	},

	// interfaces
	{
		...defaultConfig,
		input: "scripts/interfaces/node/index.ts",
		tsconfig: "scripts/interfaces/node/tsconfig.build.json",
		plugins: [
			dts({
				tsconfigPath: "scripts/interfaces/node/tsconfig.build.json",
				outDirs: "dist",
				bundleTypes: false,
			}),
		],
	},
	{
		...defaultConfig,
		input: "scripts/interfaces/bun/index.ts",
		tsconfig: "scripts/interfaces/bun/tsconfig.build.json",
		plugins: [
			dts({
				tsconfigPath: "scripts/interfaces/bun/tsconfig.build.json",
				outDirs: "dist",
				bundleTypes: false,
			}),
		],
	},
	{
		...defaultConfig,
		input: "scripts/interfaces/deno/index.ts",
		tsconfig: "scripts/interfaces/deno/tsconfig.build.json",
		plugins: [
			dts({
				tsconfigPath: "scripts/interfaces/deno/tsconfig.build.json",
				outDirs: "dist",
				bundleTypes: false,
			}),
		],
	},

	// client
	{
		...defaultConfig,
		input: "scripts/client/index.ts",
		tsconfig: "scripts/client/tsconfig.build.json",
		plugins: [
			dts({
				tsconfigPath: "scripts/client/tsconfig.build.json",
				outDirs: "dist",
				bundleTypes: false,
			}),
		],
	},

	// core
	{
		...defaultConfig,
		input: "scripts/core/index.ts",
		tsconfig: "scripts/core/tsconfig.build.json",
		plugins: [
			dts({
				tsconfigPath: "scripts/core/tsconfig.build.json",
				outDirs: "dist",
				bundleTypes: false,
			}),
		],
	},
]);
