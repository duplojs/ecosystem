import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DArray from "@duplojs/lang/array";
import { Typescript } from "@scripts/typescript";
import { createConstraintTransformer } from "../create";

export const allowedCharactersConstraintTransformer = createConstraintTransformer(
	DDataStructure.constraintIdentifier(
		DDataStructure.allowedCharactersConstraintKind,
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
				Typescript.factory.createIdentifier("AllowedCharactersConstraint"),
			),
			undefined,
			[
				Typescript.factory.createArrayLiteralExpression(
					DArray.map(
						DArray.coalescing(constraint.definition.charactersRange),
						(value) => Typescript.factory.createStringLiteral(value),
					),
					false,
				),
			],
		),
	),
);

