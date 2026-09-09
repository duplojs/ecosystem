import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		include: [
			"tests/**/*.test.ts",
			"integrations/**/*.test.ts",
		],
		coverage: {
			include: ["scripts/**/*.ts"],
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
	},
	resolve: {
		tsconfigPaths: true,
	},
});
