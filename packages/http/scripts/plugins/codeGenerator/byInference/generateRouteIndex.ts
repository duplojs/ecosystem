import { TypescriptNativeAPI } from "@duplojs/tools/typescript";
import * as DInvocation from "@duplojs/lang/invocation";
import { type createTypescriptInstance } from "./createTypescriptInstance";
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DGenerator from "@duplojs/lang/generator";
import * as DPath from "@duplojs/lang/path";
import { type createContentRoutesFiles } from "./createContentRoutesFiles";
import * as DObject from "@duplojs/lang/object";

export async function generateRouteIndex(
	typescriptInstance: DInvocation.GetEvidenceResult<
		typeof createTypescriptInstance,
		"typescript-instance"
	>,
	files: DInvocation.GetEvidenceResult<
		typeof createContentRoutesFiles,
		"updated-route-files"
	>,
) {
	const statements = DCommon.pipe(
		files,
		DGenerator.reduce(
			DGenerator.reduceFrom<readonly TypescriptNativeAPI.ImportTypeNode[]>([]),
			({ item: [path, { variablesName }], lastValue, nextPush }) => DCommon.pipe(
				variablesName,
				DArray.map(
					(identifier) => TypescriptNativeAPI.factory.createImportTypeNode(
						false,
						DCommon.pipe(
							DPath.computeRelative(
								typescriptInstance.workDirectory,
								path,
							),
							(path) => TypescriptNativeAPI.factory.createStringLiteral(
								`./${path}`,
								TypescriptNativeAPI.TokenFlags.None,
							),
							TypescriptNativeAPI.factory.createLiteralTypeNode,
						),
						undefined,
						identifier,
					),
				),
				(value) => nextPush(
					lastValue,
					...value,
				),
			),
		),
		(importTypeNodes) => TypescriptNativeAPI.factory.createTypeAliasDeclaration(
			[TypescriptNativeAPI.factory.createToken(TypescriptNativeAPI.SyntaxKind.ExportKeyword)],
			TypescriptNativeAPI.factory.createIdentifier("Routes"),
			undefined,
			DArray.minElements(importTypeNodes, 1)
				? TypescriptNativeAPI.factory.createUnionTypeNode(importTypeNodes)
				: TypescriptNativeAPI.factory.createKeywordTypeNode(TypescriptNativeAPI.SyntaxKind.NeverKeyword),
		),
		DArray.coalescing,
	);

	const filePath = DPath.resolveFrom(
		typescriptInstance.workDirectory,
		[DCommon.cast("routes.ts")],
	);

	const fileName = TypescriptNativeAPI.toRootedFilePath(
		filePath,
		typescriptInstance.api.getCurrentDirectory(),
	);

	const path = TypescriptNativeAPI.tryPathKeyFromCanonical(
		typescriptInstance.api.getCanonicalFileName(fileName),
	);

	if (!path) {
		return DEither.left("failToCreatePathKey");
	}

	const contentImportFile = await DCommon.pipe(
		TypescriptNativeAPI.factory.createSourceFile(
			statements,
			TypescriptNativeAPI.factory.createToken(TypescriptNativeAPI.SyntaxKind.EndOfFile),
			"",
			fileName,
			path,
		),
		(updatedSource) => typescriptInstance.api.printer.printFile(updatedSource),
	);

	return DCommon.pipe(
		DObject.entry(filePath, contentImportFile),
		DInvocation.appendEvidence("generated-route-index-entry"),
	);
}
