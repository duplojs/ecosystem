import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createConstraintTransformer } from "../create";

export const strictPositiveConstraintTransformer = createConstraintTransformer(
	DDataStructure.constraintIdentifier(
		DDataStructure.strictPositiveConstraintKind,
	),
	(
		_constraint,
		{
			success,
		},
	) => success(
		Typescript.factory.createCallExpression(
			Typescript.factory.createPropertyAccessExpression(
				Typescript.factory.createIdentifier("DDataStructure"),
				Typescript.factory.createIdentifier("StrictPositiveConstraint"),
			),
			undefined,
			[],
		),
	),
);
