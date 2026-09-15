import { baseConfig, vueConfig } from "@scripts/config";
import { createEslintConfig } from "@scripts/createEslintConfig";
import { baseRules, openRules, testRules, vueRules } from "@scripts/rules";

describe("createEslintConfig", () => {
	it("creates a TypeScript config with the base rules by default", () => {
		const files = ["scripts/**/*.ts"];
		const config = createEslintConfig({
			environment: "ts",
			files,
		});

		expect(config).toEqual({
			...baseConfig,
			files,
			rules: baseRules,
		});
		expect(config).not.toBe(baseConfig);
		expect(config.rules).not.toBe(baseRules);
	});

	it("composes the enabled rulesets", () => {
		const config = createEslintConfig({
			environment: "ts",
			files: ["tests/**/*.ts"],
			ruleset: {
				open: true,
				test: true,
			},
		});

		expect(config.rules).toEqual({
			...baseRules,
			...openRules,
			...testRules,
		});
	});

	it("can compose optional rulesets without the base rules", () => {
		const config = createEslintConfig({
			environment: "ts",
			files: ["tests/**/*.ts"],
			ruleset: {
				base: false,
				open: true,
			},
		});

		expect(config.rules).toEqual(openRules);
	});

	it("creates a Vue config with the base and Vue rules by default", () => {
		const files = ["components/**/*.vue"];
		const config = createEslintConfig({
			environment: "vue/ts",
			files,
		});

		expect(config).toEqual({
			...vueConfig,
			files,
			rules: {
				...baseRules,
				...vueRules,
			},
		});
	});

	it("can disable the Vue rules independently from the Vue config", () => {
		const config = createEslintConfig({
			environment: "vue/ts",
			files: ["components/**/*.vue"],
			ruleset: {
				vue: false,
			},
		});

		expect(config).toMatchObject(vueConfig);
		expect(config.rules).toEqual(baseRules);
	});

	it("applies custom rules after the composed rulesets", () => {
		const customRules = {
			"no-eval": "warn",
			"vue/comment-directive": "off",
		} as const;
		const config = createEslintConfig({
			environment: "vue/ts",
			files: ["**/*.vue"],
			ruleset: {
				open: true,
				test: true,
			},
			customRules,
		});

		expect(config.rules).toEqual({
			...baseRules,
			...openRules,
			...testRules,
			...vueRules,
			...customRules,
		});
		expect(baseRules["no-eval"]).toBe("error");
		expect(vueRules["vue/comment-directive"]).toBe("error");
	});
});
