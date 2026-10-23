import * as AST from "@typescript/native-API/ast";
import * as DInvocation from "@duplojs/lang/invocation";
import { type createTypescriptInstance } from "./createTypescriptInstance";
import { toRootedFilePath, tryPathKeyFromCanonical } from "@typescript/native-API/path";
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
			DGenerator.reduceFrom<readonly AST.ImportTypeNode[]>([]),
			({ item: [path, { variablesName }], lastValue, nextPush }) => DCommon.pipe(
				variablesName,
				DArray.map(
					(identifier) => AST.factory.createImportTypeNode(
						false,
						DCommon.pipe(
							DPath.computeRelative(
								typescriptInstance.workDirectory,
								path,
							),
							(path) => AST.factory.createStringLiteral(
								`./${path}`,
								AST.TokenFlags.None,
							),
							AST.factory.createLiteralTypeNode,
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
		(importTypeNodes) => AST.factory.createTypeAliasDeclaration(
			[AST.factory.createToken(AST.SyntaxKind.ExportKeyword)],
			AST.factory.createIdentifier("Routes"),
			undefined,
			DArray.minElements(importTypeNodes, 1)
				? AST.factory.createUnionTypeNode(importTypeNodes)
				: AST.factory.createKeywordTypeNode(AST.SyntaxKind.NeverKeyword),
		),
		DArray.coalescing,
	);

	const filePath = DPath.resolveFrom(
		typescriptInstance.workDirectory,
		[DCommon.cast("routes.ts")],
	);

	const fileName = toRootedFilePath(
		filePath,
		typescriptInstance.api.getCurrentDirectory(),
	);

	const path = tryPathKeyFromCanonical(
		typescriptInstance.api.getCanonicalFileName(fileName),
	);

	if (!path) {
		return DEither.left("failToCreatePathKey");
	}

	const contentImportFile = await DCommon.pipe(
		AST.factory.createSourceFile(
			statements,
			AST.factory.createToken(AST.SyntaxKind.EndOfFile),
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
