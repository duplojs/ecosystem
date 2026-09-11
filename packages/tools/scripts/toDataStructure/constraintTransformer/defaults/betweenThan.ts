import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createConstraintTransformer } from "../create";

export const betweenThanConstraintTransformer = createConstraintTransformer(
	DDataStructure.constraintIdentifier(
		DDataStructure.betweenThanConstraintKind,
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
				Typescript.factory.createIdentifier("BetweenThanConstraint"),
			),
			undefined,
			[
				Typescript.factory.createNumericLiteral(constraint.definition.greater),
				Typescript.factory.createNumericLiteral(constraint.definition.less),
			],
		),
	),
);
