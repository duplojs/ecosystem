import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer } from "../create";

export const undefinedTypeTransformer = createTypeTransformer(
	DDataStructure.typeIdentifier(DDataStructure.undefinedTypeKind),
	(
		_type,
		{ success },
	) => success(
		Typescript.factory.createCallExpression(
			Typescript.factory.createPropertyAccessExpression(
				Typescript.factory.createIdentifier("DDataStructure"),
				Typescript.factory.createIdentifier("UndefinedType"),
			),
			undefined,
			[],
		),
	),
);
