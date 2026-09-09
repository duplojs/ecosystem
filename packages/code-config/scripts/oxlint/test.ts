import { defineConfig, type OxlintOverride } from "oxlint";
import { basePreset, basePresetConfig } from "./base";
import { defineRules } from "./defineRules";

export const testPreset = {
	...basePreset,
	rules: defineRules({
		...basePreset.rules,
		"no-eval": "off",
		"no-bitwise": "off",
		"new-cap": "off",
		"func-style": "off",
		"no-unused-vars": "off",
		"max-classes-per-file": "off",
		"no-useless-assignment": "off",
		"typescript/no-explicit-any": "off",
		"typescript/use-unknown-in-catch-callback-variable": "off",
		"typescript/await-thenable": "off",
		"typescript/no-empty-object-type": "off",
		"no-magic-numbers": "off",
		"no-use-before-define": "off",
		"typescript/no-unnecessary-type-parameters": "off",
		"typescript/no-unsafe-member-access": "off",
		"typescript/no-unsafe-argument": "off",
		"typescript/no-unsafe-assignment": "off",
		"typescript/no-unsafe-call": "off",
		"typescript/no-unsafe-declaration-merging": "off",
		"typescript/no-unsafe-enum-comparison": "off",
		"typescript/no-unsafe-function-type": "off",
		"typescript/no-unsafe-return": "off",
		"typescript/no-unsafe-unary-minus": "off",
	}),
} as const satisfies Omit<OxlintOverride, "files">;

export const testConfig = defineConfig({
	...testPreset,
	...basePresetConfig,
});
