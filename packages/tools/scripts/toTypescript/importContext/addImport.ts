import type { ImportKind, MapImportContext } from "./types";
import * as DArray from "@duplojs/lang/array";

export type AddImport = (
	path: string,
	typeName: string,
	type?: ImportKind,
) => void;

export function addImportToContext(
	importContext: MapImportContext,
	path: string,
	typeName: string,
	type: ImportKind,
) {
	const imports = importContext.get(path) ?? {};
	const identifiers = imports[type] ?? [];

	if (!DArray.includes(identifiers, typeName)) {
		importContext.set(
			path,
			{
				...imports,
				[type]: DArray.push(identifiers, typeName),
			},
		);
	}
}

export function createAddImport(
	importContext: MapImportContext,
): AddImport {
	return (
		path,
		typeName,
		type = "direct",
	) => void addImportToContext(
		importContext,
		path,
		typeName,
		type,
	);
}
