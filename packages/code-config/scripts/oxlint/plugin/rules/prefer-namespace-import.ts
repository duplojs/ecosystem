import type { Rule } from "eslint";

export interface PreferNamespaceImportOptions {
	paths: Readonly<Record<string, string>>;
}

export type PreferNamespaceImportRuleOptions = readonly [
	PreferNamespaceImportOptions,
];

export const preferNamespaceImport: Rule.RuleModule = {
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
							type: "string",
							pattern: "^[A-Za-z_$][A-Za-z0-9_$]*$",
						},
					},
				},
				required: ["paths"],
				additionalProperties: false,
			},
		],
		messages: {
			preferNamespaceImport:
				"Use namespace import \"{{ namespace }}\" for \"{{ path }}\".",
		},
	},

	create(context) {
		const sourceCode = context.sourceCode;
		const paths = (
			context.options[0] as PreferNamespaceImportOptions | undefined
		)?.paths ?? {};

		const importCounts = new Map<string, number>();
		const topLevelVariables = new Map<string, unknown[]>();

		return {
			Program(node) {
				for (const statement of node.body) {
					if (statement.type === "ImportDeclaration") {
						const path = String(statement.source.value);

						importCounts.set(
							path,
							(importCounts.get(path) ?? 0) + 1,
						);
					}

					for (const variable of sourceCode.getDeclaredVariables(statement)) {
						const variables = topLevelVariables.get(variable.name) ?? [];

						variables.push(variable);
						topLevelVariables.set(variable.name, variables);
					}
				}
			},

			ImportDeclaration(node) {
				const path = String(node.source.value);
				const namespace = paths[path];

				if (!namespace) {
					return;
				}

				const specifiers = node.specifiers.filter(
					(specifier) => specifier.type === "ImportSpecifier",
				);

				if (!specifiers.length) {
					return;
				}

				const variables = specifiers.flatMap(
					(specifier) => sourceCode.getDeclaredVariables(specifier),
				);

				const removableVariables = new Set<unknown>(variables);

				const hasNamespaceCollision = (
					topLevelVariables.get(namespace) ?? []
				).some(
					(variable) => !removableVariables.has(variable),
				);

				const hasMultipleImports = (importCounts.get(path)!) > 1;

				const references = specifiers.flatMap((specifier) => {
					const [variable] = sourceCode.getDeclaredVariables(specifier);

					return variable
						? variable.references.map((reference) => ({
							reference,
							specifier,
						}))
						: [];
				});

				const hasUnsupportedReference = references.some(
					({ reference }) => (
						(reference.identifier as {
							parent?: { type?: string };
						}).parent?.type === "ExportSpecifier"
					),
				);

				const canFix = (
					!hasNamespaceCollision
					&& !hasMultipleImports
					&& !hasUnsupportedReference
				);

				context.report({
					node,
					messageId: "preferNamespaceImport",
					data: {
						namespace,
						path,
					},

					fix: canFix
						? (fixer) => {
							const fixes: Rule.Fix[] = [];

							const firstSpecifier = specifiers[0]!;
							const lastSpecifier = specifiers.at(-1)!;

							const openingBrace = sourceCode.getTokenBefore(firstSpecifier);
							const closingBrace = sourceCode.getTokenAfter(lastSpecifier);

							if (
								!openingBrace
								|| !closingBrace
								|| openingBrace.value !== "{"
								|| closingBrace.value !== "}"
							) {
								return null;
							}

							fixes.push(
								fixer.replaceTextRange(
									[
										openingBrace.range[0],
										closingBrace.range[1],
									],
									`* as ${namespace}`,
								),
							);

							const importKind = (
								node as typeof node & {
									importKind?: "type" | "value";
								}
							).importKind;

							const allTypeOnly = (
								importKind !== "type"
								&& node.specifiers.length === specifiers.length
								&& specifiers.every(
									(specifier) => (
										(
											specifier as typeof specifier & {
												importKind?: "type" | "value";
											}
										).importKind === "type"
									),
								)
							);

							if (allTypeOnly) {
								const importToken = sourceCode.getFirstToken(node);

								fixes.push(
									fixer.insertTextAfter(
										importToken,
										" type",
									),
								);
							}

							for (const { reference, specifier } of references) {
								const identifier = reference.identifier;

								const imported = specifier.imported;

								const access = imported.type === "Identifier"
									? `${namespace}.${imported.name}`
									: `${namespace}[${sourceCode.getText(imported)}]`;

								const parent = (
									identifier as typeof identifier & {
										parent?: {
											type?: string;
											shorthand?: boolean;
										};
									}
								).parent;

								if (
									parent?.type === "Property"
									&& parent.shorthand
								) {
									fixes.push(
										fixer.replaceText(
											identifier,
											`${specifier.local.name}: ${access}`,
										),
									);
								} else {
									fixes.push(
										fixer.replaceText(
											identifier,
											access,
										),
									);
								}
							}

							return fixes;
						}
						: undefined,
				});
			},
		};
	},
};
