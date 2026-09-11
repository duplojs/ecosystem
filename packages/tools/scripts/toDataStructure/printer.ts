
import * as DArray from "@duplojs/lang/array";
import * as DGenerator from "@duplojs/lang/generator";
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";
import * as DObject from "@duplojs/lang/object";
import * as DStoTS from "@scripts/toTypescript";
import { Typescript } from "@scripts/typescript";
import type { BuildedContext } from "./buildContext";

export function printer(params: BuildedContext) {
	const sourceFile = Typescript.createSourceFile("print.ts", "", Typescript.ScriptTarget.Latest, false, Typescript.ScriptKind.TS);
	const printer = Typescript.createPrinter();

	const dataStructureStatements = DGenerator.reduce(
		params.context.values(),
		DGenerator.reduceFrom<Typescript.VariableStatement[]>([]),
		({
			item: contextValue,
			lastValue,
			nextPush,
		}) => nextPush(
			lastValue,
			Typescript.factory.createVariableStatement(
				[Typescript.factory.createToken(Typescript.SyntaxKind.ExportKeyword)],
				Typescript.factory.createVariableDeclarationList(
					[
						Typescript.factory.createVariableDeclaration(
							contextValue.identifier,
							undefined,
							contextValue.typeIdentifier
								? Typescript.factory.createTypeReferenceNode(
									Typescript.factory.createQualifiedName(
										Typescript.factory.createIdentifier("DDataStructure"),
										Typescript.factory.createIdentifier("Structure"),
									),
									[
										Typescript.factory.createTypeReferenceNode(contextValue.typeIdentifier),
										Typescript.factory.createKeywordTypeNode(Typescript.SyntaxKind.UnknownKeyword),
									],
								)
								: undefined,
							contextValue.expression,
						),
					],
					Typescript.NodeFlags.Const,
				),
			),
		),
	);

	const importContext = DCommon.pipe(
		params.context.values(),
		DGenerator.map(
			(contextValue) => contextValue.import.entries(),
		),
		DGenerator.flat,
		DGenerator.concat(
			params.toTypescript.importContext.entries(),
		),
		DGenerator.reduce(
			DGenerator.reduceFrom<DStoTS.MapImportContext>(new Map()),
			({ item: [path, imports], lastValue, next }) => DCommon.pipe(
				imports,
				DObject.entries,
				DArray.map(
					([type, values]) => DArray.map(
						values ?? [],
						(value) => DObject.entry(type, value),
					),
				),
				DArray.flat,
				DArray.map(
					([type, value]) => void DStoTS.addImportToContext(lastValue, path, value, type),
				),
				DCommon.justReturn(next(lastValue)),
			),
		),
	);

	return DCommon.pipe(
		[
			...DStoTS.createImportDeclaration(importContext),
			...params.toTypescript.context.values(),
			...dataStructureStatements,
		],
		DArray.map(
			(value) => printer.printNode(
				Typescript.EmitHint.Unspecified,
				value,
				sourceFile,
			),
		),
		DString.join("\n\n"),
		DString.trim,
	);
}
