import * as AST from "@typescript/native-API/ast";
import * as DInvocation from "@duplojs/lang/invocation";
import { type createTypescriptInstance } from "./createTypescriptInstance";
import * as DPath from "@duplojs/lang/path";
import * as DCommon from "@duplojs/lang/common";
import * as DGenerator from "@duplojs/lang/generator";
import * as DArray from "@duplojs/lang/array";
import * as DString from "@duplojs/lang/string";
import { type Project } from "@typescript/native-API/async";
import * as DEither from "@duplojs/lang/either";

async function isRouteHandler(
	node: AST.CallExpression,
	project: Project,
): Promise<boolean> {
	if (
		!AST.isPropertyAccessExpression(node.expression)
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
			({ path }) => DString.includes(path, "/@duplojs/http/")
			|| DString.includes(path, "/packages/http/"),
		)
	);
}

async function isRouteVariable(
	node: AST.VariableDeclaration,
	project: Project,
): Promise<boolean> {
	if (!AST.isIdentifier(node.name) || !node.initializer) {
		return false;
	}

	const type = await project.checker.getTypeAtLocation(node.name);
	const symbol = await type.getSymbol();

	return symbol?.name === "Route"
		&& DArray.some(
			symbol.declarations,
			({ path }) => DString.includes(path, "/@duplojs/http/")
			|| DString.includes(path, "/packages/http/"),
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
						variablesName: readonly AST.Identifier[];
					}
				>
			>(new Map()),
			async({ item, lastValue, exit, next }) => {
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
							statements: readonly AST.StatementBase[];
							variablesName: readonly AST.Identifier[];
						}>({
							statements: [],
							variablesName: [],
						}),
						async({ item: statement, lastValue: subLastValue, index, next }) => {
							if (
								AST.isExpressionStatement(statement)
								&& AST.isCallExpression(statement.expression)
								&& await isRouteHandler(statement.expression, typescriptInstance.project)
							) {
								const variableIdentifier = AST.factory.createIdentifier(`__duploRoute_${lastValue.size}_${index}`);

								return next({
									variablesName: DArray.push(subLastValue.variablesName, variableIdentifier),
									statements: DArray.push(
										subLastValue.statements,
										AST.factory.createVariableStatement(
											undefined,
											AST.factory.createVariableDeclarationList(
												[
													AST.factory.createVariableDeclaration(
														variableIdentifier,
														undefined,
														undefined,
														statement.expression,
													),
												],
												AST.NodeFlags.Const,
											),
										),
										AST.factory.createTypeAliasDeclaration(
											[AST.factory.createToken(AST.SyntaxKind.ExportKeyword)],
											variableIdentifier,
											undefined,
											AST.factory.createImportTypeNode(
												false,
												AST.factory.createLiteralTypeNode(
													AST.factory.createStringLiteral("@duplojs/http", AST.TokenFlags.None),
												),
												undefined,
												AST.factory.createIdentifier("RefineRouteTypeDeclaration"),
												[
													AST.factory.createTypeQueryNode(
														variableIdentifier,
														undefined,
													),
												],
											),
										),
									),
								});
							}

							if (
								AST.isVariableDeclaration(statement)
								&& AST.isIdentifier(statement.name)
								&& await isRouteVariable(statement, typescriptInstance.project)
							) {
								return next({
									variablesName: DArray.push(subLastValue.variablesName, statement.name),
									statements: DArray.push(
										subLastValue.statements,
										statement,
										AST.factory.createTypeAliasDeclaration(
											[AST.factory.createToken(AST.SyntaxKind.ExportKeyword)],
											statement.name,
											undefined,
											AST.factory.createImportTypeNode(
												false,
												AST.factory.createLiteralTypeNode(
													AST.factory.createStringLiteral("@duplojs/http/codeGenerator", AST.TokenFlags.None),
												),
												undefined,
												AST.factory.createIdentifier("RouteToClientRoute"),
												[
													AST.factory.createTypeQueryNode(
														statement.name,
														undefined,
													),
												],
											),
										),
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
					AST.factory.updateSourceFile(
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
