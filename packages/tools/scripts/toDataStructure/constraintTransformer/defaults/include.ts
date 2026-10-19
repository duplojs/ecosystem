import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createConstraintTransformer } from "../create";

export const includeConstraintTransformer = createConstraintTransformer(
	DDataStructure.constraintIdentifier(
		DDataStructure.includeConstraintKind,
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
				Typescript.factory.createIdentifier("IncludeConstraint"),
			),
			undefined,
			[Typescript.factory.createStringLiteral(constraint.definition.searchString)],
		),
	),
);
