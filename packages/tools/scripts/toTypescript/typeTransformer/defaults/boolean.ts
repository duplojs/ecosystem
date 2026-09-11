import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer } from "../create";

export const booleanTypeTransformer = createTypeTransformer(
	DDataStructure.typeIdentifier(DDataStructure.booleanTypeKind),
	(
		_type,
		{ success },
	) => success(
		Typescript.factory.createKeywordTypeNode(
			Typescript.SyntaxKind.BooleanKeyword,
		),
	),
);
