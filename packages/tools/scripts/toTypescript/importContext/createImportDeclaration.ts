import { Typescript } from "@scripts/typescript";
import type { MapImportContext } from "./types";

export function createImportDeclaration(
	importContext: MapImportContext,
): Typescript.ImportDeclaration[] {
	const declarations: Typescript.ImportDeclaration[] = [];

	for (const [path, imports] of importContext) {
		const namespaceIdentifiers = [...(imports.namespace ?? [])];
		const defaultIdentifiers = [...(imports.default ?? [])];
		const directIdentifiers = [...(imports.direct ?? [])];

		for (const identifier of namespaceIdentifiers) {
			declarations.push(
				Typescript.factory.createImportDeclaration(
					undefined,
					Typescript.factory.createImportClause(
						undefined,
						undefined,
						Typescript.factory.createNamespaceImport(
							Typescript.factory.createIdentifier(identifier),
						),
					),
					Typescript.factory.createStringLiteral(path),
					undefined,
				),
			);
		}

		for (const identifier of defaultIdentifiers) {
			declarations.push(
				Typescript.factory.createImportDeclaration(
					undefined,
					Typescript.factory.createImportClause(
						undefined,
						Typescript.factory.createIdentifier(identifier),
						undefined,
					),
					Typescript.factory.createStringLiteral(path),
					undefined,
				),
			);
		}

		if (directIdentifiers.length !== 0) {
			declarations.push(
				Typescript.factory.createImportDeclaration(
					undefined,
					Typescript.factory.createImportClause(
						undefined,
						undefined,
						Typescript.factory.createNamedImports(
							directIdentifiers.map(
								(identifier) => Typescript.factory.createImportSpecifier(
									false,
									undefined,
									Typescript.factory.createIdentifier(identifier),
								),
							),
						),
					),
					Typescript.factory.createStringLiteral(path),
					undefined,
				),
			);
		}
	}

	return declarations;
}
