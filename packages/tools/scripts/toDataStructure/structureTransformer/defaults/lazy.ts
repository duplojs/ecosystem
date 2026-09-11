import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { Typescript } from "@scripts/typescript";
import { createStructureTransformer } from "../create";

export const lazyStructureTransformer = createStructureTransformer(
	DDataStructure.structureIdentifier(
		DDataStructure.lazyStructureKind,
	),
	(
		structure,
		{
			transformConstraint,
			transformer,
			success,
		},
	) => {
		const getter = transformer(structure.definition.getter.value);

		if (DEither.isLeft(getter)) {
			return getter;
		}

		const constraints = transformConstraint(structure.definition.constraints);

		if (DEither.isLeft(constraints)) {
			return constraints;
		}

		return success(
			Typescript.factory.createCallExpression(
				Typescript.factory.createPropertyAccessExpression(
					Typescript.factory.createIdentifier("DDataStructure"),
					Typescript.factory.createIdentifier("LazyStructure"),
				),
				undefined,
				[
					Typescript.factory.createArrowFunction(
						undefined,
						undefined,
						[],
						undefined,
						Typescript.factory.createToken(Typescript.SyntaxKind.EqualsGreaterThanToken),
						Typescript.factory.createCallExpression(
							DEither.unwrapRight(getter),
							undefined,
							[],
						),
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
