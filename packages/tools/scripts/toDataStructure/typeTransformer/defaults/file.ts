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
		addImport("@duplojs/server/dataStructure", "DSDataStructure", "namespace");

		return success(
			Typescript.factory.createCallExpression(
				Typescript.factory.createPropertyAccessExpression(
					Typescript.factory.createIdentifier("DSDataStructure"),
					Typescript.factory.createIdentifier("FileType"),
				),
				undefined,
				[],
			),
		);
	},
);
