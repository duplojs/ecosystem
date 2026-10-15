
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
		const reports: (Omit<Rule.ReportDescriptorOptions, "fix"> & {
			node: Parameters<typeof sourceCode.getScope>[0];
			messageId: string;
			fix?(fixer: Parameters<Rule.ReportFixer>[0]): Rule.Fix[] | null;
		})[] = [];
		const namespacesByPath = new Map<string, {
			name: string;
			typeOnly: boolean;
			variable: ReturnType<typeof sourceCode.getDeclaredVariables>[number] | undefined;
		}[]>();

		const getImportKind = (node: unknown) => (
			(node as { importKind?: "type" | "value" }).importKind
		);

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
								typeOnly: getImportKind(statement) === "type",
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

				const hasDefaultImport = node.specifiers.some(
					(specifier) => specifier.type === "ImportDefaultSpecifier",
				);
				const onlyTypes = getImportKind(node) === "type" || (
					!hasDefaultImport
					&& named.every((specifier) => getImportKind(specifier) === "type")
				);

				const reusableNamespace = !namespaceSpecifier
					? namespacesByPath.get(path)?.find((item) => (
						item.name === namespace
						&& (!item.typeOnly || onlyTypes)
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

							if (namespaceSpecifier) {
								fixes.push(
									fixer.replaceText(
										namespaceSpecifier.local,
										namespace,
									),
								);
							} else if (reusableNamespace) {
								if (node.specifiers.length === named.length) {
									fixes.push(fixer.remove(node));
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
							} else {
								fixes.push(fixer.replaceTextRange(
									[
										openingBrace!.range[0],
										closingBrace!.range[1],
									],
									`* as ${namespace}`,
								));

								if (onlyTypes && getImportKind(node) !== "type") {
									fixes.push(
										fixer.insertTextAfter(
											sourceCode.getFirstToken(node)!,
											" type",
										),
									);
								}
							}

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
				const fixAll = (fixer: Parameters<Rule.ReportFixer>[0]) => reports.flatMap(
					(report) => report.fix?.(fixer) ?? [],
				);

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
