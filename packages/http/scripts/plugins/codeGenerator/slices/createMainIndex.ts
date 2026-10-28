import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import { TypescriptNativeAPI } from "@duplojs/tools";
import * as DString from "@duplojs/lang/string";
import type * as DPath from "@duplojs/lang/path";

export function createMainIndex(names: readonly (string & DPath.Segment & DString.AllowedCharacters<"A-Z" | "a-z">)[]) {
	return DCommon.pipe(
		names,
		DArray.map(
			(name) => TypescriptNativeAPI.factory.createExportDeclaration(
				undefined,
				false,
				DCommon.pipe(
					name,
					DString.capitalize,
					TypescriptNativeAPI.factory.createIdentifier,
					TypescriptNativeAPI.factory.createNamespaceExport,
				),
				TypescriptNativeAPI.factory.createStringLiteral(
					`./${name}.ts`,
					TypescriptNativeAPI.TokenFlags.None,
				),
			),
		),
		(statements) => {
			const api = new TypescriptNativeAPI.API();

			return DCommon.asyncPipe(
				statements,
				DArray.map((statement) => api.printer.printNode(statement)),
				DCommon.promiseAll,
				DString.join("\n"),
				DCommon.tap(() => api.close()),
			);
		},
	);
}
