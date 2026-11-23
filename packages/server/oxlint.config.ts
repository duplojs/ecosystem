import { engineConfig, createOxlintOverride, oxlint } from "@duplojs/code-config/oxlint";

export default oxlint.defineConfig({
	extends: [engineConfig],
	overrides: [
		createOxlintOverride({
			files: ["**/*"],
			ruleset: { open: true },
		}),
		createOxlintOverride({
			files: ["**/*"],
			ruleset: { base: false },
			customRules: {
				"duplojs-plugin/prefer-namespace-import": [
					"error",
					{
						paths: {
							"@scripts/common": "DSCommon",
							"@scripts/file": "DSFile",
							"@scripts/dataStructure": "DSDataStructure",
							"@scripts/command": "DSCommand",
							"@scripts/path": "DSPath",
						},
					},
				],
				"duplojs-plugin/prefer-namespace-from-barrel": [
					"error",
					{
						sources: ["@scripts"],
						namespaces: {
							DSCommon: "@scripts/common",
							DSFile: "@scripts/file",
							DSDataStructure: "@scripts/dataStructure",
							DSCommand: "@scripts/command",
							DSPath: "@scripts/path",
						},
					},
				],
				"duplojs-plugin/prefer-import-path": [
					"error",
					{
						paths: {
							"@scripts": {
								replacement: "@scripts/common",
								exceptions: [
									"SF",
									"DSFile",
									"SDS",
									"DSDataStructure",
									"SC",
									"DSCommand",
									"SP",
									"DSPath",
									"DSCommon",
									"setEnvironment",
									"TESTImplementation",
								],
							},
						},
					},
				],
			},
		}),
		createOxlintOverride({
			files: [
				"**/*.test.ts",
				"**/*.bench.ts",
				"integrations/**/*.ts",
			],
			excludeFiles: ["**/*.d.ts"],
			ruleset: {
				base: false,
				test: true,
			},
			customRules: {
				"typescript/no-confusing-void-expression": "off",
				"require-yield": "off",
				"typescript/require-await": "off",
			},
		}),
	],
	ignorePatterns: ["dist/**"],
});
