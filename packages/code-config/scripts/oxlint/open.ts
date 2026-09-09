import { defineConfig, type OxlintOverride } from "oxlint";
import { basePreset, basePresetConfig } from "./base";
import { defineRules } from "./defineRules";

export const openPreset = {
	...basePreset,
	rules: defineRules({
		...basePreset.rules,
		"func-style": "off",
		"max-classes-per-file": "off",
		"new-cap": "off",
		"no-bitwise": "off",
		"no-eval": "off",
		"no-magic-numbers": "off",
		"no-use-before-define": "off",
		"typescript/await-thenable": "off",
		"typescript/no-explicit-any": "off",
		"typescript/use-unknown-in-catch-callback-variable": "off",
	}),
} as const satisfies Omit<OxlintOverride, "files">;

export const openConfig = defineConfig({
	...openPreset,
	...basePresetConfig,
});
