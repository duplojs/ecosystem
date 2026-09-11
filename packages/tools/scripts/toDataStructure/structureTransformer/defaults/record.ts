import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { Typescript } from "@scripts/typescript";
import { createStructureTransformer } from "../create";

export const recordStructureTransformer = createStructureTransformer(
	DDataStructure.structureIdentifier(
		DDataStructure.recordStructureKind,
	),
	(
		structure,
		{
			transformConstraint,
			transformer,
			success,
		},
	) => {
		const key = transformer(structure.definition.key);

		if (DEither.isLeft(key)) {
			return key;
		}

		const value = transformer(structure.definition.value);

		if (DEither.isLeft(value)) {
			return value;
		}

		const constraints = transformConstraint(structure.definition.constraints);

		if (DEither.isLeft(constraints)) {
			return constraints;
		}

		return success(
			Typescript.factory.createCallExpression(
				Typescript.factory.createPropertyAccessExpression(
					Typescript.factory.createIdentifier("DDataStructure"),
					Typescript.factory.createIdentifier("RecordStructure"),
				),
				undefined,
				[
					DEither.unwrapRight(key),
					DEither.unwrapRight(value),
					Typescript.factory.createArrayLiteralExpression(
						constraints,
						false,
					),
				],
			),
		);
	},
);
