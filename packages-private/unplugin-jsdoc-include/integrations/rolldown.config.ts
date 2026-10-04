import * as DPath from "@duplojs/lang/path";
import jsdocInclude from "@duplojs/unplugin-jsdoc-include/rolldown";
import { defineConfig } from "rolldown";
import dts from "unplugin-dts/rolldown";

const includedPath = DPath.createOrThrow(`${import.meta.dirname}/docs`);

export default defineConfig({
	input: "scripts/index.ts",
	platform: "neutral",
	tsconfig: "tsconfig.json",
	output: {
		dir: "dist/rolldown",
		format: "esm",
		preserveModules: true,
		preserveModulesRoot: "scripts",
		entryFileNames: "[name].mjs",
		cleanDir: true,
	},
	plugins: [
		dts({
			tsconfigPath: "tsconfig.json",
			outDirs: "dist/rolldown",
			bundleTypes: false,
		}),
		jsdocInclude({
			includedPath,
		}),
	],
});
