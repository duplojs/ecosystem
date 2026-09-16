import { RuleTester } from "oxlint/plugins-dev";
import { DOxlint } from "@scripts";

RuleTester.describe = describe;
RuleTester.it = it;

const options = [
	{
		paths: {
			"node:fs": "@duplojs/server-utils/file",
			"node:path": null,
		},
	},
];

const ruleTester = new RuleTester({
	languageOptions: {
		parserOptions: {
			lang: "ts",
		},
	},
});

ruleTester.run(
	"no-restricted-import",
	DOxlint.noRestrictedImport as never,
	{
		valid: [
			{
				name: "ignores when no path is configured",
				code: `
					import { readFile } from "node:fs";
				`,
			},
			{
				name: "ignores unconfigured paths",
				code: `
					import { readFile } from "node:fs/promises";
				`,
				options,
			},
		],

		invalid: [
			{
				name: "reports restricted import without replacement",
				code: `
					import path from "node:path";
				`,
				options,
				errors: [
					{
						messageId: "restrictedImport",
					},
				],
			},
			{
				name: "replaces restricted import",
				code: `
					import { readFile } from "node:fs";
				`,
				output: `
					import { readFile } from "@duplojs/server-utils/file";
				`,
				options,
				errors: [
					{
						messageId: "restrictedImportWithReplacement",
					},
				],
			},
			{
				name: "replaces side effect import",
				code: `
					import "node:fs";
				`,
				output: `
					import "@duplojs/server-utils/file";
				`,
				options,
				errors: [
					{
						messageId: "restrictedImportWithReplacement",
					},
				],
			},
			{
				name: "preserves single quotes",
				code: `
					import { readFile } from 'node:fs';
				`,
				output: `
					import { readFile } from '@duplojs/server-utils/file';
				`,
				options,
				errors: [
					{
						messageId: "restrictedImportWithReplacement",
					},
				],
			},
		],
	},
);
