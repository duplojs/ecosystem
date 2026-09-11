import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";
import * as DEither from "@duplojs/lang/either";
import { Typescript } from "@scripts/typescript";
import { createStructureTransformer } from "../create";

export const newTypeStructureTransformer = createStructureTransformer(
	DDataStructure.structureIdentifier(
		DModeling.newTypeStructureKind,
	),
	(
		structure,
		{
			transformConstraint,
			transformer,
			success,
			addImport,
		},
	) => {
		const inner = transformer(structure.definition.inner);

		if (DEither.isLeft(inner)) {
			return inner;
		}

		const constraints = transformConstraint(structure.definition.newTypeConstraints);

		if (DEither.isLeft(constraints)) {
			return constraints;
		}

		addImport("@duplojs/lang/modeling", "DModeling", "namespace");

		return success(
			Typescript.factory.createCallExpression(
				Typescript.factory.createPropertyAccessExpression(
					Typescript.factory.createIdentifier("DModeling"),
					Typescript.factory.createIdentifier("NewTypeStructure"),
				),
				undefined,
				[
					Typescript.factory.createStringLiteral(structure.name),
					DEither.unwrapRight(inner),
					Typescript.factory.createArrayLiteralExpression(
						constraints,
						false,
					),
				],
			),
		);
	},
);
