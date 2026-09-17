import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer } from "../create";

export const booleanTypeTransformer = createTypeTransformer(
	DDataStructure.typeIdentifier(DDataStructure.booleanTypeKind),
	(
		_type,
		{ success },
	) => success(
		Typescript.factory.createCallExpression(
			Typescript.factory.createPropertyAccessExpression(
				Typescript.factory.createIdentifier("DDataStructure"),
				Typescript.factory.createIdentifier("BooleanType"),
			),
			undefined,
			[],
		),
	),
);
