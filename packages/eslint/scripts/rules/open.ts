import { type FlatConfig } from "typescript-eslint";

export const openRules: FlatConfig.Rules = {
	"no-eval": "off",
	"no-bitwise": "off",
	"new-cap": "off",
	"func-style": "off",
	"max-classes-per-file": "off",
	"@typescript-eslint/no-explicit-any": "off",
	"@typescript-eslint/use-unknown-in-catch-callback-variable": "off",
	"@typescript-eslint/await-thenable": "off",
	"@typescript-eslint/no-magic-numbers": "off",
	"@typescript-eslint/no-use-before-define": "off",
};
