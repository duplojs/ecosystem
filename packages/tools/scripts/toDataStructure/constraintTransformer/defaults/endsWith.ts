import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createConstraintTransformer } from "../create";

export const endsWithConstraintTransformer = createConstraintTransformer(
	DDataStructure.constraintIdentifier(
		DDataStructure.endsWithConstraintKind,
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
				Typescript.factory.createIdentifier("EndsWithConstraint"),
			),
			undefined,
			[Typescript.factory.createStringLiteral(constraint.definition.searchString)],
		),
	),
);
