import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DSDataStructure from "@duplojs/server/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer } from "../create";

export const fileTypeTransformer = createTypeTransformer(
	DDataStructure.typeIdentifier(DSDataStructure.fileTypeKind),
	(
		_type,
		{
			success,
			addImport,
		},
	) => {
		addImport("@duplojs/server/file", "DSFile", "namespace");

		return success(
			Typescript.factory.createTypeReferenceNode(
				Typescript.factory.createQualifiedName(
					Typescript.factory.createIdentifier("DSFile"),
					Typescript.factory.createIdentifier("FileInterface"),
				),
			),
		);
	},
);
