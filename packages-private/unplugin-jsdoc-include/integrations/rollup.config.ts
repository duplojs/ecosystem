import * as DPath from "@duplojs/lang/path";
import jsdocInclude from "@duplojs/unplugin-jsdoc-include/rollup";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import dts from "unplugin-dts/rollup";

const includedPath = DPath.createOrThrow(`${import.meta.dirname}/docs`);

export default defineConfig({
	input: "scripts/index.ts",
	output: {
		dir: "dist/rollup",
		format: "esm",
		preserveModules: true,
		preserveModulesRoot: "scripts",
		entryFileNames: "[name].mjs",
	},
	plugins: [
		typescript({
			tsconfig: "tsconfig.json",
			compilerOptions: {
				declaration: false,
				outDir: "dist/rollup",
			},
		}),
		dts({
			tsconfigPath: "tsconfig.json",
			outDirs: "dist/rollup",
			bundleTypes: false,
		}),
		jsdocInclude({
			includedPath,
		}),
	],
});
