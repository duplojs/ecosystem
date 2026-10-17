import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		watch: false,
		projects: ["packages/*", "packages-private/*", "docs"],
		coverage: {
			provider: "istanbul",
			reporter: ["text", "json", "html", "json-summary"],
			reportsDirectory: "coverage",
			include: ["**/scripts/**/*.{ts,vue}", "**/bin/snapshotDist/snapshotDist.ts"],
			exclude: ["**/*.config.ts", "packages-private/*"],
			thresholds: {
				lines: 100,
				branches: 100,
				functions: 100,
				statements: 100,
			},
		},
	},
});
