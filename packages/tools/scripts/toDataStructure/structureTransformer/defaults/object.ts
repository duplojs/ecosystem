import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import { Typescript } from "@scripts/typescript";
import { createStructureTransformer } from "../create";

export const objectStructureTransformer = createStructureTransformer(
	DDataStructure.structureIdentifier(
		DDataStructure.objectStructureKind,
	),
	(
		structure,
		{
			transformConstraint,
			transformer,
			success,
		},
	) => {
		const entries = DCommon.pipe(
			structure.definition.shape.value,
			DArray.reduce(
				DArray.reduceFrom<Typescript.PropertyAssignment[]>([]),
				({
					element,
					lastValue,
					nextPush,
					exit,
				}) => DCommon.pipe(
					element.value,
					transformer,
					DCommon.when(
						DEither.isLeft,
						exit,
					),
					DEither.whenIsRight(
						(value) => nextPush(
							lastValue,
							Typescript.factory.createPropertyAssignment(
								Typescript.factory.createIdentifier(element.key),
								value,
							),
						),
					),
				),
			),
		);

		if (DEither.isLeft(entries)) {
			return entries;
		}

		const constraints = transformConstraint(structure.definition.constraints);

		if (DEither.isLeft(constraints)) {
			return constraints;
		}

		return success(
			Typescript.factory.createCallExpression(
				Typescript.factory.createPropertyAccessExpression(
					Typescript.factory.createIdentifier("DDataStructure"),
					Typescript.factory.createIdentifier("ObjectStructure"),
				),
				undefined,
				[
					Typescript.factory.createObjectLiteralExpression(
						entries,
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
