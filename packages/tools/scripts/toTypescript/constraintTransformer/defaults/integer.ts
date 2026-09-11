import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createConstraintTransformer } from "../create";

export const integerConstraintTransformer = createConstraintTransformer(
	DDataStructure.constraintIdentifier(
		DDataStructure.integerConstraintKind,
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
					Typescript.factory.createIdentifier("Integer"),
				),
			),
		);
	},
);
