import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createConstraintTransformer } from "../create";

export const startsWithConstraintTransformer = createConstraintTransformer(
	DDataStructure.constraintIdentifier(
		DDataStructure.startsWithConstraintKind,
	),
	(
		constraint,
		{
			success,
		},
	) => success(
		Typescript.factory.createCallExpression(
			Typescript.factory.createPropertyAccessExpression(
				Typescript.factory.createIdentifier("DDataStructure"),
				Typescript.factory.createIdentifier("StartsWithConstraint"),
			),
			undefined,
			[Typescript.factory.createStringLiteral(constraint.definition.searchString)],
		),
	),
);
