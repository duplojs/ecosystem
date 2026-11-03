import { engineConfig, createOxlintOverride, oxlint } from "@duplojs/code-config/oxlint";

export default oxlint.defineConfig({
	extends: [engineConfig],
	overrides: [
		createOxlintOverride({
			files: ["./commitlint.config.ts", "./oxlint.config.ts", "./vitest.config.ts"],
			ruleset: { open: true },
		}),
	],
	ignorePatterns: [
		"**/*",
		"!/commitlint.config.ts",
		"!/oxlint.config.ts",
		"!/vitest.config.ts",
	],
});
