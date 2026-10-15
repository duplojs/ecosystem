
import type { Rule, Scope } from "eslint";

export interface PreferNamespaceFromBarrelOptions {
	sources: readonly string[];
	namespaces: Readonly<Record<string, string>>;
}

export type PreferNamespaceFromBarrelRuleOptions = readonly [
	PreferNamespaceFromBarrelOptions,
];

export const preferNamespaceFromBarrel: Rule.RuleModule = {
	meta: {
		type: "suggestion",
		fixable: "code",
		schema: [
			{
				type: "object",
				properties: {
					sources: {
						type: "array",
						items: { type: "string" },
						uniqueItems: true,
					},
					namespaces: {
						type: "object",
						propertyNames: {
							pattern: "^[A-Za-z_$][A-Za-z0-9_$]*$",
						},
						additionalProperties: {
							type: "string",
							minLength: 1,
						},
					},
				},
				required: ["sources", "namespaces"],
				additionalProperties: false,
			},
		],
		messages: {
			preferNamespaceFromBarrel:
				"Import \"{{ namespace }}\" directly from \"{{ path }}\".",
		},
	},

	create(context) {
		const sourceCode = context.sourceCode;
		const { sources = [], namespaces = {} } = (
			context.options[0] as PreferNamespaceFromBarrelOptions | undefined
		) ?? {};

		const sourcePaths = new Set(sources);
		const namespaceImports = new Map<string, {
			name: string;
			typeOnly: boolean;
			variable: ReturnType<typeof sourceCode.getDeclaredVariables>[number] | undefined;
		}[]>();
		const importedDomains = new Map<string, number>();

		const isTypeOnly = (node: unknown) => (
			(node as { importKind?: string }).importKind === "type"
		);

		return {
			Program(node) {
				for (const statement of node.body) {
					if (statement.type !== "ImportDeclaration") {
						continue;
					}

					const source = String(statement.source.value);

					for (const specifier of statement.specifiers) {
						if (specifier.type === "ImportNamespaceSpecifier") {
							namespaceImports.set(source, [
								...(namespaceImports.get(source) ?? []),
								{
									name: specifier.local.name,
									typeOnly: isTypeOnly(statement),
									variable: sourceCode.getDeclaredVariables(specifier)[0],
								},
							]);
						}

						if (
							sourcePaths.has(source)
							&& specifier.type === "ImportSpecifier"
						) {
							const name = specifier.imported.type === "Identifier"
								? specifier.imported.name
								: String(specifier.imported.value);

							const path = Object.hasOwn(namespaces, name)
								? namespaces[name]
								: undefined;

							if (path) {
								const key = `${name}\0${path}`;
								importedDomains.set(
									key,
									(importedDomains.get(key) ?? 0) + 1,
								);
							}
						}
					}
				}
			},

			ImportDeclaration(node) {
				if (!sourcePaths.has(String(node.source.value))) {
					return;
				}

				const selected = node.specifiers.flatMap((specifier) => {
					if (specifier.type !== "ImportSpecifier") {
						return [];
					}

					const name = specifier.imported.type === "Identifier"
						? specifier.imported.name
						: String(specifier.imported.value);

					const path = Object.hasOwn(namespaces, name)
						? namespaces[name]
						: undefined;

					return path
						? [
							{
								specifier,
								name,
								path,
							},
						]
						: [];
				});

				if (!selected.length) {
					return;
				}

				const domains = [...new Set(selected.map(({ name }) => name))].map((name) => {
					const imports = selected.filter(
						(item) => item.name === name,
					);
					const path = imports[0]!.path;
					const typeOnly = imports.every(
						({ specifier }) => (
							isTypeOnly(node) || isTypeOnly(specifier)
						),
					);

					const reusable = namespaceImports.get(path)?.find(
						(item) => (
							item.name === name
							&& (!item.typeOnly || typeOnly)
						),
					);

					return {
						name,
						path,
						typeOnly,
						reusable,
					};
				});

				const variables = selected.map(
					({ specifier }) => sourceCode.getDeclaredVariables(specifier)[0],
				);
				const removable = new Set(variables);

				const references = selected.flatMap(
					({ name }, index) => (
						variables[index]?.references.map((reference) => ({
							identifier: reference.identifier,
							name,
						})) ?? []
					),
				);

				const remaining = node.specifiers.filter(
					(specifier) => !selected.some(
						(item) => item.specifier === specifier,
					),
				);

				const named = node.specifiers.filter(
					(specifier) => specifier.type === "ImportSpecifier",
				);

				const opening = sourceCode.getTokenBefore(named[0]!);
				const closing = sourceCode.getTokenAfter(named.at(-1)!);
				const hasComments = (
					sourceCode.getCommentsInside(node).length > 0
				);

				const hasCollision = domains.some(({ name, reusable }) => {
					const locations = [
						node,
						...references
							.filter((reference) => reference.name === name)
							.map((reference) => reference.identifier),
					];

					for (const location of locations) {
						let scope: Scope.Scope | null = sourceCode.getScope(
							location as Parameters<typeof sourceCode.getScope>[0],
						);

						while (scope) {
							const binding = scope.set.get(name);

							if (
								binding
								&& !removable.has(binding)
								&& binding !== reusable?.variable
							) {
								return true;
							}

							scope = scope.upper;
						}
					}

					return false;
				});

				const hasUnsupportedExport = references.some(
					({ identifier, name }) => (
						identifier.name !== name
						&& (
							identifier as typeof identifier & {
								parent?: { type?: string };
							}
						).parent?.type === "ExportSpecifier"
					),
				);

				const hasDuplicateImport = domains.some(
					({ name, path, reusable }) => (
						!reusable
						&& (
							importedDomains.get(`${name}\0${path}`) ?? 0
						) > selected.filter(
							(item) => item.name === name,
						).length
					),
				);

				const attributes = node as typeof node & {
					attributes?: unknown[];
					assertions?: unknown[];
				};

				const canFix = (
					variables.every(Boolean)
					&& opening?.value === "{"
					&& closing?.value === "}"
					&& !hasComments
					&& !hasCollision
					&& !hasUnsupportedExport
					&& !hasDuplicateImport
					&& !attributes.attributes?.length
					&& !attributes.assertions?.length
				);

				context.report({
					node,
					messageId: "preferNamespaceFromBarrel",
					data: {
						namespace: domains.map(
							({ name }) => name,
						).join(", "),
						path: domains.map(
							({ path }) => path,
						).join(", "),
					},
					fix: !canFix
						? undefined
						: (fixer) => {
							const fixes: Rule.Fix[] = [];

							const remainingNamed = remaining.filter(
								(specifier) => (
									specifier.type === "ImportSpecifier"
								),
							);

							const before = sourceCode.text.slice(
								node.range![0],
								opening!.range[0],
							);
							const after = sourceCode.text.slice(
								closing!.range[1],
								node.range![1],
							);

							const defaultSpecifier = remaining.find(
								(specifier) => (
									specifier.type === "ImportDefaultSpecifier"
								),
							);

							let original = "";

							if (remainingNamed.length) {
								original = `${before}{ ${
									remainingNamed
										.map((item) => sourceCode.getText(item))
										.join(", ")
								} }${after}`;
							} else if (defaultSpecifier) {
								original = `${before.replace(/,\s*$/, "")}${after}`;
							}

							const [quote] = sourceCode.getText(node.source);
							const semi = sourceCode.getText(node).endsWith(";")
								? ";"
								: "";

							const added = domains.flatMap(
								({ name, path, typeOnly, reusable }) => (
									reusable
										? []
										: [`import${typeOnly ? " type" : ""} * as ${name} from ${quote}${path}${quote}${semi}`]
								),
							);

							const lineStart = (
								sourceCode.text.lastIndexOf(
									"\n",
									node.range![0] - 1,
								) + 1
							);

							const prefix = sourceCode.text.slice(
								lineStart,
								node.range![0],
							);
							const indentation = /^\s*$/.test(prefix) ? prefix : "";

							fixes.push(fixer.replaceText(
								node,
								[original, ...added]
									.filter(Boolean)
									.join(`\n${indentation}`),
							));

							for (const { identifier, name } of references) {
								if (identifier.name === name) {
									continue;
								}

								const parent = (
									identifier as typeof identifier & {
										parent?: {
											type?: string;
											shorthand?: boolean;
										};
									}
								).parent;

								fixes.push(fixer.replaceText(
									identifier,
									parent?.type === "Property" && parent.shorthand
										? `${identifier.name}: ${name}`
										: name,
								));
							}

							return fixes;
						},
				});
			},
		};
	},
};
