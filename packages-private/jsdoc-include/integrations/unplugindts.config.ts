import { beforeWriteFileDtsHook } from "@duplojs/jsdoc-include/unplugindts";
import * as DPath from "@duplojs/lang/path";
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
				includedPath: DPath.createOrThrow(`${import.meta.dirname}/docs`),
				lineChar: "\n",
			}),
		}),
	],
});
