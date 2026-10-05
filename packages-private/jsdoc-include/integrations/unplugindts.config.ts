import { beforeWriteFileDtsHook } from "@duplojs/unplugin-jsdoc-include/unplugindts";
import { defineConfig } from "rolldown";
import dts from "unplugin-dts/rolldown";

export default defineConfig({
	input: "scripts/index.ts",
	platform: "neutral",
	tsconfig: "tsconfig.json",
	output: {
		dir: "dist/unplugindts",
		format: "esm",
		preserveModules: true,
		preserveModulesRoot: "scripts",
		entryFileNames: "[name].mjs",
		cleanDir: true,
	},
	plugins: [
		dts({
			tsconfigPath: "tsconfig.json",
			outDirs: "dist/unplugindts",
			bundleTypes: false,
			beforeWriteFile: beforeWriteFileDtsHook({
				includedPath: `${import.meta.dirname}/docs`,
				lineChar: "\n",
			}),
		}),
	],
});
