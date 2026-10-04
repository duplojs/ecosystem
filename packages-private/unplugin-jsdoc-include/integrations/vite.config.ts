import * as DPath from "@duplojs/lang/path";
import jsdocInclude from "@duplojs/unplugin-jsdoc-include/vite";
import { defineConfig } from "vite";
import dts from "unplugin-dts/vite";

const includedPath = DPath.createOrThrow(`${import.meta.dirname}/docs`);

export default defineConfig({
	plugins: [
		dts({
			tsconfigPath: "tsconfig.json",
			outDirs: "dist/vite",
			bundleTypes: false,
		}),
		jsdocInclude({
			includedPath,
		}),
	],
	build: {
		outDir: "dist/vite",
		emptyOutDir: true,
		lib: {
			entry: "scripts/index.ts",
			formats: ["es"],
			fileName: "index",
		},
	},
});
