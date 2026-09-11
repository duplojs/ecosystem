import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer } from "../create";

export const numberTypeTransformer = createTypeTransformer(
	DDataStructure.typeIdentifier(DDataStructure.numberTypeKind),
	(
		_type,
		{ success },
	) => success(
		Typescript.factory.createKeywordTypeNode(
			Typescript.SyntaxKind.NumberKeyword,
		),
	),
);
