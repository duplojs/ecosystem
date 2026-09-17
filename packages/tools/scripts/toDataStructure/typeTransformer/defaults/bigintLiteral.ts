import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer } from "../create";

export const bigintLiteralTypeTransformer = createTypeTransformer(
	DDataStructure.typeIdentifier(DDataStructure.bigintLiteralTypeKind),
	(
		type,
		{ success },
	) => success(
		Typescript.factory.createCallExpression(
			Typescript.factory.createPropertyAccessExpression(
				Typescript.factory.createIdentifier("DDataStructure"),
				Typescript.factory.createIdentifier("BigintLiteralType"),
			),
			undefined,
			[Typescript.factory.createBigIntLiteral(`${type.definition.value.toString()}n`)],
		),
	),
);
