import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		include: [
			"tests/**/*.test.ts",
			"integrations/**/*.test.ts",
		],
		coverage: {
			include: ["scripts"],
			exclude: [
				"**/*.test.ts",
				"bin",
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
	resolve: {
		tsconfigPaths: true,
	},
});
