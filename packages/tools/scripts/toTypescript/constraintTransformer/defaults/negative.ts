import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createConstraintTransformer } from "../create";

export const negativeConstraintTransformer = createConstraintTransformer(
	DDataStructure.constraintIdentifier(
		DDataStructure.negativeConstraintKind,
	),
	(
		_constraint,
		{
			success,
			addImport,
		},
	) => {
		addImport("@duplojs/lang/number", "DNumber", "namespace");

		return success(
			Typescript.factory.createTypeReferenceNode(
				Typescript.factory.createQualifiedName(
					Typescript.factory.createIdentifier("DNumber"),
					Typescript.factory.createIdentifier("Negative"),
				),
			),
		);
	},
);
