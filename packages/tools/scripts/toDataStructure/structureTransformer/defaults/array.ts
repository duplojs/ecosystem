import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { Typescript } from "@scripts/typescript";
import { createStructureTransformer } from "../create";

export const arrayStructureTransformer = createStructureTransformer(
	DDataStructure.structureIdentifier(
		DDataStructure.arrayStructureKind,
	),
	(
		structure,
		{
			transformConstraint,
			transformer,
			success,
		},
	) => {
		const element = transformer(structure.definition.element);

		if (DEither.isLeft(element)) {
			return element;
		}

		const constraints = transformConstraint(structure.definition.constraints);

		if (DEither.isLeft(constraints)) {
			return constraints;
		}

		return success(
			Typescript.factory.createCallExpression(
				Typescript.factory.createPropertyAccessExpression(
					Typescript.factory.createIdentifier("DDataStructure"),
					Typescript.factory.createIdentifier("ArrayStructure"),
				),
				undefined,
				[
					DEither.unwrapRight(element),
					Typescript.factory.createArrayLiteralExpression(
						constraints,
						false,
					),
				],
			),
		);
	},
);
