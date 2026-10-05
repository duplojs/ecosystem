import { defineConfig } from "rolldown";
import dts from "unplugin-dts/rolldown";

export default defineConfig({
	input: {
		index: "scripts/index.ts",
		unplugindts: "scripts/unplugindts.ts",
	},
	platform: "neutral",
	external: [/^node:/],
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
});
