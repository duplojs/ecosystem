import { TypescriptNativeAPI } from "@duplojs/tools/typescript";
import * as DInvocation from "@duplojs/lang/invocation";
import { type createTypescriptInstance } from "./createTypescriptInstance";
import * as DPath from "@duplojs/lang/path";
import * as DCommon from "@duplojs/lang/common";
import * as DGenerator from "@duplojs/lang/generator";
import * as DArray from "@duplojs/lang/array";
import * as DString from "@duplojs/lang/string";
import * as DEither from "@duplojs/lang/either";

async function isRouteHandler(
	node: TypescriptNativeAPI.CallExpression,
	project: TypescriptNativeAPI.Project,
): Promise<boolean> {
	if (
		!TypescriptNativeAPI.isPropertyAccessExpression(node.expression)
		|| node.expression.name.text !== "handler"
	) {
		return false;
	}

	const signature = await project.checker.getResolvedSignature(node);

	if (await project.checker.isUnknownSignature(signature)) {
		return false;
	}

	const type = await signature.getReturnType();
	const symbol = await type.getSymbol();

	return (
		symbol?.name === "Route"
		&& DArray.some(
			symbol.declarations,
			({ path }) => DString.includes(path, "http/dist"),
		)
	);
}

async function isRouteVariable(
	node: TypescriptNativeAPI.VariableStatement,
	project: TypescriptNativeAPI.Project,
): Promise<boolean> {
	const declaration = DArray.first(node.declarationList.declarations);

	if (
		!DArray.includes([
			TypescriptNativeAPI.NodeFlags.Const,
			TypescriptNativeAPI.NodeFlags.Let,
		], node.declarationList.flags)
		|| !declaration?.initializer
	) {
		return false;
	}

	const type = await project.checker.getTypeAtLocation(declaration.name);
	const symbol = await type.getSymbol();

	return (
		symbol?.name === "Route"
		&& DArray.some(
			symbol.declarations,
			({ path }) => DString.includes(path, "http/dist"),
		)
	);
}

function createRouteTypeDeclaration(identifier: TypescriptNativeAPI.Identifier) {
	return TypescriptNativeAPI.factory.createTypeAliasDeclaration(
		[TypescriptNativeAPI.factory.createToken(TypescriptNativeAPI.SyntaxKind.ExportKeyword)],
		identifier,
		undefined,
		TypescriptNativeAPI.factory.createImportTypeNode(
			false,
			TypescriptNativeAPI.factory.createLiteralTypeNode(
				TypescriptNativeAPI.factory.createStringLiteral("@duplojs/http", TypescriptNativeAPI.TokenFlags.None),
			),
			undefined,
			TypescriptNativeAPI.factory.createIdentifier("RouteDeclarationToContract"),
			[
				TypescriptNativeAPI.factory.createTypeQueryNode(
					identifier,
					undefined,
				),
			],
		),
	);
}

export interface UpdateRoutesFilesParams {
	isRoutePath: DPath.PathMatcher;
}

export function createContentRoutesFiles(
	typescriptInstance: DInvocation.GetEvidenceResult<
		typeof createTypescriptInstance,
		"typescript-instance"
	>,
	params: UpdateRoutesFilesParams,
) {
	return DEither.rightAsyncPipe(
		typescriptInstance.project.program.getSourceFileNames(),
		DGenerator.map(DPath.normalize),
		DGenerator.filter(DCommon.isType("string")),
		DGenerator.filter((path) => params.isRoutePath(path)),
		DGenerator.filter(DPath.isAbsolute),
		DGenerator.asyncReduce(
			DGenerator.reduceFrom<
				Map<
					string & DPath.Path & DPath.Absolute,
					{
						content: string;
						variablesName: readonly TypescriptNativeAPI.Identifier[];
					}
				>
			>(new Map()),
			async({ item, lastValue, next }) => {
				const sourceFile = await typescriptInstance.project.program.getSourceFile(item);

				if (!sourceFile) {
					return next(lastValue);
				}

				const {
					statements,
					variablesName,
				} = await DCommon.asyncPipe(
					sourceFile.statements,
					DGenerator.asyncReduce(
						DGenerator.reduceFrom<{
							statements: readonly TypescriptNativeAPI.StatementBase[];
							variablesName: readonly TypescriptNativeAPI.Identifier[];
						}>({
							statements: [],
							variablesName: [],
						}),
						async({ item: statement, lastValue: subLastValue, index, next }) => {
							if (
								TypescriptNativeAPI.isExpressionStatement(statement)
								&& TypescriptNativeAPI.isCallExpression(statement.expression)
								&& await isRouteHandler(statement.expression, typescriptInstance.project)
							) {
								const variableIdentifier = TypescriptNativeAPI.factory.createIdentifier(`__duploRoute_${lastValue.size}_${index}`);

								return next({
									variablesName: DArray.push(subLastValue.variablesName, variableIdentifier),
									statements: DArray.push(
										subLastValue.statements,
										TypescriptNativeAPI.factory.createVariableStatement(
											undefined,
											TypescriptNativeAPI.factory.createVariableDeclarationList(
												[
													TypescriptNativeAPI.factory.createVariableDeclaration(
														variableIdentifier,
														undefined,
														undefined,
														statement.expression,
													),
												],
												TypescriptNativeAPI.NodeFlags.Const,
											),
										),
										createRouteTypeDeclaration(variableIdentifier),
									),
								});
							}

							const variableIdentifierOfRoute = await DCommon.justExec(async() => {
								if (
									!TypescriptNativeAPI.isVariableStatement(statement)
									|| !DArray.minElements(statement.declarationList.declarations, 1)
									|| !(await isRouteVariable(statement, typescriptInstance.project))
								) {
									return null;
								}

								const variableDeclaration = DArray.first(statement.declarationList.declarations);

								if (!TypescriptNativeAPI.isIdentifier(variableDeclaration.name)) {
									return null;
								}

								return variableDeclaration.name;
							});

							if (variableIdentifierOfRoute) {
								return next({
									variablesName: DArray.push(
										subLastValue.variablesName,
										variableIdentifierOfRoute,
									),
									statements: DArray.push(
										subLastValue.statements,
										statement,
										createRouteTypeDeclaration(variableIdentifierOfRoute),
									),
								});
							}

							return next({
								variablesName: subLastValue.variablesName,
								statements: DArray.push(subLastValue.statements, statement),
							});
						},
					),
				);

				const content = await DCommon.pipe(
					TypescriptNativeAPI.factory.updateSourceFile(
						sourceFile,
						statements,
						sourceFile.endOfFileToken,
					),
					(updatedSource) => typescriptInstance.api.printer.printFile(updatedSource, {
						preserveSourceNewlines: true,
					}),
				);

				lastValue.set(item, {
					content,
					variablesName,
				});
				return next(lastValue);
			},
		),
		DInvocation.appendEvidence("updated-route-files"),
	);
}
