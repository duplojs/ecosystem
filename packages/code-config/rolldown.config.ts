import { defineConfig } from "rolldown";
import dts from "unplugin-dts/rolldown";

export default defineConfig([
	{
		external: [
			/^@commitlint\/cli/,
			/^@commitlint\/config-conventional/,
			/^@commitlint\/types/,
			/^oxlint/,
			/^oxlint-tsgolint/,
			/^eslint/,
			/^@stylistic\/eslint-plugin/,
		],
		input: "scripts/index.ts",
		platform: "neutral",
		tsconfig: "tsconfig.build.json",
		output: [
			{
				dir: "dist",
				format: "esm",
				preserveModules: true,
				preserveModulesRoot: "scripts",
				entryFileNames: "[name].mjs",
				cleanDir: true,
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
		treeshake: {
			moduleSideEffects: false,
		},
		plugins: [
			dts({
				tsconfigPath: "tsconfig.build.json",
				outDirs: "dist",
				bundleTypes: false,
			}),
		],
	},
]);
