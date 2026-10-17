import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		name: "docs",
		globals: true,
		include: ["tests/**/*.test.ts"],
	},
});
