import type { Rule } from "eslint";

export interface NoRestrictedImportOptions {
	paths: Readonly<Record<string, string | null>>;
}

export type NoRestrictedImportRuleOptions = readonly [
	NoRestrictedImportOptions,
];

export const noRestrictedImport: Rule.RuleModule = {
	meta: {
		type: "problem",
		fixable: "code",
		schema: [
			{
				type: "object",
				properties: {
					paths: {
						type: "object",
						additionalProperties: {
							type: ["string", "null"],
						},
					},
				},
				required: ["paths"],
				additionalProperties: false,
			},
		],
		messages: {
			restrictedImport:
				"Import from \"{{ path }}\" is forbidden.",
			restrictedImportWithReplacement:
				"Import from \"{{ path }}\" is forbidden. Use \"{{ replacement }}\" instead.",
		},
	},

	create(context) {
		const paths = (
			context.options[0] as NoRestrictedImportOptions | undefined
		)?.paths ?? {};

		return {
			ImportDeclaration(node) {
				const path = String(node.source.value);

				if (!(path in paths)) {
					return;
				}

				const replacement = paths[path];

				context.report({
					node: node.source,
					messageId: replacement === null
						? "restrictedImport"
						: "restrictedImportWithReplacement",
					data: replacement === null
						? {
							path,
						}
						: {
							path,
							replacement,
						},
					fix: replacement === null
						? undefined
						: (fixer) => fixer.replaceText(
							node.source,
							`${node.source.raw![0]}${replacement}${node.source.raw![0]}`,
						),
				});
			},
		};
	},
};
