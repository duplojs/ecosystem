import { baseConfig, type Config } from "./base";

export const openConfig = {
	...baseConfig,
	rules: {
		...baseConfig.rules,
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
	},
} as const satisfies Config;
