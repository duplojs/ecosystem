import { config, type UserConfig, typePattern, referencePattern } from "@duplojs/code-config/commitlint";

const scopes = [
    "code-config",
	"eslint",
	"form",
	"http",
    "json-web-token",
    "lang",
    "playwright",
    "server",
    "tools",
	"ecosystem",
];

const scopePattern = scopes.join("|");

const headerPattern = new RegExp(
    `^(${typePattern}):(${scopePattern})\\((${referencePattern})\\): ([^\\s].*)$`,
);

export default {
	...config,
	parserPreset: {
		...config.parserPreset,
		parserOpts: {
			...config.parserPreset.parserOpts,
			headerPattern,
		},
	},
	rules: {
		...config.rules,
		"scope-empty": [2, "never"],
		"scope-enum": [2, "always", scopes],
    }
} satisfies UserConfig;