import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer } from "../create";

export const dateTypeTransformer = createTypeTransformer(
	DDataStructure.typeIdentifier(DDataStructure.dateTypeKind),
	(
		_type,
		{
			success,
			addImport,
		},
	) => {
		addImport("@duplojs/lang/chrono", "DChrono", "namespace");

		return success(
			Typescript.factory.createTypeReferenceNode(
				Typescript.factory.createQualifiedName(
					Typescript.factory.createIdentifier("DChrono"),
					Typescript.factory.createIdentifier("TheDate"),
				),
			),
		);
	},
);
