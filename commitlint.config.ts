import { typePattern, referencePattern, UserConfig } from "@duplojs/code-config/commitlint/config";

const scopes = [
	"lang",
	"server",
	"code-config",
	"json-web-token",
	"playwright",
	"tools",
];

const scopePattern = scopes.join("|");

const headerPattern = new RegExp(
	`^(${typePattern}):(${scopePattern})\\((${referencePattern})\\): ([^\\s].*)$`,
);

export default {
	extends: ["@duplojs/code-config/commitlint"],

	parserPreset: {
		parserOpts: {
			headerPattern,
		},
	},

	rules: {
		"scope-empty": [2, "never"],
		"scope-enum": [2, "always", scopes],
	},
} satisfies UserConfig;