import type { ESLint } from "eslint";
import { pluginRules } from "./rules";

export * from "./rules";

export const plugin = {
	meta: {
		name: "duplojs-plugin",
	},
	rules: pluginRules,
} as const satisfies ESLint.Plugin;

export const pluginSpecifier = "@duplojs/code-config/oxlint/plugin";

export default plugin;
