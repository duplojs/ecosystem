
import type { Rule, Scope } from "eslint";

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

		const importsByPath = new Map<string, number>();
		const namespaceImportsToRewrite = new Map<Extract<(typeof sourceCode.ast.body)[number], { type: "ImportDeclaration" }>, string>();
		const reports: (Omit<Rule.ReportDescriptorOptions, "fix"> & {
			node: Parameters<typeof sourceCode.getScope>[0];
			messageId: string;
			fix?(fixer: Parameters<Rule.ReportFixer>[0]): Rule.Fix[] | null;
		})[] = [];
		const namespacesByPath = new Map<string, {
			name: string;
			declaration: Extract<(typeof sourceCode.ast.body)[number], { type: "ImportDeclaration" }>;
			variable: ReturnType<typeof sourceCode.getDeclaredVariables>[number] | undefined;
		}[]>();

		return {
			Program(node) {
				for (const statement of node.body) {
					if (statement.type !== "ImportDeclaration") {
						continue;
					}

					const path = String(statement.source.value);
					importsByPath.set(
						path,
						(importsByPath.get(path) ?? 0) + 1,
					);

					for (const specifier of statement.specifiers) {
						if (specifier.type !== "ImportNamespaceSpecifier") {
							continue;
						}

						namespacesByPath.set(path, [
							...(namespacesByPath.get(path) ?? []),
							{
								name: specifier.local.name,
								declaration: statement,
								variable: sourceCode.getDeclaredVariables(specifier)[0],
							},
						]);
					}
				}
			},

			ImportDeclaration(node) {
				const path = String(node.source.value);
				const namespace = Object.hasOwn(paths, path)
					? paths[path]
					: undefined;

				if (!namespace) {
					return;
				}

				const named = node.specifiers.filter(
					(specifier) => specifier.type === "ImportSpecifier",
				);
				const namespaceSpecifier = node.specifiers.find(
					(specifier) => specifier.type === "ImportNamespaceSpecifier",
				);
				const targetSpecifiers = named.length
					? named
					: (namespaceSpecifier && [namespaceSpecifier]) || [];

				if (
					!targetSpecifiers.length
					|| (namespaceSpecifier?.local.name === namespace && !named.length)
				) {
					return;
				}

				const reusableNamespace = !namespaceSpecifier
					? namespacesByPath.get(path)?.find((item) => (
						item.name === namespace
					))
					: undefined;

				const hasMultipleImports = (
					(importsByPath.get(path) ?? 0) > 1
					&& !reusableNamespace
				);

				const bindings = targetSpecifiers.map(
					(specifier) => sourceCode.getDeclaredVariables(specifier)[0],
				);
				const removable = new Set(bindings);

				const references = targetSpecifiers.flatMap(
					(specifier, index) => (
						bindings[index]?.references.map((reference) => {
							let member = namespace;

							if (specifier.type === "ImportSpecifier") {
								member = specifier.imported.type === "Identifier"
									? `${namespace}.${specifier.imported.name}`
									: `${namespace}[${sourceCode.getText(specifier.imported)}]`;
							}

							return {
								identifier: reference.identifier,
								member,
							};
						}) ?? []
					),
				);

				const hasCollision = [
					node,
					...references.map(({ identifier }) => identifier),
				].some((entry) => {
					let scope: Scope.Scope | null = sourceCode.getScope(
						entry as Parameters<typeof sourceCode.getScope>[0],
					);

					while (scope) {
						const binding = scope.set.get(namespace);

						if (
							binding
							&& !removable.has(binding)
							&& binding !== reusableNamespace?.variable
						) {
							return true;
						}

						scope = scope.upper;
					}

					return false;
				});

				const hasUnsupportedReferences = references.some(
					({ identifier }) => (
						(identifier as typeof identifier & {
							parent?: { type: string };
						}).parent?.type === "ExportSpecifier"
					),
				);

				const [first] = named;
				const last = named.at(-1);
				const openingBrace = first && sourceCode.getTokenBefore(first);
				const closingBrace = last && sourceCode.getTokenAfter(last);

				const hasValidBraces = !named.length || (
					openingBrace?.value === "{"
					&& closingBrace?.value === "}"
				);

				const hasImportComments = (
					hasValidBraces
					&& named.length > 0
					&& sourceCode.getCommentsInside(node).some(
						(comment) => (
							comment.range![0] > openingBrace!.range[0]
							&& comment.range![1] < closingBrace!.range[1]
						),
					)
				);

				const canFix = (
					bindings.every(Boolean)
					&& !hasMultipleImports
					&& !hasCollision
					&& !hasUnsupportedReferences
					&& hasValidBraces
					&& !hasImportComments
				);

				reports.push({
					node,
					messageId: "preferNamespaceImport",
					data: {
						path,
						namespace,
					},
					fix: !canFix
						? undefined
						: (fixer) => {
							const fixes: Rule.Fix[] = [];

							if (reusableNamespace) {
								if (node.specifiers.length === named.length) {
									const lineStart = sourceCode.text.lastIndexOf("\n", node.range![0] - 1) + 1;
									const prefix = sourceCode.text.slice(lineStart, node.range![0]);
									const trailing = sourceCode.text.slice(node.range![1]).match(/^[\t ]*(?:\r?\n|$)/);

									fixes.push(fixer.removeRange(
										/^[\t ]*$/.test(prefix) && trailing
											? [lineStart, node.range![1] + trailing[0].length]
											: node.range!,
									));
								} else {
									const comma = sourceCode.getTokenBefore(openingBrace!);

									if (comma?.value !== ",") {
										return null;
									}

									fixes.push(fixer.removeRange([
										comma.range[0],
										closingBrace!.range[1],
									]));
								}
							}

							namespaceImportsToRewrite.set(reusableNamespace?.declaration ?? node, namespace);

							for (const { identifier, member } of references) {
								const parent = (identifier as typeof identifier & {
									parent?: {
										type: string;
										shorthand?: boolean;
									};
								}).parent;

								fixes.push(fixer.replaceText(
									identifier,
									parent?.type === "Property" && parent.shorthand
										? `${identifier.name}: ${member}`
										: member,
								));
							}

							return fixes;
						},
				});
			},

			"Program:exit"() {
				// Import edits and their references can span other imports. Group the
				// fixes so Oxlint can apply them together without overlapping reports.
				const fixAll = (fixer: Parameters<Rule.ReportFixer>[0]) => {
					namespaceImportsToRewrite.clear();
					const fixes = reports.flatMap((report) => report.fix?.(fixer) ?? []);

					for (const [declaration, namespace] of namespaceImportsToRewrite) {
						const defaultSpecifier = declaration.specifiers.find(
							(specifier) => specifier.type === "ImportDefaultSpecifier",
						);
						const comments = sourceCode.getCommentsInside(declaration)
							.filter((comment) => comment.range![1] < declaration.source.range![0])
							.map((comment) => `${sourceCode.text.slice(...comment.range!)}${comment.type === "Line" ? "\n" : " "}`)
							.join("");
						const defaultImport = defaultSpecifier ? `${sourceCode.getText(defaultSpecifier)}, ` : "";
						const suffix = sourceCode.text.slice(declaration.source.range![1], declaration.range![1]);

						fixes.push(fixer.replaceText(
							declaration,
							`import ${comments}${defaultImport}* as ${namespace} from ${sourceCode.getText(declaration.source)}${suffix}`,
						));
					}

					return fixes;
				};

				for (const report of reports) {
					context.report({
						...report,
						fix: report.fix ? fixAll : undefined,
					});
				}
			},
		};
	},
};
