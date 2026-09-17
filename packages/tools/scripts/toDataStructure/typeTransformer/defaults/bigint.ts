import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer } from "../create";

export const bigintTypeTransformer = createTypeTransformer(
	DDataStructure.typeIdentifier(DDataStructure.bigintTypeKind),
	(
		_type,
		{ success },
	) => success(
		Typescript.factory.createCallExpression(
			Typescript.factory.createPropertyAccessExpression(
				Typescript.factory.createIdentifier("DDataStructure"),
				Typescript.factory.createIdentifier("BigintType"),
			),
			undefined,
			[],
		),
	),
);
