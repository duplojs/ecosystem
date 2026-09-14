import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import * as DPath from "@duplojs/lang/path";

export default defineConfig({
	resolve: {
		tsconfigPaths: true,
		alias: {
			"@V": DPath.resolveRelative([
				DPath.createOrThrow(import.meta.dirname),
				DPath.createOrThrow("scripts/vue"),
			]),
		},
	},
	plugins: [vue()],
	test: {
		environment: "jsdom",
		globals: true,
		include: [
			"tests/**/*.test.ts",
			"integrations/**/*.test.ts",
		],
		coverage: {
			include: ["scripts"],
			exclude: [
				"**/*.test.ts",
				"dist",
			],
		},
		benchmark: {
			include: [
				"tests/**/*.bench.ts",
				"integrations/**/*.bench.ts",
			],
		},
		typecheck: {
			enabled: true,
			tsconfig: "./tsconfig.test.json",
			include: ["tests/**/*.test-d.ts"],
			ignoreSourceErrors: true,
		},
	},
});
