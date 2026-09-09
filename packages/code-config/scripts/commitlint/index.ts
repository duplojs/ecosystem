import type { UserConfig } from "@commitlint/types";

const commitTypes = [
	"feat",
	"fix",
	"docs",
	"refactor",
	"config",
	"test",
	"ci",
] as const;

const typePattern = commitTypes.join("|");
const scopePattern = "[a-z][a-z0-9-]*";
const referencePattern = "[0-9]+|[a-z][a-z0-9-]*";

const headerPattern = new RegExp(
	`^(${typePattern})(?::(${scopePattern}))?\\((${referencePattern})\\): ([^\\s].*)$`,
);

export const config = {
	extends: ["@commitlint/config-conventional"],
	parserPreset: {
		parserOpts: {
			headerPattern,
			headerCorrespondence: [
				"type",
				"scope",
				"issue",
				"subject",
			],
		},
	},
	rules: {
		"type-enum": [2, "always", commitTypes],
		"scope-empty": [0],
		"scope-case": [2, "always", "kebab-case"],
		"subject-empty": [2, "never"],
		"subject-full-stop": [2, "never", "."],
		"header-trim": [2, "always"],
		"header-max-length": [2, "always", 100],
		"body-leading-blank": [1, "always"],
		"footer-leading-blank": [1, "always"],
	},
} satisfies UserConfig;

export default config;

