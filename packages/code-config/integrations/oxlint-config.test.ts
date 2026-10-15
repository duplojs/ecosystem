import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import * as DOxlint from "@duplojs/code-config/oxlint";

const require = createRequire(import.meta.url);

describe("Oxlint engine and overrides", () => {
	it.each([
		{
			name: "base",
			previousOverrides: [],
			ruleset: {},
			customRules: {},
			status: 1,
		},
		{
			name: "open",
			previousOverrides: [],
			ruleset: { open: true },
			customRules: {},
			status: 0,
		},
		{
			name: "test",
			previousOverrides: [],
			ruleset: { test: true },
			customRules: {},
			status: 0,
		},
		{
			name: "no base",
			previousOverrides: [],
			ruleset: { base: false },
			customRules: {},
			status: 0,
		},
		{
			name: "custom rules override open",
			previousOverrides: [],
			ruleset: { open: true },
			customRules: { "no-eval": "error" },
			status: 1,
		},
		{
			name: "open after an overlapping base override",
			previousOverrides: [DOxlint.createOxlintOverride({ files: ["**/*.ts"] })],
			ruleset: { open: true },
			customRules: {},
			status: 0,
		},
		{
			name: "base false preserves rules inherited from an earlier override",
			previousOverrides: [DOxlint.createOxlintOverride({ files: ["**/*.ts"] })],
			ruleset: { base: false },
			customRules: {},
			status: 1,
		},
	] as const)("applies $name with the native Oxlint CLI", ({ previousOverrides, ruleset, customRules, status }) => {
		const directory = mkdtempSync(join(tmpdir(), "duplojs-oxlint-config-"));

		try {
			const config = {
				...DOxlint.engineConfig,
				options: {
					...DOxlint.engineConfig.options,
					typeAware: false,
				},
				jsPlugins: [
					{
						name: "duplojs-plugin",
						specifier: fileURLToPath(new URL("../dist/oxlint/plugin/index.mjs", import.meta.url)),
					},
					{
						name: "@stylistic",
						specifier: require.resolve("@stylistic/eslint-plugin"),
					},
				],
				overrides: [
					...previousOverrides,
					DOxlint.createOxlintOverride({
						files: ["**/*.ts"],
						ruleset,
						customRules,
					}),
				],
			};
			writeFileSync(join(directory, ".oxlintrc.json"), JSON.stringify(config));
			writeFileSync(join(directory, "input.ts"), "eval(\"value\");\n");
			const result = spawnSync(process.execPath, [
				join(dirname(require.resolve("oxlint/package.json")), "bin/oxlint"),
				"--config",
				".oxlintrc.json",
				"input.ts",
			], {
				cwd: directory,
				encoding: "utf8",
			});

			expect(result.status, result.stdout + result.stderr).toBe(status);
		} finally {
			rmSync(directory, {
				recursive: true,
				force: true,
			});
		}
	});
});
