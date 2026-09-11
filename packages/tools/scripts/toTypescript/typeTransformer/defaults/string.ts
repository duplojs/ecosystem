import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer } from "../create";

export const stringTypeTransformer = createTypeTransformer(
	DDataStructure.typeIdentifier(DDataStructure.stringTypeKind),
	(
		_type,
		{ success },
	) => success(
		Typescript.factory.createKeywordTypeNode(
			Typescript.SyntaxKind.StringKeyword,
		),
	),
);
