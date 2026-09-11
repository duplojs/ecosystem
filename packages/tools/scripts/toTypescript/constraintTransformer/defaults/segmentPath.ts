import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createConstraintTransformer } from "../create";

export const segmentPathConstraintTransformer = createConstraintTransformer(
	DDataStructure.constraintIdentifier(
		DDataStructure.segmentPathConstraintKind,
	),
	(
		_constraint,
		{
			success,
			addImport,
		},
	) => {
		addImport("@duplojs/lang/path", "DPath", "namespace");

		return success(
			Typescript.factory.createTypeReferenceNode(
				Typescript.factory.createQualifiedName(
					Typescript.factory.createIdentifier("DPath"),
					Typescript.factory.createIdentifier("Segment"),
				),
			),
		);
	},
);
