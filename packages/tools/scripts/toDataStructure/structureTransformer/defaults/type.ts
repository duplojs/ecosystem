import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { Typescript } from "@scripts/typescript";
import { createStructureTransformer } from "../create";

export const typeStructureTransformer = createStructureTransformer(
	DDataStructure.structureIdentifier(
		DDataStructure.typeStructureKind,
	),
	(
		structure,
		{
			transformConstraint,
			transformType,
			success,
		},
	) => {
		const constraints = transformConstraint(structure.definition.constraints);

		if (DEither.isLeft(constraints)) {
			return constraints;
		}

		const typeExpression = transformType(structure.definition.type);

		if (DEither.isLeft(typeExpression)) {
			return typeExpression;
		}

		return success(
			Typescript.factory.createCallExpression(
				Typescript.factory.createPropertyAccessExpression(
					Typescript.factory.createIdentifier("DDataStructure"),
					Typescript.factory.createIdentifier("TypeStructure"),
				),
				undefined,
				[
					DEither.unwrapRight(typeExpression),
					Typescript.factory.createArrayLiteralExpression(
						constraints,
						true,
					),
				],
			),
		);
	},
);
