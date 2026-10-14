import { defineConfig } from "rolldown";
import dts from "unplugin-dts/rolldown";

export default defineConfig([
	{
		input: "scripts/index.ts",
		external: [
			/^@duplojs\//,
			/^node:/,
		],
		platform: "neutral",
		tsconfig: "tsconfig.build.json",
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
				exports: "named",
				preserveModules: true,
				preserveModulesRoot: "scripts",
				entryFileNames: "[name].cjs",
			},
		],
		treeshake: false,
		plugins: [
			dts({
				tsconfigPath: "tsconfig.build.json",
				outDirs: "dist",
				bundleTypes: false,
			}),
		],
	},
	{
		input: "scripts/bin.ts",
		external: [
			/^@duplojs\//,
			/^node:/,
		],
		platform: "neutral",
		tsconfig: "tsconfig.build.json",
		output: {
			dir: "dist",
			format: "esm",
			preserveModules: true,
			preserveModulesRoot: "scripts",
			entryFileNames: "[name].mjs",
		},
		treeshake: false,
	},
]);
