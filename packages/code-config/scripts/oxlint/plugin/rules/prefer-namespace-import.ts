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

		const pathEntries = Object.entries(paths);

		const importCounts = new Map<string, number>();

		const existingNamespaceImports = new Map<
			string,
			Map<
				string,
				{
					variable: unknown;
					typeOnly: boolean;
				}
			>
		>();

		const topLevelVariables = new Map<string, unknown[]>();

		const getImportKind = (
			value: unknown,
		) => (
			value as {
				importKind?: "type" | "value";
			}
		).importKind;

		const getReusableNamespaceImport = (
			path: string,
			namespace: string,
			typeOnly: boolean,
		) => {
			const namespaceImport = (
				existingNamespaceImports
					.get(path)
					?.get(namespace)
			);

			if (
				!namespaceImport
				|| (
					namespaceImport.typeOnly
					&& !typeOnly
				)
			) {
				return undefined;
			}

			return namespaceImport;
		};

		return {
			Program(node) {
				for (const statement of node.body) {
					if (statement.type === "ImportDeclaration") {
						const path = String(statement.source.value);

						importCounts.set(
							path,
							(importCounts.get(path) ?? 0) + 1,
						);

						for (const specifier of statement.specifiers) {
							if (
								specifier.type
									!== "ImportNamespaceSpecifier"
							) {
								continue;
							}

							const [variable] = (
								sourceCode.getDeclaredVariables(
									specifier,
								)
							);

							if (!variable) {
								continue;
							}

							const namespaceImports = (
								existingNamespaceImports.get(path)
								?? new Map()
							);

							namespaceImports.set(
								specifier.local.name,
								{
									variable,
									typeOnly:
										getImportKind(statement)
											=== "type",
								},
							);

							existingNamespaceImports.set(
								path,
								namespaceImports as never,
							);
						}
					}

					for (
						const variable of sourceCode
							.getDeclaredVariables(statement)
					) {
						const variables = (
							topLevelVariables.get(variable.name)
							?? []
						);

						variables.push(variable);

						topLevelVariables.set(
							variable.name,
							variables,
						);
					}
				}
			},

			ImportDeclaration(node) {
				const path = String(node.source.value);

				const barrelSpecifiers = node.specifiers.flatMap(
					(specifier) => {
						if (
							specifier.type !== "ImportSpecifier"
							|| specifier.imported.type
								!== "Identifier"
						) {
							return [];
						}

						const matches = pathEntries.filter(
							([targetPath, namespace]) => (
								namespace === (
									specifier.imported as {
										name: string;
									}
								).name
								&& targetPath.startsWith(
									`${path}/`,
								)
							),
						);

						if (matches.length !== 1) {
							return [];
						}

						const [
							targetPath,
							namespace,
						] = matches[0]!;

						const typeOnly = (
							getImportKind(node) === "type"
							|| getImportKind(specifier)
								=== "type"
						);

						return [
							{
								specifier,
								targetPath,
								namespace,
								typeOnly,
							},
						];
					},
				);

				if (barrelSpecifiers.length) {
					const barrelVariables = barrelSpecifiers.flatMap(
						({ specifier }) => (
							sourceCode.getDeclaredVariables(
								specifier,
							)
						),
					);

					const removableVariables = new Set<unknown>(
						barrelVariables,
					);

					const hasNamespaceCollision = (
						barrelSpecifiers.some(
							({
								targetPath,
								namespace,
								typeOnly,
							}) => {
								const reusableNamespaceImport = (
									getReusableNamespaceImport(
										targetPath,
										namespace,
										typeOnly,
									)
								);

								return (
									topLevelVariables.get(
										namespace,
									) ?? []
								).some(
									(variable) => (
										!removableVariables.has(
											variable,
										)
										&& variable
											!== reusableNamespaceImport
												?.variable
									),
								);
							},
						)
					);

					const references = barrelSpecifiers.flatMap(
						({ specifier, namespace }) => {
							const variable = (
								sourceCode.getDeclaredVariables(
									specifier,
								)[0]!
							);

							return variable.references.map(
								(reference) => ({
									reference,
									specifier,
									namespace,
								}),
							);
						},
					);

					const hasUnsupportedReference = references.some(
						({
							reference,
							specifier,
							namespace,
						}) => (
							specifier.local.name !== namespace
							&& (
								reference.identifier as {
									parent?: {
										type?: string;
									};
								}
							).parent?.type === "ExportSpecifier"
						),
					);

					const canFix = (
						!hasNamespaceCollision
						&& !hasUnsupportedReference
					);

					const {
						targetPath,
						namespace,
					} = barrelSpecifiers[0]!;

					context.report({
						node,
						messageId: "preferNamespaceImport",
						data: {
							namespace,
							path: targetPath,
						},

						fix: canFix
							? (fixer) => {
								const fixes: Rule.Fix[] = [];

								const barrelSpecifierSet = new Set(
									barrelSpecifiers.map(
										({ specifier }) => (
											specifier
										),
									),
								);

								const remainingSpecifiers = (
									node.specifiers.filter(
										(specifier) => (
											!barrelSpecifierSet.has(
												specifier as never,
											)
										),
									)
								);

								const tokens = (
									sourceCode.getTokens(node)
								);

								const openingBrace = tokens.find(
									(token) => (
										token.value === "{"
									),
								)!;

								const closingBrace = tokens.find(
									(token) => (
										token.value === "}"
										&& openingBrace
										&& token.range[0]
											> openingBrace.range[0]
									),
								)!;

								const remainingNamedSpecifiers = (
									remainingSpecifiers.filter(
										(specifier) => (
											specifier.range
											&& specifier.range[0]
												> openingBrace
													.range[0]
											&& specifier.range[1]
												< closingBrace
													.range[1]
										),
									)
								);

								const remainingOuterSpecifiers = (
									remainingSpecifiers.filter(
										(specifier) => (
											specifier.range
											&& specifier.range[1]
												< openingBrace
													.range[0]
										),
									)
								);

								let remainingImport:
									| string
									| null = null;

								if (
									remainingNamedSpecifiers.length
								) {
									const beforeNamedImports = (
										sourceCode.text.slice(
											node.range![0],
											openingBrace.range[0],
										)
									);

									const afterNamedImports = (
										sourceCode.text.slice(
											closingBrace.range[1],
											node.range![1],
										)
									);

									remainingImport = `${
										beforeNamedImports
									}{ ${
										remainingNamedSpecifiers
											.map(
												(specifier) => (
													sourceCode
														.getText(
															specifier,
														)
												),
											)
											.join(", ")
									} }${
										afterNamedImports
									}`;
								} else if (
									remainingOuterSpecifiers.length
								) {
									const beforeNamedImports = (
										sourceCode.text
											.slice(
												node.range![0],
												openingBrace
													.range[0],
											)
											.replace(
												/,\s*$/,
												"",
											)
									);

									const afterNamedImports = (
										sourceCode.text.slice(
											closingBrace.range[1],
											node.range![1],
										)
									);

									remainingImport = `${
										beforeNamedImports
									}${
										afterNamedImports
									}`;
								}

								const namespaceImports = (
									barrelSpecifiers.flatMap(
										({
											targetPath,
											namespace,
											typeOnly,
										}) => {
											const reusableNamespaceImport = (
												getReusableNamespaceImport(
													targetPath,
													namespace,
													typeOnly,
												)
											);

											if (
												reusableNamespaceImport
											) {
												return [];
											}

											return [
												`import${
													typeOnly
														? " type"
														: ""
												} * as ${
													namespace
												} from "${
													targetPath
												}";`,
											];
										},
									)
								);

								const lineStart = (
									sourceCode.text.lastIndexOf(
										"\n",
										node.range![0] - 1,
									) + 1
								);

								const indentation = (
									sourceCode.text.slice(
										lineStart,
										node.range![0],
									)
								);

								fixes.push(
									fixer.replaceText(
										node,
										[
											remainingImport,
											...namespaceImports,
										]
											.filter(Boolean)
											.join(
												`\n${indentation}`,
											),
									),
								);

								for (
									const {
										reference,
										specifier,
										namespace,
									} of references
								) {
									if (
										specifier.local.name
											=== namespace
									) {
										continue;
									}

									const identifier = (
										reference.identifier
									);

									const parent = (
										identifier as (
											typeof identifier & {
												parent?: {
													type?: string;
													shorthand?: boolean;
												};
											}
										)
									).parent;

									if (
										parent?.type
											=== "Property"
										&& parent.shorthand
									) {
										fixes.push(
											fixer.replaceText(
												identifier,
												`${specifier.local.name}: ${namespace}`,
											),
										);
									} else {
										fixes.push(
											fixer.replaceText(
												identifier,
												namespace,
											),
										);
									}
								}

								return fixes;
							}
							: undefined,
					});

					return;
				}

				const namespace = paths[path];

				if (!namespace) {
					return;
				}

				const specifiers = node.specifiers.filter(
					(specifier) => (
						specifier.type === "ImportSpecifier"
					),
				);

				if (!specifiers.length) {
					return;
				}

				const variables = specifiers.flatMap(
					(specifier) => (
						sourceCode.getDeclaredVariables(specifier)
					),
				);

				const removableVariables = new Set<unknown>(
					variables,
				);

				const importKind = getImportKind(node);

				const onlyTypeImports = specifiers.every(
					(specifier) => (
						importKind === "type"
						|| getImportKind(specifier) === "type"
					),
				);

				const reusableNamespaceImport = (
					getReusableNamespaceImport(
						path,
						namespace,
						onlyTypeImports,
					)
				);

				const hasNamespaceCollision = (
					topLevelVariables.get(namespace) ?? []
				).some(
					(variable) => (
						!removableVariables.has(variable)
						&& variable
							!== reusableNamespaceImport?.variable
					),
				);

				const hasMultipleImports = (
					!reusableNamespaceImport
					&& importCounts.get(path)! > 1
				);

				const references = specifiers.flatMap(
					(specifier) => {
						const [variable] = (
							sourceCode.getDeclaredVariables(
								specifier,
							)
						);

						return variable
							? variable.references.map(
								(reference) => ({
									reference,
									specifier,
								}),
							)
							: [];
					},
				);

				const hasUnsupportedReference = references.some(
					({ reference }) => (
						(
							reference.identifier as {
								parent?: {
									type?: string;
								};
							}
						).parent?.type === "ExportSpecifier"
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
							const lastSpecifier = (
								specifiers.at(-1)!
							);

							const openingBrace = (
								sourceCode.getTokenBefore(
									firstSpecifier,
								)
							);

							const closingBrace = (
								sourceCode.getTokenAfter(
									lastSpecifier,
								)
							);

							if (
								!openingBrace
								|| !closingBrace
								|| openingBrace.value !== "{"
								|| closingBrace.value !== "}"
							) {
								return null;
							}

							if (reusableNamespaceImport) {
								if (
									node.specifiers.length
										=== specifiers.length
								) {
									const lineStart = (
										sourceCode.text.lastIndexOf(
											"\n",
											node.range![0] - 1,
										) + 1
									);

									const lineEndIndex = (
										sourceCode.text.indexOf(
											"\n",
											node.range![1],
										)
									);

									const lineEnd = (
										lineEndIndex === -1
											? node.range![1]
											: lineEndIndex + 1
									);

									fixes.push(
										fixer.removeRange([
											lineStart,
											lineEnd,
										]),
									);
								} else {
									const previousToken = (
										sourceCode.getTokenBefore(
											openingBrace,
										)!
									);

									fixes.push(
										fixer.replaceTextRange(
											[
												previousToken.range[0],
												closingBrace.range[1],
											],
											"",
										),
									);
								}
							} else {
								fixes.push(
									fixer.replaceTextRange(
										[
											openingBrace.range[0],
											closingBrace.range[1],
										],
										`* as ${namespace}`,
									),
								);

								const allTypeOnly = (
									importKind !== "type"
									&& node.specifiers.length
										=== specifiers.length
									&& specifiers.every(
										(specifier) => (
											getImportKind(
												specifier,
											) === "type"
										),
									)
								);

								if (allTypeOnly) {
									const importToken = (
										sourceCode.getFirstToken(
											node,
										)
									);

									fixes.push(
										fixer.insertTextAfter(
											importToken,
											" type",
										),
									);
								}
							}

							for (
								const {
									reference,
									specifier,
								} of references
							) {
								const identifier = (
									reference.identifier
								);

								const imported = (
									specifier.imported
								);

								const access = (
									imported.type === "Identifier"
										? `${namespace}.${imported.name}`
										: `${namespace}[${sourceCode.getText(imported)}]`
								);

								const parent = (
									identifier as (
										typeof identifier & {
											parent?: {
												type?: string;
												shorthand?: boolean;
											};
										}
									)
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
