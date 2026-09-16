import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import * as DPath from "@duplojs/lang/path";
import { playwright } from "@vitest/browser-playwright";

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
	optimizeDeps: {
		include: ["@vue/reactivity"],
	},
	test: {
		browser: {
			provider: playwright(),
			enabled: true,
			headless: true,
			instances: [{ browser: "chromium" }],
		},
		environment: "jsdom",
		globals: true,
		include: [
			"tests/**/*.test.ts",
			"integrations/**/*.test.ts",
		],
		exclude: ["**/node_modules/**"],
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
