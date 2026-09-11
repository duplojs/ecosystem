import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import { Typescript } from "@scripts/typescript";
import { createStructureTransformer } from "../create";

export const unionStructureTransformer = createStructureTransformer(
	DDataStructure.structureIdentifier(
		DDataStructure.unionStructureKind,
	),
	(
		structure,
		{
			transformConstraint,
			transformer,
			success,
		},
	) => {
		const values = DArray.reduce(
			structure.definition.values.value,
			DArray.reduceFrom<(Typescript.CallExpression | Typescript.Identifier)[]>([]),
			({
				element: value,
				lastValue,
				nextPush,
				exit,
			}) => DCommon.pipe(
				value,
				transformer,
				DCommon.when(
					DEither.isLeft,
					exit,
				),
				DEither.whenIsRight(
					(value) => nextPush(lastValue, value),
				),
			),
		);

		if (DEither.isLeft(values)) {
			return values;
		}

		const constraints = transformConstraint(structure.definition.constraints);

		if (DEither.isLeft(constraints)) {
			return constraints;
		}

		return success(
			Typescript.factory.createCallExpression(
				Typescript.factory.createPropertyAccessExpression(
					Typescript.factory.createIdentifier("DDataStructure"),
					Typescript.factory.createIdentifier("UnionStructure"),
				),
				undefined,
				[
					Typescript.factory.createArrayLiteralExpression(
						DEither.unwrapRight(values),
						false,
					),
					Typescript.factory.createArrayLiteralExpression(
						constraints,
						false,
					),
				],
			),
		);
	},
);
