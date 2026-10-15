import type { Rule } from "eslint";

export interface PreferredImportPath {
	replacement: string;
	exceptions?: readonly string[];
}

export interface PreferImportPathOptions {
	paths: Readonly<Record<string, PreferredImportPath>>;
}

export type PreferImportPathRuleOptions = readonly [PreferImportPathOptions];

export const preferImportPath: Rule.RuleModule = {
	meta: {
		type: "suggestion",
		fixable: "code",
		schema: [
			{
				type: "object",
				properties: {
					paths: {
						type: "object",
						additionalProperties: {
							type: "object",
							properties: {
								replacement: {
									type: "string",
									minLength: 1,
								},
								exceptions: {
									type: "array",
									items: { type: "string" },
									uniqueItems: true,
								},
							},
							required: ["replacement"],
							additionalProperties: false,
						},
					},
				},
				required: ["paths"],
				additionalProperties: false,
			},
		],
		messages: {
			preferImportPath: "Import non-exempt symbols from \"{{ replacement }}\" instead of \"{{ path }}\".",
		},
	},

	create(context) {
		const sourceCode = context.sourceCode;
		const paths = (
			context.options[0] as PreferImportPathOptions | undefined
		)?.paths ?? {};

		return {
			ImportDeclaration(node) {
				const path = String(node.source.value);

				if (!Object.hasOwn(paths, path)) {
					return;
				}

				const { replacement, exceptions = [] } = paths[path]!;

				if (replacement === path) {
					return;
				}

				const exemptNames = new Set(exceptions);
				const remaining = node.specifiers.filter((specifier) => {
					if (specifier.type === "ImportNamespaceSpecifier") {
						// A namespace includes exempt symbols too; keep the whole binding.
						return exceptions.length > 0;
					}

					if (specifier.type === "ImportDefaultSpecifier") {
						return exemptNames.has("default");
					}

					const name = specifier.imported.type === "Identifier"
						? specifier.imported.name
						: String(specifier.imported.value);

					return exemptNames.has(name);
				});
				const moved = node.specifiers.filter(
					(specifier) => !remaining.includes(specifier),
				);

				if (node.specifiers.length > 0 && !moved.length) {
					return;
				}

				const [quote] = sourceCode.getText(node.source);
				const replacementLiteral = quote === "'"
					? `'${replacement
						.replace(/\\/g, "\\\\")
						.replace(/'/g, "\\'")
						.replace(/\n/g, "\\n")
						.replace(/\r/g, "\\r")}'`
					: JSON.stringify(replacement);

				const attributes = node as typeof node & {
					attributes?: unknown[];
					assertions?: unknown[];
				};
				const canSplit = (
					!remaining.some((specifier) => specifier.type === "ImportNamespaceSpecifier")
					&& !sourceCode.getCommentsInside(node).length
					&& !attributes.attributes?.length
					&& !attributes.assertions?.length
				);

				context.report({
					node: node.source,
					messageId: "preferImportPath",
					data: {
						path,
						replacement,
					},
					fix: remaining.length && !canSplit
						? undefined
						: (fixer) => {
							if (!remaining.length) {
								return fixer.replaceText(node.source, replacementLiteral);
							}

							const typeOnly = (node as typeof node & {
								importKind?: string;
							}).importKind === "type";
							const semi = sourceCode.getText(node).endsWith(";") ? ";" : "";
							const renderImport = (specifiers: typeof node.specifiers, literal: string) => {
								const defaultSpecifier = specifiers.find(
									(specifier) => specifier.type === "ImportDefaultSpecifier",
								);
								const named = specifiers.filter(
									(specifier) => specifier.type === "ImportSpecifier",
								);
								const clauses: string[] = [];

								if (defaultSpecifier) {
									clauses.push(sourceCode.getText(defaultSpecifier));
								}

								if (named.length) {
									clauses.push(`{ ${named.map((specifier) => sourceCode.getText(specifier)).join(", ")} }`);
								}

								return `import${typeOnly ? " type" : ""} ${clauses.join(", ")} from ${literal}${semi}`;
							};
							const lineStart = sourceCode.text.lastIndexOf("\n", node.range![0] - 1) + 1;
							const prefix = sourceCode.text.slice(lineStart, node.range![0]);
							const indentation = /^\s*$/.test(prefix) ? prefix : "";

							return fixer.replaceText(node, [
								renderImport(remaining, sourceCode.getText(node.source)),
								renderImport(moved, replacementLiteral),
							].join(`\n${indentation}`));
						},
				});
			},
		};
	},
};
