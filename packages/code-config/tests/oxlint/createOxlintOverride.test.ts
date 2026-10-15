import type { OxlintOverride } from "oxlint";
import { DOxlint } from "@scripts";

describe("createOxlintOverride", () => {
	it("enables the base rules by default", () => {
		const files = ["scripts/**/*.ts"];
		const result = DOxlint.createOxlintOverride({ files });

		expect(result).toEqual({
			files,
			rules: DOxlint.baseRules,
		});
		expect(result.rules).not.toBe(DOxlint.baseRules);
		expectTypeOf(result).toEqualTypeOf<OxlintOverride>();
	});

	it.each([
		{
			ruleset: {},
			expected: DOxlint.baseRules,
		},
		{
			ruleset: {
				base: true,
				open: false,
				test: false,
			},
			expected: DOxlint.baseRules,
		},
		{
			ruleset: { open: true },
			expected: {
				...DOxlint.baseRules,
				...DOxlint.openRules,
			},
		},
		{
			ruleset: { test: true },
			expected: {
				...DOxlint.baseRules,
				...DOxlint.testRules,
			},
		},
		{
			ruleset: { base: false },
			expected: {},
		},
		{
			ruleset: {
				base: false,
				open: true,
			},
			expected: DOxlint.openRules,
		},
		{
			ruleset: {
				base: false,
				test: true,
			},
			expected: DOxlint.testRules,
		},
		{
			ruleset: {
				open: true,
				test: true,
			},
			expected: {
				...DOxlint.baseRules,
				...DOxlint.openRules,
				...DOxlint.testRules,
			},
		},
	])("composes $ruleset", ({ ruleset, expected }) => {
		const result = DOxlint.createOxlintOverride({
			files: ["**/*.ts"],
			ruleset,
		});

		expect(result.rules).toEqual(expected);
		expect(result).not.toHaveProperty("ruleset");
	});

	it("applies custom rules last without mutating the presets", () => {
		const customRules = {
			"no-eval": "warn",
			"duplojs-plugin/prefer-namespace-from-barrel": [
				"error",
				{
					sources: ["library"],
					namespaces: { Domain: "library/domain" },
				},
			],
		} satisfies DOxlint.OxlintRules;
		const result = DOxlint.createOxlintOverride({
			files: ["tests/**/*.ts"],
			ruleset: {
				open: true,
				test: true,
			},
			customRules,
		});

		expect(result.rules).toEqual({
			...DOxlint.baseRules,
			...DOxlint.openRules,
			...DOxlint.testRules,
			...customRules,
		});
		expect(DOxlint.baseRules["no-eval"]).toBe("error");
		expect(DOxlint.openRules["no-eval"]).toBe("off");
		expect(DOxlint.testRules["no-eval"]).toBe("off");
		expect(result).not.toHaveProperty("customRules");
	});

	it("supports a custom-only override and forwards Oxlint matching and environment options", () => {
		const result = DOxlint.createOxlintOverride({
			files: ["**/*.ts"],
			excludeFiles: ["fixtures/**"],
			env: { node: true },
			globals: { customGlobal: "readonly" },
			ruleset: { base: false },
			customRules: { "no-eval": "error" },
		});

		expect(result).toEqual({
			files: ["**/*.ts"],
			excludeFiles: ["fixtures/**"],
			env: { node: true },
			globals: { customGlobal: "readonly" },
			rules: { "no-eval": "error" },
		});
	});
});
